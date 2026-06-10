import React, { useState } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';

export function UtmLinkBuilder() {
  const [url, setUrl] = useState('https://example.com');
  const [source, setSource] = useState('google');
  const [medium, setMedium] = useState('cpc');
  const [campaign, setCampaign] = useState('spring_sale');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const buildUrl = () => {
    try {
      if (!url) return '';
      const finalUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (source) finalUrl.searchParams.set('utm_source', source);
      if (medium) finalUrl.searchParams.set('utm_medium', medium);
      if (campaign) finalUrl.searchParams.set('utm_campaign', campaign);
      if (term) finalUrl.searchParams.set('utm_term', term);
      if (content) finalUrl.searchParams.set('utm_content', content);
      return finalUrl.toString();
    } catch {
      return '';
    }
  };

  const generatedUrl = buildUrl();

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
         <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-500">Destination</h2>
         <input 
           type="text" 
           value={url} 
           onChange={e => setUrl(e.target.value)} 
           placeholder="https://"
           className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-lg block font-mono text-sm"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Source <span className="text-red-500">*</span></label>
             <p className="text-xs text-slate-500 mb-2">e.g. google, newsletter, facebook</p>
             <input type="text" value={source} onChange={e => setSource(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
           </div>
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Medium <span className="text-red-500">*</span></label>
             <p className="text-xs text-slate-500 mb-2">e.g. cpc, banner, email</p>
             <input type="text" value={medium} onChange={e => setMedium(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
           </div>
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Name <span className="text-red-500">*</span></label>
             <p className="text-xs text-slate-500 mb-2">e.g. spring_sale, promo_code</p>
             <input type="text" value={campaign} onChange={e => setCampaign(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Term</label>
             <p className="text-xs text-slate-500 mb-2">Identify the paid keywords</p>
             <input type="text" value={term} onChange={e => setTerm(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
           </div>
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Content</label>
             <p className="text-xs text-slate-500 mb-2">Use to differentiate ads</p>
             <input type="text" value={content} onChange={e => setContent(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
           </div>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-6 rounded-2xl">
         <h3 className="font-bold mb-3 text-indigo-900 dark:text-indigo-200">Generated URL</h3>
         <div className="flex flex-col sm:flex-row gap-3">
           <textarea 
             readOnly 
             value={generatedUrl} 
             className="flex-1 bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-800 px-4 py-3 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 min-h-[80px] break-all focus:outline-none"
           />
           <div className="flex sm:flex-col gap-2">
             <button onClick={handleCopy} disabled={!generatedUrl} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
               {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
               <span className="sm:hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
             </button>
             <a href={generatedUrl || '#'} target="_blank" rel="noreferrer" className={`flex flex-1 items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold px-4 py-2 rounded-lg transition-colors ${!generatedUrl ? 'opacity-50 pointer-events-none' : ''}`}>
               <ExternalLink className="w-4 h-4" />
               <span className="sm:hidden md:inline">Test</span>
             </a>
           </div>
         </div>
      </div>
    </div>
  );
}
