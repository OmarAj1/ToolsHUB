import { useState } from "react";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";

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
    <ToolContainer>
      <div className="flex bg-slate-800 bg-slate-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setMode("encode")}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${mode === "encode" ? 'bg-slate-800 bg-slate-800 text-blue-600 text-blue-400 shadow-sm' : 'text-slate-400 text-slate-50 hover:text-slate-50 hover:text-slate-300'}`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${mode === "decode" ? 'bg-slate-800 bg-slate-800 text-blue-600 text-blue-400 shadow-sm' : 'text-slate-400 text-slate-50 hover:text-slate-50 hover:text-slate-300'}`}
        >
          Decode
        </button>
      </div>

      <TextArea
        label="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-40"
        placeholder={mode === "encode" ? "String to encode..." : "URL encoded string to decode..."}
        spellCheck={false}
      />
      
      <TextArea
        label="Output"
        readOnly
        value={input ? getOutput() : ""}
        className="h-40"
        placeholder="Result will appear here..."
      />
    </ToolContainer>
  );
}
