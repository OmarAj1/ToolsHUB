import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CitationFormatterBase() {
  const [style, setStyle] = useState("APA");
  const [data, setData] = useState({ author: "", year: "", title: "", publisher: "", url: "" });
  const [copied, setCopied] = useState(false);

  let citation = "";
  if (style === "APA") {
    citation = `${data.author || "Author"}. (${data.year || "Year"}). *${data.title || "Title"}*. ${data.publisher || "Publisher"}.${data.url ? ` ${data.url}` : ""}`;
  } else if (style === "MLA") {
    citation = `${data.author || "Author"}. *${data.title || "Title"}*. ${data.publisher || "Publisher"}, ${data.year || "Year"}.${data.url ? ` ${data.url}` : ""}`;
  } else if (style === "Chicago") {
    citation = `${data.author || "Author"}. ${data.year || "Year"}. *${data.title || "Title"}*. ${data.publisher || "Publisher"}.${data.url ? ` ${data.url}` : ""}`;
  }

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex gap-2 mb-4 bg-slate-800 p-1.5 w-fit rounded-xl mx-auto shadow-inner border border-transparent">
           {["APA", "MLA", "Chicago"].map(s => (
             <button key={s} onClick={() => setStyle(s)} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${style === s ? 'bg-slate-800 text-blue-400 shadow-sm ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
               {s}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800 p-8 border border-slate-700 rounded-3xl shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Author(s)</label>
            <input type="text" placeholder="e.g. Smith, J." value={data.author} onChange={e=>setData({...data, author:e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30 outline-none transition-colors text-slate-50 font-medium placeholder-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Year</label>
            <input type="text" placeholder="e.g. 2024" value={data.year} onChange={e=>setData({...data, year:e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30 outline-none transition-colors text-slate-50 font-medium placeholder-slate-600" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Book / Article Title</label>
            <input type="text" placeholder="e.g. The Elements of Style" value={data.title} onChange={e=>setData({...data, title:e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30 outline-none transition-colors text-slate-50 font-medium placeholder-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Publisher / Journal</label>
            <input type="text" placeholder="e.g. Macmillan" value={data.publisher} onChange={e=>setData({...data, publisher:e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30 outline-none transition-colors text-slate-50 font-medium placeholder-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL / DOI (Optional)</label>
            <input type="text" placeholder="e.g. https://doi.org/10..." value={data.url} onChange={e=>setData({...data, url:e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30 outline-none transition-colors text-slate-50 font-medium placeholder-slate-600" />
          </div>
        </div>

        <div className="bg-black p-8 border border-slate-700 rounded-3xl relative group shadow-lg flex flex-col">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
             <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
             Formatted Citation ({style})
           </div>
           
           <div className="font-serif text-xl text-white leading-relaxed tracking-wide pr-12 min-h-[4rem]">
             {citation.split(/(\*.*?\*)/).map((part, i) => {
               if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
                 return <em key={i} className="opacity-80">{part.slice(1, -1)}</em>;
               }
               return <span key={i}>{part}</span>;
             })}
           </div>
           
           <button 
             onClick={() => {
               navigator.clipboard.writeText(citation.replace(/\*/g, ''));
               setCopied(true);
               setTimeout(() => setCopied(false), 2000);
             }}
             className="absolute top-6 right-6 p-3 bg-slate-800/10 hover:bg-slate-800/20 text-white rounded-xl transition-all backdrop-blur-sm"
             title="Copy citation"
           >
             {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-purple-500" />}
           </button>
        </div>
      </div>
    </div>
  );
}

function FlashcardExporterBase() {
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
          <label className="block text-sm font-bold text-slate-50 text-slate-50 mb-2">Paste your raw notes (use hyphens, equals, or colons to separate terms from definitions)</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            placeholder={"Photosynthesis - The process by which plants convert light energy into chemical energy.\nMitochondria: The powerhouse of the cell."}
            className="w-full h-64 p-6 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-3xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:ring-blue-900/30 transition-all font-mono text-sm leading-relaxed shadow-sm text-slate-50 text-slate-50 placeholder-slate-300 placeholder-slate-600"
            spellCheck={false}
          />
        </div>
        
        <div className="flex justify-end">
           <button onClick={processNotes} className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-md shadow-blue-500/20">Generate TSV Array</button>
        </div>
        
        {output && (
          <div className="pt-6 border-t border-slate-700 border-slate-700">
             <label className="block text-sm font-bold text-slate-50 text-slate-50 mb-2 flex items-center justify-between">
                Anki / Quizlet Ready Import (TSV)
                <button 
                  onClick={() => navigator.clipboard.writeText(output)} 
                  className="text-blue-600 hover:text-blue-700 text-blue-400 hover:text-blue-300 text-xs uppercase tracking-wider flex items-center"
                >
                  <Copy className="w-3 h-3 mr-1 text-purple-500" /> Copy Data
                </button>
             </label>
             <textarea readOnly value={output} className="w-full h-64 p-6 bg-slate-800 bg-black text-slate-300 text-slate-50 border-none rounded-3xl outline-none font-mono text-sm whitespace-pre leading-relaxed shadow-inner" />
          </div>
        )}
      </div>
    </div>
  );
}

function NoteFormatterBase() {
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
           <button onClick={format} className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-md shadow-blue-500/20">Auto-Cleanup Notes</button>
           <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-6 py-3 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 text-slate-50 text-slate-50 font-bold rounded-xl hover:bg-slate-900 hover:bg-slate-700 transition shadow-sm w-32 flex items-center justify-center">
              {copied ? 'Copied!' : 'Copy'}
           </button>
         </div>
         <textarea 
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your messy unstructured raw notes here. Click auto-cleanup to format spacing, fix casing, and infer bullet points..."
            className="w-full h-96 p-8 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-3xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:ring-blue-900/30 transition-all text-lg leading-relaxed shadow-sm font-medium text-slate-50 text-slate-50 placeholder-slate-300 placeholder-slate-600"
            spellCheck={false}
         />
       </div>
    </div>
  );
}

export const CitationFormatter = () => <GenericToolWrapper toolName="CitationFormatter"><CitationFormatterBase /></GenericToolWrapper>;

export const FlashcardExporter = () => <GenericToolWrapper toolName="FlashcardExporter"><FlashcardExporterBase /></GenericToolWrapper>;

export const NoteFormatter = () => <GenericToolWrapper toolName="NoteFormatter"><NoteFormatterBase /></GenericToolWrapper>;
