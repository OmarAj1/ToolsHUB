import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function Base64Decoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDecode = (val: string) => {
    setInput(val);
    if (!val) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      setOutput(atob(val));
      setError(null);
    } catch {
      setOutput("");
      setError("Invalid Base64 string");
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Base64 Encoded Text</label>
          <textarea
            value={input}
            onChange={(e) => handleDecode(e.target.value)}
            className="w-full h-40 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="SGVsbG8gV29ybGQ="
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center text-sm font-medium">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0" /> {error}
          </div>
        )}

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-2">Decoded Text</label>
           <textarea
             readOnly
             value={output}
             className="w-full h-40 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl bg-slate-50 outline-none"
             placeholder="Decoded text will appear here..."
           />
        </div>
      </div>
    </div>
  );
}
