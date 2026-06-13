import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { ArrowRightLeft, Copy, Check, AlertCircle } from 'lucide-react';

export function YamlJsonConverter() {
  const [input, setInput] = useState('{\n  "version": 1,\n  "name": "example",\n  "active": true\n}');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convert(input, mode);
  }, [input, mode]);

  const convert = (text: string, currentMode: 'json-to-yaml' | 'yaml-to-json') => {
    if (!text.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'json-to-yaml') {
        const parsed = JSON.parse(text);
        const yamlStr = yaml.dump(parsed, { indent: 2 });
        setOutput(yamlStr);
      } else {
        const parsed = yaml.load(text);
        const jsonStr = JSON.stringify(parsed, null, 2);
        setOutput(jsonStr);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid format');
    }
  };

  const handleSwap = () => {
    setMode(prev => prev === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
    if (!error && output) {
      setInput(output);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-4 bg-stone-100 bg-stone-900 p-1 rounded-lg">
          <button 
            onClick={() => setMode('json-to-yaml')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'json-to-yaml' ? 'bg-slate-800 bg-stone-800 shadow-sm text-blue-600 text-blue-400' : 'text-stone-500 hover:text-stone-700 hover:text-stone-300'}`}
          >
            JSON to YAML
          </button>
          <button 
            onClick={() => setMode('yaml-to-json')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'yaml-to-json' ? 'bg-slate-800 bg-stone-800 shadow-sm text-blue-600 text-blue-400' : 'text-stone-500 hover:text-stone-700 hover:text-stone-300'}`}
          >
            YAML to JSON
          </button>
        </div>
        
        <button 
          onClick={handleSwap}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 bg-slate-800 border border-stone-200 hover:bg-stone-50 rounded-lg bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4 text-purple-500" />
          Swap
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 bg-red-900/20 border border-red-200 border-red-800/50 text-red-600 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3 flex-shrink-0">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-purple-500" />
          <p className="text-sm font-mono whitespace-pre-wrap">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 border border-stone-200 border-stone-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
          <div className="bg-stone-100 bg-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 border-stone-800 flex justify-between items-center">
            {mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full bg-slate-800 bg-stone-950 p-4 font-mono text-sm resize-none focus:outline-none text-stone-300"
            spellCheck="false"
            placeholder={mode === 'json-to-yaml' ? '{\n  "key": "value"\n}' : 'key: value'}
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0 border border-stone-200 border-stone-800 rounded-xl overflow-hidden relative group bg-stone-50 bg-stone-900/50">
          <div className="bg-stone-100 bg-stone-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 border-stone-800 flex justify-between items-center">
            {mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
            
            <button 
              onClick={handleCopy}
              className="text-stone-400 hover:text-stone-700 hover:text-stone-200 transition-colors"
              title="Copy output"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
            </button>
          </div>
          <div className="flex-1 w-full p-4 font-mono text-sm overflow-auto text-stone-700 text-stone-300 whitespace-pre">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}
