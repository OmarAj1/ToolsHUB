import { useState } from "react";
import { format as formatSql } from "sql-formatter";
import xmlFormat from "xml-formatter";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";
import { BUTTONS } from "@/constants";

function FormatterBase({ title, placeholder, formatter }: { title: string, placeholder: string, formatter: (input: string) => string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      setOutput(formatter(input));
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
          placeholder={placeholder}
          className="h-96"
          spellCheck={false}
        />
        <TextArea
          readOnly
          value={output}
          placeholder="Formatted output..."
          className="h-96"
        />
      </div>
      
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex justify-center">
        <button
          onClick={handleFormat}
          className={`${BUTTONS.primary} max-w-xs`}
        >
          Format {title}
        </button>
      </div>
    </ToolContainer>
  );
}

export function SqlFormatterTool() {
  return (
    <FormatterBase 
      title="SQL" 
      placeholder="SELECT * FROM users WHERE id = 1" 
      formatter={(input) => formatSql(input, { language: 'postgresql', keywordCase: 'upper' })} 
    />
  );
}

export function XmlFormatterTool() {
  return (
    <FormatterBase 
      title="XML" 
      placeholder="<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>" 
      formatter={(input) => xmlFormat(input, { indentation: '  ', collapseContent: true })} 
    />
  );
}
