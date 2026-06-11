import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";

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
      setOutput(decodeURIComponent(escape(atob(val))));
      setError(null);
    } catch {
      setOutput("");
      setError("Invalid Base64 string");
    }
  };

  return (
    <ToolContainer>
      <TextArea
        label="Base64 Encoded Text"
        value={input}
        onChange={(e) => handleDecode(e.target.value)}
        className="h-40"
        placeholder="SGVsbG8gV29ybGQ="
        spellCheck={false}
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center text-sm font-medium">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" /> {error}
        </div>
      )}

      <TextArea
        label="Decoded Text"
        readOnly
        value={output}
        className="h-40"
        placeholder="Decoded text will appear here..."
      />
    </ToolContainer>
  );
}

