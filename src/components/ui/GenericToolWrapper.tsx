import React, { useState, useEffect, useRef, ErrorInfo, Component, ReactNode, createContext, useContext } from "react";
import { Copy, RefreshCw, Wand2, Loader2, AlertCircle } from "lucide-react";

// Context to avoid duplicate nesting of wrappers
const GenericToolWrapperContext = createContext<boolean>(false);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  private handlePromiseError = (event: PromiseRejectionEvent) => {
    this.setState({
      hasError: true,
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason || "Unhandled async rejection")),
    });
  };

  componentDidMount() {
    window.addEventListener("unhandledrejection", this.handlePromiseError);
  }

  componentWillUnmount() {
    window.removeEventListener("unhandledrejection", this.handlePromiseError);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Tool crash caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl m-6">
          <div className="flex items-center gap-3 text-red-400 mb-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <h3 className="font-bold text-lg">Operation Error</h3>
          </div>
          <p className="text-sm text-slate-300 mb-5 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800 break-all max-h-40 overflow-y-auto">
            {this.state.error?.message || "Unknown error encountered"}
          </p>
          <button 
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-900/10"
          >
            Reset & Clear Tool
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GenericToolWrapper({ children, toolName }: { children: ReactNode, toolName: string }) {
  const isAlreadyWrapped = useContext(GenericToolWrapperContext);

  if (isAlreadyWrapped) {
    return <>{children}</>;
  }

  return (
    <GenericToolWrapperContext.Provider value={true}>
      <GenericToolWrapperInner toolName={toolName}>
        {children}
      </GenericToolWrapperInner>
    </GenericToolWrapperContext.Provider>
  );
}

function GenericToolWrapperInner({ children, toolName }: { children: ReactNode, toolName: string }) {
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const inputs = container.querySelectorAll("input, textarea, select") as NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    
    // Load from local storage with checkbox support
    const stored = localStorage.getItem(`tools_${toolName}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        inputs.forEach((input, index) => {
          const item = parsed[index];
          if (item !== undefined) {
             const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
             const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
             const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
             
             if (input.type === "checkbox" || input.type === "radio") {
                (input as HTMLInputElement).checked = !!item.checked;
             } else {
                if (input.tagName === "INPUT" && nativeInputValueSetter) {
                   nativeInputValueSetter.call(input, item.value || "");
                } else if (input.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
                   nativeTextAreaValueSetter.call(input, item.value || "");
                } else if (input.tagName === "SELECT" && nativeSelectValueSetter) {
                   nativeSelectValueSetter.call(input, item.value || "");
                } else {
                   input.value = item.value || "";
                }
             }
             
             input.dispatchEvent(new Event('change', { bubbles: true }));
             input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      } catch (e) {
        console.error("Local storage load failed for", toolName, e);
      }
    }

    // Attach listeners to intercept input validation & auto-save
    const handleChange = (e: Event) => {
       const target = e.target as HTMLInputElement;
       if (target.type === "number") {
          const val = Number(target.value);
          if (val < 0) {
              target.value = "0"; // prevent negative bounds
              target.dispatchEvent(new Event('change', { bubbles: true }));
          }
       }
       if (target.type === "text" || target.tagName === "TEXTAREA") {
          if (target.value.length > 5000) {
             target.value = target.value.substring(0, 5000); // safety cap
             target.dispatchEvent(new Event('change', { bubbles: true }));
          }
       }

       // Save state across all inputs
       try {
         const currentVals = Array.from(inputs).map(i => {
           if (i.type === "checkbox" || i.type === "radio") {
             return { type: i.type, checked: (i as HTMLInputElement).checked, value: i.value };
           }
           return { type: i.type, value: i.value };
         });
         localStorage.setItem(`tools_${toolName}`, JSON.stringify(currentVals));
       } catch (err) {}
    };

    inputs.forEach(input => {
       input.addEventListener('change', handleChange);
       input.addEventListener('input', handleChange);
    });

    return () => {
       inputs.forEach(input => {
          input.removeEventListener('change', handleChange);
          input.removeEventListener('input', handleChange);
       });
    };
  }, [key, toolName]);

  // Handle custom manual trigger events for loading states
  useEffect(() => {
    const handleToggleLoading = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.loading !== undefined) {
        setIsLoading(customEvent.detail.loading);
      }
    };

    window.addEventListener("toggle-tool-loading", handleToggleLoading as EventListener);
    return () => {
      window.removeEventListener("toggle-tool-loading", handleToggleLoading as EventListener);
    };
  }, []);

  // Capture submit action clicks inside inputs to trigger a rich calculation feedback effect
  const handleContainerClick = (e: React.MouseEvent) => {
    const button = (e.target as HTMLElement).closest("button");
    if (!button) return;

    // Skip toolbar system buttons
    if (
      button.innerText.includes("Sample") || 
      button.innerText.includes("Reset") || 
      button.innerText.includes("Copy") ||
      button.disabled
    ) {
      return;
    }

    // Simulate standard feedback load state for non-instant workflows
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  const handleCopy = () => {
    const container = containerRef.current;
    if (!container) return;
    
    // 1. Target output elements
    const textareas = container.querySelectorAll("textarea") as NodeListOf<HTMLTextAreaElement>;
    const readOnlyTextarea = Array.from(textareas).find(t => t.readOnly);
    if (readOnlyTextarea && readOnlyTextarea.value) {
      navigator.clipboard.writeText(readOnlyTextarea.value.trim());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return;
    }
    
    // 2. Class-based targets
    const resultElement = container.querySelector(".result, .output, #result, #output") as HTMLElement;
    if (resultElement) {
      const text = resultElement.innerText || resultElement.textContent;
      if (text) {
        navigator.clipboard.writeText(text.trim());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      }
    }

    // 3. Structured text blocks
    const preElement = container.querySelector("pre, code") as HTMLElement;
    if (preElement) {
      const text = preElement.innerText || preElement.textContent;
      if (text) {
        navigator.clipboard.writeText(text.trim());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      }
    }
    
    // 4. Large headers results
    const outputs = container.querySelectorAll(".text-4xl, .text-5xl, .text-3xl") as NodeListOf<HTMLElement>;
    if (outputs.length > 0) {
      let results: string[] = [];
      outputs.forEach(o => { if (o.innerText) results.push(o.innerText.trim()); });
      if (results.length > 0) {
        navigator.clipboard.writeText(results.join(" | "));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      }
    }
    
    // 5. Normal text fallback
    const textToCopy = container.innerText || "";
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fillSample = () => {
     const container = containerRef.current;
     if (!container) return;
     const inputs = container.querySelectorAll("input, textarea, select") as NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
     
     inputs.forEach(input => {
       let sample = "100";
       const placeholder = ("placeholder" in input ? (input as HTMLInputElement | HTMLTextAreaElement).placeholder || "" : "").toLowerCase();
       const name = (input.name || "").toLowerCase();
       const id = (input.id || "").toLowerCase();
       const type = input.type;
       
       if (type === "number") {
         const min = Number((input as HTMLInputElement).min) || 0;
         const max = Number((input as HTMLInputElement).max) || 100;
         sample = String(Math.floor((min + max) / 2) || 15);
       } else if (type === "color") {
         sample = "#3b82f6";
       } else if (type === "email") {
         sample = "hello@example.com";
       } else if (placeholder.includes("json") || name.includes("json") || id.includes("json")) {
         sample = '{ "name": "John Doe", "age": 30, "city": "New York", "skills": ["React", "TypeScript"] }';
       } else if (placeholder.includes("csv") || name.includes("csv")) {
         sample = "Name,Age,Active\nJohn,30,true\nJane,25,false";
       } else if (placeholder.includes("regex") || name.includes("regex")) {
         sample = "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}";
       } else if (placeholder.includes("css") || name.includes("css")) {
         sample = "body { background-color: #0f172a; color: #f8fafc; }";
       } else if (input.tagName === "SELECT") {
         const select = input as HTMLSelectElement;
         if (select.options.length > 1) {
           select.selectedIndex = 1;
         } else if (select.options.length > 0) {
           select.selectedIndex = 0;
         }
         sample = select.value;
       } else {
         sample = placeholder || "Example calculation data";
         if (sample.length < 5) {
           sample = "Example text input values for " + toolName.replace(/([A-Z])/g, ' $1').trim();
         }
       }
       
       const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
       const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
       const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
       
       if (input.tagName === "INPUT" && nativeInputValueSetter) {
         nativeInputValueSetter.call(input, sample);
       } else if (input.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
         nativeTextAreaValueSetter.call(input, sample);
       } else if (input.tagName === "SELECT" && nativeSelectValueSetter) {
         nativeSelectValueSetter.call(input, sample);
       } else {
         input.value = sample;
       }
       
       input.dispatchEvent(new Event('change', { bubbles: true }));
       input.dispatchEvent(new Event('input', { bubbles: true }));
     });
  };

  const handleReset = () => {
     localStorage.removeItem(`tools_${toolName}`);
     const container = containerRef.current;
     if (container) {
       const inputs = container.querySelectorAll("input, textarea") as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
       inputs.forEach(input => {
         if (input.type === "checkbox" || input.type === "radio") {
           (input as HTMLInputElement).checked = false;
         } else {
           input.value = "";
         }
         input.dispatchEvent(new Event('change', { bubbles: true }));
         input.dispatchEvent(new Event('input', { bubbles: true }));
       });
     }
     setKey(k => k + 1);
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-slate-900 overflow-hidden rounded-3xl border border-slate-700/60 shadow-lg">
         {/* Highly Visual, 100% Mobile Responsive Quality Actions Header */}
         <div className="flex flex-wrap items-center justify-between border-b border-slate-700/80 bg-slate-800/40 px-6 py-4 gap-3">
           <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
             <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
             <span>Auto-saved locally</span>
           </div>
           <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
             <button 
               type="button"
               onClick={fillSample} 
               className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
             >
               <Wand2 className="w-3.5 h-3.5 text-blue-400" /> 
               <span>Sample Data</span>
             </button>
             <button 
               type="button"
               onClick={handleReset} 
               className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-705 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
             >
               <RefreshCw className="w-3.5 h-3.5" /> 
               <span>Clear All</span>
             </button>
             <button 
               type="button"
               onClick={handleCopy} 
               className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors border border-blue-500 shadow-md shadow-blue-900/10"
             >
               <Copy className="w-3.5 h-3.5" /> 
               <span>{isCopied ? "Copied!" : "Copy Result"}</span>
             </button>
           </div>
         </div>

         {/* Tool Main Body Container */}
         <div 
           ref={containerRef} 
           key={key} 
           onClick={handleContainerClick} 
           className="relative flex-1 min-h-[300px]"
         >
            {isLoading && (
               <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex justify-center items-center z-50 rounded-b-3xl transition-all duration-300">
                  <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xs border-blue-500/20">
                     <Loader2 className="w-5 h-5 animate-spin text-blue-500 shrink-0" />
                     <span className="text-xs font-black tracking-wide uppercase text-slate-200">Processing...</span>
                  </div>
               </div>
            )}
            {children}
         </div>
      </div>
    </ErrorBoundary>
  );
}
