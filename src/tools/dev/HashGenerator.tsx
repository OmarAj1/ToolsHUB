import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";

async function generateHashes(text: string) {
  if (!text) return { sha1: "", sha256: "", sha512: "" };
  
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
    <ToolContainer>
      <TextArea
        label="Input Text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-32"
        placeholder="Type text to hash..."
        spellCheck={false}
      />

      <div className="space-y-4">
        <HashDisplay label="SHA-1" value={hashes.sha1} />
        <HashDisplay label="SHA-256" value={hashes.sha256} />
        <HashDisplay label="SHA-512" value={hashes.sha512} />
      </div>
    </ToolContainer>
  );
}

function HashDisplay({ label, value }: { label: string, value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center group transition-colors">
      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-24 uppercase tracking-wider mb-2 md:mb-0 shrink-0">{label}</span>
      <div className="font-mono text-sm text-slate-800 dark:text-slate-200 break-all flex-1 select-all font-medium pr-4">
        {value || <span className="text-slate-300 dark:text-slate-600">Awaiting input...</span>}
      </div>
      {value && (
        <button 
          onClick={handleCopy}
          className={`p-2 rounded-lg transition-colors shrink-0 mt-2 md:mt-0 ${copied ? 'text-green-600 bg-green-50 dark:bg-green-900/30' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800'}`}
          title="Copy Hash"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
