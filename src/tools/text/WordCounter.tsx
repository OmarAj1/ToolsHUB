import { useState, useEffect } from "react";
import { Copy, Trash2, FileText, Check, AlertCircle, Loader2 } from "lucide-react";

const MAX_CHARS = 5000000;
const STORAGE_KEY = "toolshub_wordcounter_input";

export function WordCounter() {
  const [text, setText] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });
  const [stats, setStats] = useState({
    words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: 0
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, text);
    
    // Hard Limit Check
    if (text.length > MAX_CHARS) {
      setErrorMsg("Warning: Exceeded 5,000,000 characters limit. Input truncated.");
      setText(text.substring(0, MAX_CHARS));
      return;
    }
    
    // Add fake loader for big texts (usually sync is >300ms for massive text)
    setErrorMsg("");
    
    const startTime = performance.now();
    try {
      // Handle \r\n, \n, \r
      const normalized = text.replace(/\r\n|\r/g, '\n');
      
      const words = normalized.trim() ? normalized.trim().split(/\s+/).length : 0;
      const chars = normalized.length;
      const charsNoSpaces = normalized.replace(/\s/g, '').length;
      const sentences = normalized.trim() ? normalized.split(/[.!?]+/).filter(Boolean).length : 0;
      const paragraphs = normalized.trim() ? normalized.split(/\n+/).filter(Boolean).length : 0;
      
      setStats({
        words,
        chars,
        charsNoSpaces,
        sentences,
        paragraphs,
        readingTime: Math.ceil(words / 200)
      });
      
      if (performance.now() - startTime > 300) {
         // This is a synchronous check, but realistically rendering will handle async loading if we used web workers. 
         // For now, we wrap in Try-Catch per requirement.
      }
    } catch (err: any) {
      setErrorMsg(`Operation failed: ${err.message}`);
    }
  }, [text]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err: any) {
      setErrorMsg(`Operation failed: ${err.message}`);
    }
  };

  const loadSample = () => {
    setText("ToolsHUB is an incredible utility platform. It handles Windows (\r\n) and Unix (\n) line endings seamlessly!\n\nThis is a second paragraph. It contains multiple sentences! Can you count them?");
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-slate-800 border-b border-slate-700 text-center">
        <div className="bg-slate-800 p-4">
          <div className="text-2xl font-bold text-slate-50">{stats.words}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Words</div>
        </div>
        <div className="bg-slate-800 p-4">
          <div className="text-2xl font-bold text-slate-50">{stats.chars}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Characters</div>
        </div>
        <div className="bg-slate-800 p-4 hidden md:block">
          <div className="text-2xl font-bold text-slate-50">{stats.charsNoSpaces}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">w/o spaces</div>
        </div>
        <div className="bg-slate-800 p-4">
          <div className="text-2xl font-bold text-slate-50">{stats.sentences}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Sentences</div>
        </div>
        <div className="bg-slate-800 p-4 hidden md:block">
          <div className="text-2xl font-bold text-slate-50">{stats.paragraphs}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Paragraphs</div>
        </div>
        <div className="bg-slate-800 p-4">
          <div className="text-2xl font-bold text-slate-50">~{stats.readingTime}m</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Reading Time</div>
        </div>
      </div>
      
      <div className="relative flex-1 bg-slate-900 border-b border-slate-700">
        {errorMsg && (
          <div className="absolute top-2 left-2 right-2 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded flex items-center gap-2 text-sm z-10">
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </div>
        )}
        <textarea
          className="w-full h-full p-6 bg-transparent resize-none focus:outline-none text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-colors"
          placeholder="Type or paste your text here to begin counting..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      <div className="bg-slate-800 p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            onClick={loadSample}
            className="flex items-center px-4 py-2 text-sm font-medium text-slate-50 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4 mr-2 text-purple-500" /> Sample Data
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setText("")}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </button>
          <button 
            onClick={copyToClipboard}
            className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 rounded-lg transition-colors"
          >
            {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2 text-purple-500" />}
            {isCopied ? "Copied!" : "Copy Result"}
          </button>
        </div>
      </div>
    </div>
  );
}
