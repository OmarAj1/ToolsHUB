import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CitationFormatter() {
  const [style, setStyle] = useState("APA");
  const [data, setData] = useState({ author: "", year: "", title: "", publisher: "" });
  const [copied, setCopied] = useState(false);

  let citation = "";
  if (style === "APA") {
    citation = `${data.author || "Author"}. (${data.year || "Year"}). *${data.title || "Title"}*. ${data.publisher || "Publisher"}.`;
  } else if (style === "MLA") {
    citation = `${data.author || "Author"}. *${data.title || "Title"}*. ${data.publisher || "Publisher"}, ${data.year || "Year"}.`;
  } else if (style === "Chicago") {
    citation = `${data.author || "Author"}. ${data.year || "Year"}. *${data.title || "Title"}*. ${data.publisher || "Publisher"}.`;
  }

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex gap-2 mb-4 bg-slate-100 p-1.5 w-fit rounded-xl mx-auto shadow-inner">
           {["APA", "MLA", "Chicago"].map(s => (
             <button key={s} onClick={() => setStyle(s)} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${style === s ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}>
               {s}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 border border-slate-200 rounded-3xl shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Author(s)</label>
            <input type="text" placeholder="e.g. Smith, J." value={data.author} onChange={e=>setData({...data, author:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-colors text-slate-800 font-medium placeholder-slate-300" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Year</label>
            <input type="text" placeholder="e.g. 2024" value={data.year} onChange={e=>setData({...data, year:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-colors text-slate-800 font-medium placeholder-slate-300" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Book / Article Title</label>
            <input type="text" placeholder="e.g. The Elements of Style" value={data.title} onChange={e=>setData({...data, title:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-colors text-slate-800 font-medium placeholder-slate-300" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Publisher / Journal</label>
            <input type="text" placeholder="e.g. Macmillan" value={data.publisher} onChange={e=>setData({...data, publisher:e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-colors text-slate-800 font-medium placeholder-slate-300" />
          </div>
        </div>

        <div className="bg-slate-800 p-8 border border-slate-700 rounded-3xl relative group shadow-lg">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
             <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
             Formatted Citation ({style})
           </div>
           
           <div className="font-serif text-xl text-white leading-relaxed tracking-wide pr-12 min-h-[4rem]" dangerouslySetInnerHTML={{ __html: citation.replace(/\*(.*?)\*/g, '<em class="opacity-80">$1</em>') }} />
           
           <button 
             onClick={() => {
               navigator.clipboard.writeText(citation.replace(/\*/g, ''));
               setCopied(true);
               setTimeout(() => setCopied(false), 2000);
             }}
             className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-sm"
             title="Copy citation"
           >
             {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
           </button>
        </div>
      </div>
    </div>
  );
}

export function FlashcardExporter() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");

  const processNotes = () => {
    const lines = notes.split('\n').filter(l => l.trim().length > 0);
    const flashcards = lines.map(l => {
      const parts = l.split(/[-=:;]/);
      if (parts.length >= 2) {
        return `${parts[0].trim()}\t${parts.slice(1).join('-').trim()}`;
      }
      return `${l.trim()}\t[Answer here]`;
    });
    setOutput(flashcards.join('\n'));
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Paste your raw notes (use hyphens, equals, or colons to separate terms from definitions)</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            placeholder={"Photosynthesis - The process by which plants convert light energy into chemical energy.\nMitochondria: The powerhouse of the cell."}
            className="w-full h-64 p-6 bg-white border border-slate-200 rounded-3xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-mono text-sm leading-relaxed shadow-sm placeholder-slate-300"
            spellCheck={false}
          />
        </div>
        
        <div className="flex justify-end">
           <button onClick={processNotes} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/20">Generate TSV Array</button>
        </div>
        
        {output && (
          <div className="pt-6 border-t border-slate-200">
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                Anki / Quizlet Ready Import (TSV)
                <button 
                  onClick={() => navigator.clipboard.writeText(output)} 
                  className="text-blue-600 hover:text-blue-700 text-xs uppercase tracking-wider flex items-center"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy Data
                </button>
             </label>
             <textarea readOnly value={output} className="w-full h-64 p-6 bg-slate-800 text-slate-300 border-none rounded-3xl outline-none font-mono text-sm whitespace-pre leading-relaxed shadow-inner" />
          </div>
        )}
      </div>
    </div>
  );
}

export function NoteFormatter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  
  const format = () => {
     let cleaned = text.replace(/\s{2,}/g, ' ');
     cleaned = cleaned.replace(/([.?!])\s*(?=[a-z])/g, "$1 ").replace(/(^\s*|[.?!]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
     // Add bullet points to lines that look like list items but lack formatting
     cleaned = cleaned.split('\n').map(line => {
       const trimmed = line.trim();
       if (trimmed && !trimmed.startsWith('- ') && !trimmed.startsWith('•') && !/^\d+\./.test(trimmed) && trimmed.length < 80 && !trimmed.endsWith('.')) {
          return `• ${trimmed}`;
       }
       return line;
     }).join('\n');
     
     setText(cleaned);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
       <div className="w-full max-w-4xl space-y-6">
         <div className="flex gap-4 mb-2">
           <button onClick={format} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/20">Auto-Cleanup Notes</button>
           <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition shadow-sm w-32 flex items-center justify-center">
              {copied ? 'Copied!' : 'Copy'}
           </button>
         </div>
         <textarea 
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your messy unstructured raw notes here. Click auto-cleanup to format spacing, fix casing, and infer bullet points..."
            className="w-full h-96 p-8 bg-white border border-slate-200 rounded-3xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-lg leading-relaxed shadow-sm font-medium text-slate-700 placeholder-slate-300"
            spellCheck={false}
         />
       </div>
    </div>
  );
}
