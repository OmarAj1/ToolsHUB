import { useState, useEffect } from "react";
import { RefreshCw, Copy } from "lucide-react";

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
        // crypto.randomUUID() uses secure randomness
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
          <label className="font-bold text-slate-700">Generate</label>
          <input 
            type="number" 
            min="1" max="100" 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-20 border-2 border-slate-200 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none text-center font-medium"
          />
          <span className="font-medium text-slate-500">UUID(s)</span>
          <div className="flex-1" />
          <button 
            onClick={generate}
            className="flex items-center px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
          </button>
        </div>

        <div className="space-y-3">
          {uuids.map((id, i) => (
            <div key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors group">
              <span className="font-mono text-slate-800 tracking-wider text-lg">{id}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(id);
                }}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Copy"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
