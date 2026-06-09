import { useState } from "react";
import { format as formatSql } from "sql-formatter";
import xmlFormat from "xml-formatter";

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
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder={placeholder}
            spellCheck={false}
          />
          <textarea
            readOnly
            value={output}
            className="w-full h-96 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl bg-slate-50 outline-none whitespace-pre"
            placeholder="Formatted output..."
          />
        </div>
        
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <div className="flex justify-center">
          <button
            onClick={handleFormat}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Format {title}
          </button>
        </div>
      </div>
    </div>
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
