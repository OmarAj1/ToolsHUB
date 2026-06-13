import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

function SynonymSwapperBase() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');
  const [swappedText, setSwappedText] = useState('');
  const [copied, setCopied] = useState(false);

  // Very basic local dictionary
  const dictionary: Record<string, string[]> = {
    'quick': ['fast', 'rapid', 'swift'],
    'brown': ['chestnut', 'brunette', 'chocolate'],
    'lazy': ['sluggish', 'indolent', 'slothful'],
    'jumps': ['leaps', 'bounds', 'vaults'],
    'dog': ['hound', 'canine', 'pup'],
    'beautiful': ['gorgeous', 'stunning', 'attractive'],
    'happy': ['joyful', 'cheerful', 'delighted'],
    'sad': ['unhappy', 'sorrowful', 'depressed'],
    'big': ['large', 'huge', 'massive'],
    'small': ['little', 'tiny', 'miniature'],
    'good': ['excellent', 'great', 'superb'],
    'bad': ['terrible', 'awful', 'horrible'],
    'important': ['crucial', 'significant', 'vital'],
  };

  const getSynonym = (word: string) => {
    const lowerWord = word.toLowerCase();
    
    // Check if word exists in our simple dictionary
    if (dictionary[lowerWord]) {
      const options = dictionary[lowerWord];
      const selected = options[Math.floor(Math.random() * options.length)];
      
      // Attempt to preserve casing
      if (word[0] === word[0].toUpperCase()) {
        return selected.charAt(0).toUpperCase() + selected.slice(1);
      }
      return selected;
    }
    return word;
  };

  const swapWords = () => {
    // Regex to grab words but keep punctuation separate
    const result = text.split(/(\b[a-zA-Z]+\b)/).map(part => {
       if (/[a-zA-Z]+/.test(part)) {
         return getSynonym(part);
       }
       return part;
    }).join('');
    
    setSwappedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(swappedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-50 text-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col h-[400px]">
           <label className="block font-bold mb-4">Original Text</label>
           <textarea 
             value={text}
             onChange={e => setText(e.target.value)}
             className="flex-1 w-full bg-slate-900 bg-slate-900 border border-slate-700 border-slate-700 p-4 rounded-xl text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
             placeholder="Type something here..."
           />
           <button 
             onClick={swapWords}
             disabled={!text}
             className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
           >
             <RefreshCw className="w-4 h-4 text-purple-500" /> Swap Synonyms
           </button>
        </div>

        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col h-[400px]">
           <div className="flex justify-between items-center mb-4">
              <label className="block font-bold text-blue-600 text-blue-400">Rewritten Text</label>
              {swappedText && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
           </div>
           
           <div className="flex-1 w-full bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 p-4 rounded-xl text-sm leading-relaxed overflow-y-auto">
             {swappedText || <span className="text-slate-400 italic">Swapped text will appear here...</span>}
           </div>
           
           <div className="mt-4 text-xs text-slate-400 text-center">
             * Uses a static local dictionary (100% offline). Only common words will be swapped.
           </div>
        </div>
      </div>
    </div>
  );
}

export const SynonymSwapper = () => <GenericToolWrapper toolName="SynonymSwapper"><SynonymSwapperBase /></GenericToolWrapper>;
