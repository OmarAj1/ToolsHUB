import { useState } from "react";

export function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  
  const getOutput = () => {
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "Error: Invalid input for decoding";
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setMode("encode")}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${mode === "encode" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${mode === "decode" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Decode
          </button>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder={mode === "encode" ? "String to encode..." : "URL encoded string to decode..."}
            spellCheck={false}
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Output</label>
          <textarea
            readOnly
            value={input ? getOutput() : ""}
            className="w-full h-40 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl bg-slate-50 outline-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
