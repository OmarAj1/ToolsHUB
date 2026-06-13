import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Copy, Check, FileCode2, Eye } from 'lucide-react';
import Markdown from 'react-markdown';

export function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nWrite some **markdown** here.\n\n- It parses in real-time.\n- It renders beautifully.');
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);
  const [htmlOutput, setHtmlOutput] = useState('');

  useEffect(() => {
    // parse markdown to clean html string
    const parsed = marked.parse(markdown) as string;
    setHtmlOutput(parsed);
  }, [markdown]);

  const handleCopy = () => {
    if (!htmlOutput) return;
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-stone-800 text-stone-100">Markdown to HTML</h2>
        
        <div className="flex bg-stone-100 bg-stone-900 rounded-lg p-1">
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-colors ${viewMode === 'preview' ? 'bg-slate-800 bg-stone-800 shadow-sm text-blue-600 text-blue-400' : 'text-stone-500 hover:text-stone-700 hover:text-stone-300'}`}
          >
            <Eye className="w-4 h-4 text-purple-500" />
            Preview
          </button>
          <button 
            onClick={() => setViewMode('html')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-colors ${viewMode === 'html' ? 'bg-slate-800 bg-stone-800 shadow-sm text-blue-600 text-blue-400' : 'text-stone-500 hover:text-stone-700 hover:text-stone-300'}`}
          >
            <FileCode2 className="w-4 h-4 text-purple-500" />
            HTML Code
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 border border-stone-200 border-stone-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow bg-slate-800 bg-stone-950">
          <div className="bg-stone-100 bg-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 border-stone-800">
            Markdown Input
          </div>
          <textarea 
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-stone-300"
            spellCheck="false"
            placeholder="Type your markdown here..."
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0 border border-stone-200 border-stone-800 rounded-xl overflow-hidden relative group bg-slate-800 bg-stone-900/50">
          <div className="bg-stone-100 bg-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 border-stone-800 flex justify-between items-center">
            {viewMode === 'preview' ? 'Live Preview' : 'Raw HTML Output'}
            
            {viewMode === 'html' && (
              <button 
                onClick={handleCopy}
                className="text-stone-400 hover:text-stone-700 hover:text-stone-200 transition-colors"
                title="Copy HTML"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
              </button>
            )}
          </div>
          <div className="flex-1 w-full p-4 overflow-auto">
            {viewMode === 'preview' ? (
              <div className="markdown-body p-2 text-stone-200 pred pred-invert max-w-none">
                <Markdown>{markdown}</Markdown>
              </div>
            ) : (
              <pre className="font-mono text-sm text-stone-700 text-stone-300 whitespace-pre-wrap">
                {htmlOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
