import { useState } from "react";
import Papa from "papaparse";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";
import { BUTTONS } from "@/constants";

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
    <ToolContainer className="max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholderInput}
          className="h-96"
          spellCheck={false}
        />
        <TextArea
          readOnly
          value={output}
          placeholder={placeholderOutput}
          className="h-96"
        />
      </div>
      
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex justify-center">
        <button
          onClick={convert}
          className={`${BUTTONS.primary} max-w-xs`}
        >
          Convert
        </button>
      </div>
    </ToolContainer>
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
