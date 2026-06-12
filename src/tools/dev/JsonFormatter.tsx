import { useState } from "react";
import { Copy, Trash2, CheckCircle2, AlertCircle, FileCode2 } from "lucide-react";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const processJson = (action: 'format' | 'minify') => {
    if (!input.trim()) {
      setError(null);
      setOutput("");
      return;
    }
    try {
      // We strictly use JSON.parse() for validation as requested
      const parsed = JSON.parse(input);
      const spaces = action === 'format' ? 2 : 0;
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (e: any) {
      let customError = e.message;
      
      try {
        // Strip valid double-quoted strings out to safely regex search for syntax issues
        const stripped = input.replace(/"(?:[^"\\]|\\.)*"/g, '""');
        
        if (stripped.match(/,\s*[}\]]/)) {
          customError = "Syntax Error: Trailing comma found. JSON does not allow trailing commas.";
        } else if (stripped.match(/['][^']*[']\s*:/)) {
          customError = "Syntax Error: Property keys must be enclosed in double quotes, not single quotes.";
        } else if (stripped.match(/:\s*['][^']*[']/)) {
          customError = "Syntax Error: String values must be enclosed in double quotes, not single quotes.";
        } else if (stripped.match(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/)) {
          customError = "Syntax Error: Property keys must be enclosed in double quotes.";
        }
      } catch (err) {
        // Fallback to original error if regex fails
      }
      
      setError(customError);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[700px] border-b border-stone-200 dark:border-stone-800">
      <div className="w-full md:w-1/2 border-r border-stone-200 dark:border-stone-800 flex flex-col">
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex justify-between items-center">
          <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">Input JSON</span>
          <div className="flex space-x-2">
            <button onClick={() => setInput("")} className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded dark:hover:text-white dark:hover:bg-stone-800" title="Clear">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <textarea
          className="flex-1 w-full p-4 bg-white dark:bg-stone-950 resize-none focus:outline-none font-mono text-sm text-stone-900 dark:text-stone-300 placeholder-stone-400"
          placeholder='{"paste": "your JSON here"}'
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
        ></textarea>
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col bg-stone-50 dark:bg-stone-900/10">
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex justify-between items-center">
          <div className="flex space-x-2">
            <button onClick={() => processJson('format')} className="px-3 py-1 bg-white border border-stone-200 rounded text-sm text-stone-600 hover:text-stone-900 dark:bg-stone-950 dark:border-stone-800 dark:text-stone-300">Format</button>
            <button onClick={() => processJson('minify')} className="px-3 py-1 bg-white border border-stone-200 rounded text-sm text-stone-600 hover:text-stone-900 dark:bg-stone-950 dark:border-stone-800 dark:text-stone-300">Minify</button>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(output)}
            className="flex items-center px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            disabled={!output}
          >
            <Copy className="w-4 h-4 mr-2" /> Copy Output
          </button>
        </div>
        
        <div className="flex-1 relative overflow-hidden">
          {error ? (
            <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Invalid JSON</h3>
              <p className="text-sm font-mono text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg max-w-md break-all">{error}</p>
            </div>
          ) : output ? (
            <textarea
              readOnly
              className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-stone-900 dark:text-stone-300"
              value={output}
            ></textarea>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
              <FileCode2 className="w-12 h-12 mb-3 opacity-20" />
              <p>Output will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
