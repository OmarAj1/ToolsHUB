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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-50 text-slate-50">
      <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
         <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-400">Destination</h2>
         <input 
           type="text" 
           value={url} 
           onChange={e => setUrl(e.target.value)} 
           placeholder="https://"
           className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-4 py-3 rounded-lg block font-mono text-sm"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Source <span className="text-red-500">*</span></label>
             <p className="text-xs text-slate-400 mb-2">e.g. google, newsletter, facebook</p>
             <input type="text" value={source} onChange={e => setSource(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
           </div>
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Medium <span className="text-red-500">*</span></label>
             <p className="text-xs text-slate-400 mb-2">e.g. cpc, banner, email</p>
             <input type="text" value={medium} onChange={e => setMedium(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
           </div>
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Name <span className="text-red-500">*</span></label>
             <p className="text-xs text-slate-400 mb-2">e.g. spring_sale, promo_code</p>
             <input type="text" value={campaign} onChange={e => setCampaign(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
           </div>
        </div>

        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Term</label>
             <p className="text-xs text-slate-400 mb-2">Identify the paid keywords</p>
             <input type="text" value={term} onChange={e => setTerm(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
           </div>
           <div>
             <label className="block text-sm font-bold mb-1">Campaign Content</label>
             <p className="text-xs text-slate-400 mb-2">Use to differentiate ads</p>
             <input type="text" value={content} onChange={e => setContent(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
           </div>
        </div>
      </div>

      <div className="bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 p-6 rounded-2xl">
         <h3 className="font-bold mb-3 text-blue-900 text-blue-200">Generated URL</h3>
         <div className="flex flex-col sm:flex-row gap-3">
           <textarea 
             readOnly 
             value={generatedUrl} 
             className="flex-1 bg-slate-800 bg-slate-900 border border-blue-200 border-blue-800 px-4 py-3 rounded-lg font-mono text-sm text-slate-50 text-slate-50 min-h-[80px] break-all focus:outline-none"
           />
           <div className="flex sm:flex-col gap-2">
             <button onClick={handleCopy} disabled={!generatedUrl} className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
               {copied ? <Check className="w-4 h-4 text-purple-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
               <span className="sm:hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
             </button>
             <a href={generatedUrl || '#'} target="_blank" rel="noreferrer" className={`flex flex-1 items-center justify-center gap-2 bg-slate-800 bg-slate-800 hover:bg-slate-900 hover:bg-slate-700 text-blue-600 text-blue-400 border border-blue-200 border-blue-800 font-bold px-4 py-2 rounded-lg transition-colors ${!generatedUrl ? 'opacity-50 pointer-events-none' : ''}`}>
               <ExternalLink className="w-4 h-4 text-purple-500" />
               <span className="sm:hidden md:inline">Test</span>
             </a>
           </div>
         </div>
      </div>
    </div>
  );
}
