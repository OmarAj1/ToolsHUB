import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, RefreshCw, Sliders } from 'lucide-react';

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (excludeSimilar) {
      lower = lower.replace(/[il]/g, '');
      upper = upper.replace(/[IO]/g, '');
      numbers = numbers.replace(/[10]/g, '');
    }

    if (excludeAmbiguous) {
      symbols = '!@#$%^&*'; // Just basic symbols
    }

    let charset = '';
    if (includeLowercase) charset += lower;
    if (includeUppercase) charset += upper;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    // Fallback if nothing selected
    if (!charset) {
      charset = lower;
      setIncludeLowercase(true);
    }

    // Ensure at least one character of each selected type is included
    let newPassword = '';
    const types = [];
    if (includeLowercase) types.push(lower);
    if (includeUppercase) types.push(upper);
    if (includeNumbers) types.push(numbers);
    if (includeSymbols) types.push(symbols);

    types.forEach(typeString => {
      if (newPassword.length < length) {
        newPassword += typeString[Math.floor(Math.random() * typeString.length)];
      }
    });

    while (newPassword.length < length) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthBar = () => {
    // simple heuristic
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (length >= 16) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    let level = 'Weak';
    let color = 'bg-red-500';
    let width = 'w-1/4';

    if (score >= 3) { level = 'Fair'; color = 'bg-yellow-500'; width = 'w-2/4'; }
    if (score >= 5) { level = 'Good'; color = 'bg-blue-500'; width = 'w-3/4'; }
    if (score >= 6) { level = 'Strong'; color = 'bg-emerald-500/100'; width = 'w-full'; }

    return (
      <div className="w-full mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Strength</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${color.replace('bg-', 'text-')}`}>{level}</span>
        </div>
        <div className="h-1.5 w-full bg-stone-100 bg-stone-800 rounded-full overflow-hidden">
          <div className={`h-full ${color} ${width} transition-all duration-300`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-12 flex justify-center items-start min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-900 text-white flex items-center justify-center gap-3">
            <Key className="w-8 h-8 text-blue-500" />
            Secure Password Generator
          </h2>
          <p className="text-stone-500 mt-2 font-medium">Generate strong, completely random passwords entirely in your browser.</p>
        </div>

        <div className="bg-slate-800 bg-stone-900 rounded-2xl shadow-sm border border-stone-200 border-stone-800 overflow-hidden mb-6">
          <div className="p-6 md:p-8 flex flex-col relative bg-stone-50/50 bg-stone-900 border-b border-stone-200 border-stone-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Generated Password</span>
              <button 
                onClick={generatePassword}
                className="text-stone-400 hover:text-blue-500 transition-colors p-1"
                title="Regenerate"
              >
                <RefreshCw className="w-5 h-5 text-purple-500" />
              </button>
            </div>
            
            <div className="text-3xl md:text-5xl font-mono text-center break-all text-stone-800 text-white selection:bg-blue-100 selection:text-blue-900 min-h-[4rem] flex items-center justify-center tracking-tight">
              {password}
            </div>
            
            {getStrengthBar()}
          </div>

          <div className="p-4 bg-slate-800 bg-stone-900 flex justify-center">
            <button 
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto font-bold rounded-xl shadow-lg transition-all ${
                copied 
                  ? 'bg-emerald-500/100 text-white hover:bg-emerald-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:-translate-y-0.5'
              }`}
            >
              {copied ? <Check className="w-5 h-5 text-purple-500" /> : <Copy className="w-5 h-5 text-purple-500" />}
              {copied ? "Copied to Clipboard!" : "Copy Password"}
            </button>
          </div>
        </div>

        <div className="bg-slate-800 bg-stone-900 rounded-2xl shadow-sm border border-stone-200 border-stone-800 p-6 md:p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-stone-700 text-stone-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-400" />
                Password Length
              </label>
              <span className="px-3 py-1 bg-blue-50 bg-blue-900/30 text-blue-600 text-blue-400 font-bold rounded-md">
                {length} chars
              </span>
            </div>
            <input 
              type="range" 
              min="8" max="128" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-stone-200 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 border-stone-800 hover:bg-stone-50 hover:bg-stone-800/50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={includeUppercase} 
                onChange={() => setIncludeUppercase(!includeUppercase)}
                className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-stone-700 text-stone-300">Uppercase Letters (A-Z)</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 border-stone-800 hover:bg-stone-50 hover:bg-stone-800/50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={includeLowercase} 
                onChange={() => setIncludeLowercase(!includeLowercase)}
                className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-stone-700 text-stone-300">Lowercase Letters (a-z)</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 border-stone-800 hover:bg-stone-50 hover:bg-stone-800/50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={includeNumbers} 
                onChange={() => setIncludeNumbers(!includeNumbers)}
                className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-stone-700 text-stone-300">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 border-stone-800 hover:bg-stone-50 hover:bg-stone-800/50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={includeSymbols} 
                onChange={() => setIncludeSymbols(!includeSymbols)}
                className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-stone-700 text-stone-300">Symbols (!@#$...)</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 border-stone-800 hover:bg-stone-50 hover:bg-stone-800/50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={excludeSimilar} 
                onChange={() => setExcludeSimilar(!excludeSimilar)}
                className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-stone-700 text-stone-300">Exclude Similar (i, l, 1, L, o, 0, O)</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 border-stone-800 hover:bg-stone-50 hover:bg-stone-800/50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={excludeAmbiguous} 
                onChange={() => setExcludeAmbiguous(!excludeAmbiguous)}
                className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-stone-700 text-stone-300">Exclude Ambiguous {'({ } [ ] ( ) / \\ \' " ` ~ , ; : . < >)'}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
