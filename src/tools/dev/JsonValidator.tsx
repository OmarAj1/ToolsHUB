import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";
import { BUTTONS } from "@/constants";

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
    <ToolContainer>
      <TextArea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setResult(null);
        }}
        className="h-64"
        placeholder="Paste your JSON here to validate..."
        spellCheck={false}
      />
      
      <div className="flex justify-end">
        <button
          onClick={validate}
          className={`${BUTTONS.primary} max-w-xs`}
        >
          Validate JSON
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-xl flex items-start ${result.valid ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50'}`}>
          {result.valid ? <CheckCircle className="w-5 h-5 mr-3 shrink-0" /> : <AlertCircle className="w-5 h-5 mr-3 shrink-0" />}
          <span className="font-medium text-sm">{result.message}</span>
        </div>
      )}
    </ToolContainer>
  );
}
