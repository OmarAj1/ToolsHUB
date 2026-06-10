import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import zxcvbn from 'zxcvbn';

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!password) {
      setResult(null);
      return;
    }
    const evaluation = zxcvbn(password);
    setResult(evaluation);
  }, [password]);

  const getScoreColor = (score: number) => {
    switch(score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-emerald-500';
      default: return 'bg-stone-200';
    }
  };

  const getScoreText = (score: number) => {
    switch(score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="p-4 md:p-8 flex justify-center h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="w-full max-w-3xl space-y-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
            {result?.score === 4 ? (
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-stone-500" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Password Strength</h2>
          <p className="text-stone-500 mt-2 font-medium">Evaluates time-to-crack locally. No data leaves your browser.</p>
        </div>

        <div className="relative">
          <input 
            type="text" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password to test..."
            className="w-full h-16 md:h-20 px-6 text-xl md:text-2xl font-mono bg-white dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-800 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors shadow-sm dark:text-white"
          />
        </div>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            
            <div className="flex gap-2 h-3 w-full">
              {[0,1,2,3].map((idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 rounded-full transition-colors duration-300 ${
                    result.score > idx 
                      ? getScoreColor(result.score)
                      : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                />
              ))}
            </div>

            <div className="text-center mb-8">
              <span className={`text-2xl font-black uppercase tracking-widest ${getScoreColor(result.score).replace('bg-', 'text-')}`}>
                {getScoreText(result.score)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Estimated Time to Crack</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-stone-100 dark:border-stone-800 pb-2">
                    <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Offline (fast hash)</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white text-lg">
                      {result.crack_times_display.offline_fast_hashing_1e10_per_second}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-stone-100 dark:border-stone-800 pb-2">
                    <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Offline (slow hash)</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                      {result.crack_times_display.offline_slow_hashing_1e4_per_second}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-stone-100 dark:border-stone-800 pb-2">
                    <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Online (no throttling)</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                      {result.crack_times_display.online_no_throttling_10_per_second}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Online (throttled)</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                      {result.crack_times_display.online_throttling_100_per_hour}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(result.feedback.warning || result.feedback.suggestions.length > 0) ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-5 h-full">
                    <h3 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-4">Feedback</h3>
                    {result.feedback.warning && (
                      <p className="text-yellow-800 dark:text-yellow-400 font-bold mb-3 flex items-start gap-2">
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        {result.feedback.warning}
                      </p>
                    )}
                    {result.feedback.suggestions.length > 0 && (
                      <ul className="list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-500 space-y-1">
                        {result.feedback.suggestions.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-5 h-full flex flex-col justify-center items-center text-center">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mb-3" />
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold">Looks good! No warnings.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 text-center flex flex-col justify-center items-center">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Total Guesses</span>
              <span className="font-mono text-2xl font-black text-stone-800 dark:text-stone-200">
                {result.guesses.toLocaleString()}
              </span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
