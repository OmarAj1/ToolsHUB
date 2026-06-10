import React, { useState } from 'react';
import * as openpgp from 'openpgp';
import { Lock, Unlock, Copy, Check } from 'lucide-react';

export function PgpEncryptDecrypt() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = async () => {
    if (!message || !password) {
      setError('Message and password are required');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      if (mode === 'encrypt') {
        const msg = await openpgp.createMessage({ text: message });
        const encrypted = await openpgp.encrypt({
          message: msg,
          passwords: [password],
          format: 'armored'
        });
        setResult(encrypted as string);
      } else {
        const msg = await openpgp.readMessage({ armoredMessage: message });
        const decrypted = await openpgp.decrypt({
          message: msg,
          passwords: [password],
          format: 'utf8'
        });
        setResult(decrypted.data as string);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error processing message');
      setResult('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="text-center mb-8">
         <p className="text-slate-500">100% Client-Side. Uses symmetric PGP encryption.</p>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl mb-8 mx-auto max-w-sm">
        <button 
          onClick={() => { setMode('encrypt'); setResult(''); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 font-bold rounded-lg transition-colors ${mode === 'encrypt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Lock className="w-4 h-4" /> Encrypt
        </button>
        <button 
          onClick={() => { setMode('decrypt'); setResult(''); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 font-bold rounded-lg transition-colors ${mode === 'decrypt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Unlock className="w-4 h-4" /> Decrypt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
             <label className="block text-sm font-bold mb-2">
               {mode === 'encrypt' ? 'Plaintext Message' : 'PGP Encrypted Message'}
             </label>
             <textarea 
               value={message}
               onChange={e => setMessage(e.target.value)}
               placeholder={mode === 'encrypt' ? 'Enter secret message...' : '-----BEGIN PGP MESSAGE-----...'}
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded font-mono text-sm h-[200px] resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
             />
             
             <label className="block text-sm font-bold mt-4 mb-2">Encryption Password</label>
             <input 
               type="password"
               value={password}
               onChange={e => setPassword(e.target.value)}
               placeholder="Enter a strong password"
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
             />

             <button 
               onClick={processMessage}
               disabled={!message || !password || isProcessing}
               className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {isProcessing ? (
                 <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
               ) : mode === 'encrypt' ? (
                 <Lock className="w-5 h-5" />
               ) : (
                 <Unlock className="w-5 h-5" />
               )}
               {mode === 'encrypt' ? 'Encrypt Message' : 'Decrypt Message'}
             </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col h-full min-h-[300px]">
           <div className="flex justify-between items-center mb-4">
             <label className="block text-sm font-bold">Result</label>
             <button 
                onClick={handleCopy}
                disabled={!result}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded disabled:opacity-50"
             >
               {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
               {copied ? 'Copied' : 'Copy'}
             </button>
           </div>
           
           {error && (
             <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-3 rounded text-sm font-bold mb-4">
               {error}
             </div>
           )}

           <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded p-4 overflow-y-auto">
             {result ? (
               <pre className="font-mono text-sm whitespace-pre-wrap break-all">{result}</pre>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                 {mode === 'encrypt' ? 'Encrypted block will appear here' : 'Decrypted text will appear here'}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
