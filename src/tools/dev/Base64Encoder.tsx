import { useState } from "react";
import { Copy, ArrowRightLeft, Trash2 } from "lucide-react";

export function Base64Encoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);

  const getOutput = () => {
    if (!input) return "";
    try {
      if (mode === "encode") {
        return btoa(input);
      } else {
        return atob(input);
      }
    } catch (e) {
      return "Invalid Base64 string";
    }
  };

  const output = getOutput();

  const toggleMode = () => {
    setMode(prev => prev === "encode" ? "decode" : "encode");
    setInput(output !== "Invalid Base64 string" ? output : "");
  };

  return (
    <div className="flex flex-col md:flex-row h-[500px]">
      <div className="w-full md:w-1/2 border-r border-stone-200 dark:border-stone-800 flex flex-col relative">
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex justify-between items-center h-16">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </span>
          <button onClick={() => setInput("")} className="text-stone-400 hover:text-stone-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <textarea
          className="flex-1 w-full p-4 bg-white dark:bg-stone-950 resize-none focus:outline-none text-stone-900 dark:text-stone-100 font-mono text-sm"
          placeholder={mode === "encode" ? "Enter text here..." : "Enter Base64 here..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        
        {/* Mobile toggle button */}
        <button 
          onClick={toggleMode}
          className="md:hidden absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg shadow-blue-500/20 z-10"
        >
          <ArrowRightLeft className="w-5 h-5 rotate-90" />
        </button>
      </div>

      {/* Desktop toggle button */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 pt-64 z-10">
        <button 
          onClick={toggleMode}
          className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full md:w-1/2 flex flex-col bg-stone-50 dark:bg-stone-900/10">
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex justify-between items-center h-16">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {mode === "encode" ? "Base64 Output" : "Text Output"}
          </span>
          <button 
            onClick={() => navigator.clipboard.writeText(output)}
            disabled={!output || output === "Invalid Base64 string"}
            className="flex items-center px-3 py-1.5 text-sm font-medium bg-stone-900 text-white rounded-md hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            <Copy className="w-4 h-4 mr-2" /> Copy
          </button>
        </div>
        <textarea
          readOnly
          className={`flex-1 w-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm ${output === "Invalid Base64 string" ? "text-red-500" : "text-stone-900 dark:text-stone-100"}`}
          value={output}
          placeholder="Result will appear here..."
        ></textarea>
      </div>
    </div>
  );
}
