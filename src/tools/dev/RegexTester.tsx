import { useState, useMemo } from "react";

export function RegexTester() {
  const [regex, setRegex] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const matches = useMemo(() => {
    if (!regex) return [];
    try {
      const re = new RegExp(regex, flags);
      if (!re.global) {
        const m = re.exec(testString);
        return m ? [m[0]] : [];
      }
      return Array.from(testString.matchAll(re)).map(m => m[0]);
    } catch {
      return [];
    }
  }, [regex, flags, testString]);

  const previewNodes = useMemo(() => {
    if (!regex || matches.length === 0) return testString;
    try {
      const re = new RegExp(regex, flags);
      const result: React.ReactNode[] = [];
      let lastIndex = 0;
      testString.replace(re, (...args) => {
        const match = args[0];
        const offset = args[args.length - 2];
        
        if (offset > lastIndex) {
          result.push(<span key={`text-${lastIndex}`}>{testString.slice(lastIndex, offset)}</span>);
        }
        result.push(<mark key={`match-${offset}`} className="bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 rounded-sm px-0.5">{match}</mark>);
        lastIndex = offset + match.length;
        return match;
      });
      if (lastIndex < testString.length) {
        result.push(<span key={`text-${lastIndex}`}>{testString.slice(lastIndex)}</span>);
      }
      return result.length > 0 ? result : testString;
    } catch (e) {
      return testString;
    }
  }, [regex, flags, testString, matches]);

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex bg-white rounded-xl border border-slate-200 p-2 overflow-hidden items-center group focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <span className="text-slate-400 font-mono text-lg px-2">/</span>
          <input
            type="text"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            className="flex-1 font-mono text-slate-800 bg-transparent outline-none text-lg min-w-0"
            placeholder="Pattern"
            spellCheck={false}
          />
          <span className="text-slate-400 font-mono text-lg px-2">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-16 font-mono text-slate-500 bg-slate-50 rounded-lg px-2 py-1 outline-none text-sm text-center border border-slate-200 focus:border-blue-500 focus:bg-white"
            placeholder="Flags"
            spellCheck={false}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full h-40 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Enter text to test your regex against..."
            spellCheck={false}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Match Result ({matches.length})</label>
          <div 
            className="w-full min-h-[10rem] p-4 font-mono text-sm border-2 border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-all transition-colors"
          >
            {regex ? previewNodes : testString}
          </div>
        </div>
      </div>
    </div>
  );
}
