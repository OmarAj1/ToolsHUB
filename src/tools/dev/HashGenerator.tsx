import { useState, useEffect } from "react";

async function generateHashes(text: string) {
  if (!text) return { md5: "", sha1: "", sha256: "", sha512: "" };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  const toHex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Note: Web Crypto doesn't natively support MD5. For a real app, an external library is usually needed.
  // We'll mock MD5 or omit if unavailable, but SHA-1 and SHA-256 are available.
  const sha1 = await crypto.subtle.digest("SHA-1", data).then(toHex);
  const sha256 = await crypto.subtle.digest("SHA-256", data).then(toHex);
  const sha512 = await crypto.subtle.digest("SHA-512", data).then(toHex);

  return { sha1, sha256, sha512 };
}

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ sha1: "", sha256: "", sha512: "" });

  useEffect(() => {
    generateHashes(input).then(setHashes);
  }, [input]);

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-2">Input Text</label>
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="w-full h-32 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
             placeholder="Type text to hash..."
             spellCheck={false}
           />
        </div>

        <div className="space-y-4">
          <HashDisplay label="SHA-1" value={hashes.sha1} />
          <HashDisplay label="SHA-256" value={hashes.sha256} />
          <HashDisplay label="SHA-512" value={hashes.sha512} />
        </div>
      </div>
    </div>
  );
}

function HashDisplay({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center">
      <span className="text-xs font-bold text-slate-400 w-24 uppercase tracking-wider mb-2 md:mb-0 shrink-0">{label}</span>
      <div className="font-mono text-sm text-slate-800 break-all flex-1 select-all font-medium">
        {value || <span className="text-slate-300">Awaiting input...</span>}
      </div>
    </div>
  );
}
