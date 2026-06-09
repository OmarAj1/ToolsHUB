import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export function JsonValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    try {
      JSON.parse(input);
      setResult({ valid: true, message: "Valid JSON" });
    } catch (e: any) {
      setResult({ valid: false, message: e.message });
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          className="w-full h-64 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="Paste your JSON here to validate..."
          spellCheck={false}
        />
        
        <div className="flex justify-end">
          <button
            onClick={validate}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Validate JSON
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-xl flex items-start ${result.valid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {result.valid ? <CheckCircle className="w-5 h-5 mr-3 shrink-0" /> : <AlertCircle className="w-5 h-5 mr-3 shrink-0" />}
            <span className="font-medium text-sm">{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
