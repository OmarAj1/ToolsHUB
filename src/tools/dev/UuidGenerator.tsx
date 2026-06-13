import { useState, useEffect } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";
import { ToolContainer } from "@/components/ui/Layouts";

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
        // crypto.randomUUID() uses secure randomness
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
    setCopiedIndex(null);
  };

  useEffect(() => {
    generate();
  }, []);

  const handleCopy = (id: string, index: number) => {
    navigator.clipboard.writeText(id);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolContainer className="max-w-2xl">
      <div className="flex flex-wrap items-center gap-4 bg-slate-800 bg-slate-800 p-4 border border-slate-700 border-slate-700 rounded-2xl shadow-sm">
        <label className="font-bold text-slate-50 text-slate-50">Generate</label>
        <input 
          type="number" 
          min="1" max="100" 
          value={count} 
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          className="w-20 border-2 border-slate-700 border-slate-700 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:border-blue-500 outline-none text-center font-medium bg-transparent text-slate-50 text-slate-50"
        />
        <span className="font-medium text-slate-400 text-slate-50">UUID(s)</span>
        <div className="flex-1" />
        <button 
          onClick={generate}
          className="flex items-center px-4 py-2 bg-slate-800 bg-slate-800 hover:bg-blue-50 hover:bg-slate-700 text-slate-50 text-slate-50 hover:text-blue-600 hover:text-blue-400 font-bold rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2 text-purple-500" /> Regenerate
        </button>
      </div>

      <div className="space-y-3">
        {uuids.map((id, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-xl p-4 shadow-sm hover:border-blue-300 hover:border-blue-700 transition-colors group">
            <span className="font-mono text-slate-50 text-slate-50 tracking-wider text-base sm:text-lg break-all mr-2">{id}</span>
            <button 
              onClick={() => handleCopy(id, i)}
              className={`p-2 rounded-lg transition-colors shrink-0 ${copiedIndex === i ? 'text-green-600 bg-green-50 bg-green-900/30' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:bg-slate-700'}`}
              title="Copy"
            >
              {copiedIndex === i ? <Check className="w-5 h-5 text-purple-500" /> : <Copy className="w-5 h-5 text-purple-500" />}
            </button>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
}
