import React, { useState } from "react";
import { Youtube, Hash, Clock, MessageSquare, AlignLeft, CheckCircle2, AlertCircle } from "lucide-react";

export function YoutubeTitleChecker() {
  const [title, setTitle] = useState("");
  
  const length = title.length;
  let status = "Good";
  let color = "text-emerald-500";
  
  if (length === 0) {
    status = "Empty";
    color = "text-slate-400";
  } else if (length < 30) {
    status = "Too Short";
    color = "text-orange-500";
  } else if (length > 70) {
    status = "Too Long (Might truncate)";
    color = "text-red-500";
  }

  const words = title.split(" ").filter(w => w.trim() !== "");
  const uppercaseWords = words.filter(w => w === w.toUpperCase() && w.length > 1).length;
  const hasNumbers = /\d/.test(title);
  const hasPowerWords = /(new|free|how to|top|best|worst|secret|why|guide|tutorial|review|vs|fast|easy)/i.test(title);

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Youtube className="w-6 h-6 text-red-500" /> YouTube Title Checker</h2>
        
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Video Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Type your amazing title here..." 
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <span className={`text-sm font-bold ${color}`}>{status}</span>
            <span className={`text-sm ${length > 70 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{length} / 100 max</span>
          </div>
        </div>

        {title && (
          <div className="space-y-3 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase">Analysis</h3>
            <div className="flex items-center gap-3">
              {length >= 40 && length <= 70 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
              <span className="text-sm text-slate-700 dark:text-slate-300">Length ideally between 40-70 characters.</span>
            </div>
            <div className="flex items-center gap-3">
              {hasPowerWords ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-slate-400" />}
              <span className="text-sm text-slate-700 dark:text-slate-300">Contains engaging power words.</span>
            </div>
            <div className="flex items-center gap-3">
              {hasNumbers ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-slate-400" />}
              <span className="text-sm text-slate-700 dark:text-slate-300">Contains numbers or years (draws clicks).</span>
            </div>
            <div className="flex items-center gap-3">
              {uppercaseWords > 0 && uppercaseWords < words.length ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-slate-400" />}
              <span className="text-sm text-slate-700 dark:text-slate-300">Uses selective ALL CAPS words for emphasis.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    const base = topic.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(v=>v);
    if (base.length === 0) return;
    
    // Simple basic generation logic based on keywords
    const suffixes = ["", "life", "tips", "tricks", "daily", "community", "love", "viral", "explore", "style"];
    const results = new Set<string>();
    
    base.forEach(word => {
      results.add(`#${word}`);
      results.add(`#${word}2024`);
      suffixes.forEach(s => {
        if (s) results.add(`#${word}${s}`);
      });
    });
    
    results.add("#fyp");
    results.add("#trending");
    
    setHashtags(Array.from(results).slice(0, 30));
  };

  const copyTags = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8">
        <div className="w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Hash className="w-6 h-6 text-indigo-500" /> Hashtag Generator</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="Enter topics (e.g., travel fitness coffee)" 
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
            />
            <button onClick={generate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              Generate
            </button>
          </div>

          {hashtags.length > 0 && (
            <div className="mt-8 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap gap-2 mb-6">
                {hashtags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <button onClick={copyTags} className="w-full py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                {copied ? "Copied!" : "Copy All Hashtags"}
              </button>
            </div>
          )}
        </div>
    </div>
  );
}

export function ReadTimeEstimator() {
  const [text, setText] = useState("");
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  // Avg read speed is ~200-250 WPM
  const timeMinutes = Math.ceil(words / 200);

  return (
    <div className="p-6 md:p-8">
      <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Clock className="w-6 h-6 text-emerald-500" /> Read Time Estimator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <textarea 
              className="w-full h-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              placeholder="Paste your blog post or script here to calculate reading time..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4 justify-center">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase">Word Count</span>
              <div className="text-4xl font-black text-slate-800 dark:text-white mt-2">{words}</div>
            </div>
            <div className="bg-emerald-600 rounded-2xl p-6 text-center text-white shadow-xl">
              <span className="opacity-90 font-bold text-sm uppercase tracking-wide">Estimated Read Time</span>
              <div className="text-5xl font-black mt-2">{timeMinutes} <span className="text-2xl font-bold opacity-80">min</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialPostPreview() {
  const [text, setText] = useState("");
  const len = text.length;
  
  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 transition-colors">
         <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-blue-500" /> Social Post Preview</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <textarea 
                className="w-full h-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Type your social media post here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="text-right text-sm text-slate-500 mt-2 font-medium">{len} characters</div>
            </div>

            <div className="space-y-4">
              <LimitCard platform="X (Twitter)" limit={280} current={len} colorClass="bg-sky-500" />
              <LimitCard platform="Instagram / Facebook (Truncates)" limit={125} current={len} colorClass="bg-fuchsia-500" />
              <LimitCard platform="LinkedIn (Truncates)" limit={210} current={len} colorClass="bg-blue-600" />
              <LimitCard platform="TikTok Description" limit={2200} current={len} colorClass="bg-slate-800" />
            </div>
         </div>
      </div>
    </div>
  );
}

function LimitCard({ platform, limit, current, colorClass }: { platform: string, limit: number, current: number, colorClass: string }) {
  const pct = Math.min((current / limit) * 100, 100);
  const isOver = current > limit;
  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{platform}</span>
        <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-slate-500'}`}>{current} / {limit}</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${isOver ? 'bg-red-500' : colorClass}`} style={{ width: `${pct}%` }}></div>
      </div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {isOver ? "Over limit or will be truncated." : "Safe to post."}
      </div>
    </div>
  );
}


export function DescriptionGenerator() {
  const [topic, setTopic] = useState("");
  const [links, setLinks] = useState("");
  const [chapters, setChapters] = useState("");
  const [copied, setCopied] = useState(false);

  const template = `
${topic ? `${topic}\n` : "Thanks for watching!"}

Don't forget to LIKE and SUBSCRIBE!
🔔 Subscribe for more videos: [Insert Link Here]

⏱️ Timestamps:
0:00 - Intro
${chapters ? chapters : "1:00 - Chapter 1"}
   
🔗 Check out these links:
${links ? links : "Website: https://example.com"}

📱 Follow my Socials:
Twitter: @yourhandle
Instagram: @yourhandle

#trending #video
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><AlignLeft className="w-6 h-6 text-purple-500" /> Description Builder</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Video Summary / Hook</label>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white" rows={3}></textarea>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Relevant Links (Products, Affiliates)</label>
              <textarea value={links} onChange={e => setLinks(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white" rows={3}></textarea>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Chapters / Timestamps</label>
              <textarea value={chapters} onChange={e => setChapters(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white" rows={3}></textarea>
            </div>
          </div>
          <div>
            <div className="h-full flex flex-col">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Preview</label>
              <textarea readOnly value={template} className="flex-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-sm resize-none text-slate-800 dark:text-slate-200 mb-4"></textarea>
              <button onClick={handleCopy} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
                {copied ? "Copied!" : "Copy Full Description"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

