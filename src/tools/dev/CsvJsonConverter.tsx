import { useState } from "react";
import Papa from "papaparse";

export function ConverterBase({ 
  mode,
  placeholderInput,
  placeholderOutput
}: { 
  mode: "csv-to-json" | "json-to-csv",
  placeholderInput: string,
  placeholderOutput: string
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    if (!input.trim()) return;
    try {
      if (mode === "csv-to-json") {
        const result = Papa.parse(input, { header: true, skipEmptyLines: true });
        if (result.errors.length > 0) throw new Error(result.errors[0].message);
        setOutput(JSON.stringify(result.data, null, 2));
      } else {
        const data = JSON.parse(input);
        if (!Array.isArray(data)) throw new Error("JSON must be an array of objects to convert to CSV.");
        const csv = Papa.unparse(data);
        setOutput(csv);
      }
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder={placeholderInput}
            spellCheck={false}
          />
          <textarea
            readOnly
            value={output}
            className="w-full h-96 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl bg-slate-50 outline-none whitespace-pre"
            placeholder={placeholderOutput}
          />
        </div>
        
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <div className="flex justify-center">
          <button
            onClick={convert}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
}

export function CsvToJson() {
  return (
    <ConverterBase 
      mode="csv-to-json" 
      placeholderInput="name,email\nJohn Doe,john@example.com"
      placeholderOutput="JSON output will appear here..."
    />
  );
}

export function JsonToCsv() {
  return (
    <ConverterBase 
      mode="json-to-csv" 
      placeholderInput={'[\n  { "name": "John Doe", "email": "john@example.com" }\n]'}
      placeholderOutput="CSV output will appear here..."
    />
  );
}
