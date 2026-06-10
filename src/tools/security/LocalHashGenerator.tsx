import React, { useState, useEffect } from 'react';
import { Fingerprint, Copy, Check } from 'lucide-react';
import CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';

export function LocalHashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
    bcrypt: ''
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [isBcryptLoading, setIsBcryptLoading] = useState(false);

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '', bcrypt: '' });
      return;
    }

    const generateHashes = async () => {
      // Synchronous hashes using crypto-js
      const md5 = CryptoJS.MD5(input).toString();
      const sha1 = CryptoJS.SHA1(input).toString();
      const sha256 = CryptoJS.SHA256(input).toString();
      const sha512 = CryptoJS.SHA512(input).toString();

      setHashes(prev => ({ ...prev, md5, sha1, sha256, sha512 }));

      // Bcrypt is slow, so we timeout/async it so it doesn't freeze the UI instantly
      if (input.length > 0) {
        setIsBcryptLoading(true);
        setTimeout(() => {
          try {
            // Using a low cost factor (e.g. 10) for browser performance on every keystroke
            const salt = bcrypt.genSaltSync(10);
            const bcryptHash = bcrypt.hashSync(input, salt);
            setHashes(prev => ({ ...prev, bcrypt: bcryptHash }));
          } catch (e) {
            console.error(e);
          }
          setIsBcryptLoading(false);
        }, 100);
      }
    };

    // Debounce slightly to avoid freezing on rapid typing, especially for bcrypt
    const timeoutId = setTimeout(generateHashes, 300);
    return () => clearTimeout(timeoutId);
  }, [input]);

  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const HashItem = ({ title, value, type, isLoading = false }: { title: string, value: string, type: string, isLoading?: boolean }) => (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
      <div className="bg-stone-50 dark:bg-stone-950 px-4 py-2 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
        <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">{title}</h3>
        <button 
          onClick={() => handleCopy(value, type)}
          disabled={!value || isLoading}
          className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors disabled:opacity-50"
          title="Copy Hash"
        >
          {copied === type ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 relative min-h-[4rem] flex flex-col justify-center">
        {isLoading ? (
           <div className="flex items-center gap-3 text-stone-400">
             <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-sm font-medium">Generating...</span>
           </div>
        ) : (
          <code className="text-sm md:text-base font-mono break-all text-stone-600 dark:text-stone-400">
            {value || <span className="text-stone-300 dark:text-stone-700">Waiting for input...</span>}
          </code>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 flex justify-center h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Fingerprint className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Local Hash Generator</h2>
            <p className="text-stone-500">100% Offline. Generates instantly in your browser.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 focus-within:ring-2 focus-within:ring-blue-500/50 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Input String</span>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-32 md:h-40 p-5 bg-transparent resize-none focus:outline-none dark:text-stone-200 text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HashItem title="MD5" type="md5" value={hashes.md5} />
          <HashItem title="SHA-1" type="sha1" value={hashes.sha1} />
          <HashItem title="SHA-256" type="sha256" value={hashes.sha256} />
          <HashItem title="SHA-512" type="sha512" value={hashes.sha512} />
        </div>
        
        <div className="mt-4">
          <HashItem title="Bcrypt (Cost 10)" type="bcrypt" value={hashes.bcrypt} isLoading={isBcryptLoading} />
        </div>
      </div>
    </div>
  );
}
