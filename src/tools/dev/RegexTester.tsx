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

  const previewHtml = useMemo(() => {
    if (!regex || matches.length === 0) return testString;
    try {
      const re = new RegExp(regex, flags);
      const split = testString.split(re);
      const output = [];
      let matchIdx = 0;
      
      let cursor = 0;
      for (let i = 0; i < testString.length; ) {
          // just use standard replace with callback
          break;
      }
      
      // Easier way:
      return testString.replace(re, (match) => `<mark class="bg-blue-200 text-blue-900 rounded-sm px-0.5">${match}</mark>`);
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
          <label className="block text-sm font-bold text-slate-700 mb-2">Match Result ({matches.length})</label>
          <div 
            className="w-full min-h-[10rem] p-4 font-mono text-sm border-2 border-slate-200 rounded-xl bg-slate-50 whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: regex ? previewHtml : testString }}
          />
        </div>
      </div>
    </div>
  );
}
