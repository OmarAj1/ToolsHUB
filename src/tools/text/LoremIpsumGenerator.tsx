import React, { useState } from 'react';
import { Copy, Plus, Minus, AlignLeft, List, Check } from 'lucide-react';

const LOREM_WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"];

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateSentence() {
  const length = Math.floor(Math.random() * 8) + 6; // 6 to 13 words
  const words = [];
  for (let i = 0; i < length; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  words[0] = capitalize(words[0]);
  return words.join(' ') + '.';
}

function generateParagraph() {
  const length = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
  const sentences = [];
  for (let i = 0; i < length; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

export function LoremIpsumGenerator() {
  const [type, setType] = useState<'paragraphs' | 'words' | 'lists'>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = '';
    
    if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        let w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        if (i === 0) w = capitalize(w);
        words.push(w);
      }
      result = words.join(' ') + (count > 0 ? '.' : '');
    } 
    else if (type === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      result = paragraphs.join('\n\n');
    }
    else if (type === 'lists') {
      const lists = [];
      for (let i = 0; i < count; i++) {
        lists.push(`- ${generateSentence()}`);
      }
      result = lists.join('\n');
    }

    setOutput(result);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate on first load if empty
  React.useEffect(() => {
    if (!output) {
      generate();
    }
  }, []);

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6 md:p-8 mb-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Generate</label>
            <div className="flex bg-stone-100 dark:bg-stone-900 rounded-lg p-1">
              <button 
                onClick={() => { setType('paragraphs'); generate(); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'paragraphs' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
              >
                Paragraphs
              </button>
              <button 
                onClick={() => { setType('words'); generate(); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'words' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
              >
                Words
              </button>
              <button 
                onClick={() => { setType('lists'); generate(); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'lists' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
              >
                Lists
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Count</label>
            <div className="flex items-center">
              <button 
                onClick={() => setCount(Math.max(1, count - 1))}
                className="w-10 h-10 flex items-center justify-center bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-l-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input 
                type="number" 
                value={count} 
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-10 w-24 text-center border-y border-stone-100 dark:border-stone-900 bg-stone-50 dark:bg-stone-950 font-medium focus:outline-none"
              />
              <button 
                onClick={() => setCount(count + 1)}
                className="w-10 h-10 flex items-center justify-center bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-r-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button 
                onClick={generate}
                className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md shadow-sm text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-stone-500" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
          <div className="w-full min-h-[300px] max-h-[500px] overflow-y-auto p-6 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-serif leading-relaxed whitespace-pre-wrap select-all">
            {output}
          </div>
        </div>

      </div>
    </div>
  );
}
