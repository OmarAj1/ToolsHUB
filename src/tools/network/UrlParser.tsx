import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export function UrlParser() {
  const [url, setUrl] = useState('https://example.com:8080/path/to/page?query=123&name=john#section1');
  const [parsed, setParsed] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const u = new URL(url);
      const searchParams = new URLSearchParams(u.search);
      const params: Record<string, string> = {};
      searchParams.forEach((val, key) => {
        params[key] = val;
      });

      setParsed({
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        host: u.host,
        origin: u.origin,
        params
      });
    } catch (e) {
      setParsed(null);
    }
  }, [url]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-50 text-slate-50 space-y-6">
      <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl shadow-sm p-6">
        <label className="block text-sm font-bold mb-2">Input URL</label>
        <textarea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg p-3 font-mono text-sm min-h-[100px] break-all"
        />
      </div>

      {parsed ? (
        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl shadow-sm p-6">
           <h3 className="font-bold mb-4">Parsed Components</h3>
           <div className="space-y-4">
             {['protocol', 'hostname', 'port', 'pathname', 'search', 'hash'].map(key => (
               <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-slate-700 border-slate-700 pb-3">
                 <span className="w-24 text-sm font-bold text-slate-400 uppercase">{key}</span>
                 <div className="flex-1 bg-slate-900 bg-slate-800 p-2 rounded text-sm font-mono break-all group relative">
                   {parsed[key] || <span className="text-slate-400 italic">empty</span>}
                 </div>
               </div>
             ))}
           </div>

           {Object.keys(parsed.params).length > 0 && (
             <div className="mt-8">
               <h3 className="font-bold mb-4">Query Parameters</h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-slate-700 border-slate-700 uppercase text-xs text-slate-400">
                       <th className="py-2 font-bold w-1/3">Key</th>
                       <th className="py-2 font-bold">Value</th>
                     </tr>
                   </thead>
                   <tbody>
                     {Object.entries(parsed.params).map(([key, val]) => (
                       <tr key={key} className="border-b border-slate-700 border-slate-700/50">
                         <td className="py-2 font-mono text-sm">{key}</td>
                         <td className="py-2 font-mono text-sm text-blue-600 text-blue-400 break-all">{val as string}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           )}
        </div>
      ) : (
        <div className="bg-red-50 text-red-600 bg-red-900/20 text-red-400 p-4 rounded-lg font-bold text-center">
          Invalid URL structure
        </div>
      )}
    </div>
  );
}
