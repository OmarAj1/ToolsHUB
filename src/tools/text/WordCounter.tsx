import { useState, useEffect } from "react";
import { Copy, Trash2 } from "lucide-react";

export function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    
    setStats({
      words,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime: Math.ceil(words / 200) // Avg reading speed 200 wpm
    });
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-stone-200 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-800 text-center">
        <div className="bg-white dark:bg-stone-950 p-4">
          <div className="text-2xl font-bold text-stone-900 dark:text-white">{stats.words}</div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Words</div>
        </div>
        <div className="bg-white dark:bg-stone-950 p-4">
          <div className="text-2xl font-bold text-stone-900 dark:text-white">{stats.chars}</div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Characters</div>
        </div>
        <div className="bg-white dark:bg-stone-950 p-4 hidden md:block">
          <div className="text-2xl font-bold text-stone-900 dark:text-white">{stats.charsNoSpaces}</div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">w/o spaces</div>
        </div>
        <div className="bg-white dark:bg-stone-950 p-4">
          <div className="text-2xl font-bold text-stone-900 dark:text-white">{stats.sentences}</div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Sentences</div>
        </div>
        <div className="bg-white dark:bg-stone-950 p-4 hidden md:block">
          <div className="text-2xl font-bold text-stone-900 dark:text-white">{stats.paragraphs}</div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Paragraphs</div>
        </div>
        <div className="bg-white dark:bg-stone-950 p-4">
          <div className="text-2xl font-bold text-stone-900 dark:text-white">~{stats.readingTime}m</div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">Reading Time</div>
        </div>
      </div>
      
      <div className="relative flex-1 bg-stone-50 dark:bg-stone-900/50">
        <textarea
          className="w-full h-full p-6 bg-transparent resize-none focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400"
          placeholder="Type or paste your text here to begin counting..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-4 flex justify-end space-x-3">
        <button 
          onClick={() => setText("")}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Clear
        </button>
        <button 
          onClick={copyToClipboard}
          className="flex items-center px-4 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 rounded-lg dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 transition-colors"
        >
          <Copy className="w-4 h-4 mr-2" /> Copy Text
        </button>
      </div>
    </div>
  );
}
