import React from 'react';
import { QrType } from '../qr-constants';
import { Link, Type as TypeIcon, Mail, MessageSquare, Phone, Wifi, Contact } from 'lucide-react';

export function QrDataTab({ state, setters }: any) {
  const { qrType, url, text, emailTo, emailSub, emailBody, smsPhone, smsMsg, telPhone, wifiSsid, wifiPass, wifiEnc, wifiHidden, vcFirst, vcLast, vcPhone, vcEmail, vcOrg, vcTitle, vcUrl } = state;
  const { setQrType, setUrl, setText, setEmailTo, setEmailSub, setEmailBody, setSmsPhone, setSmsMsg, setTelPhone, setWifiSsid, setWifiPass, setWifiEnc, setWifiHidden, setVcFirst, setVcLast, setVcPhone, setVcEmail, setVcOrg, setVcTitle, setVcUrl } = setters;

  return (
     <div className="space-y-8 max-w-2xl">
        <div className="flex flex-wrap gap-3 mb-8">
           {(['URL', 'Text', 'Email', 'SMS', 'Phone', 'WiFi', 'vCard'] as QrType[]).map(t => (
             <button key={t} onClick={() => setQrType(t)} className={`px-5 py-3 rounded-2xl text-[13px] font-bold transition-all border ${qrType === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30 ring-offset-1 dark:ring-offset-[#1A1A1A] scale-[1.02]' : 'bg-white border-slate-200 text-slate-600 dark:bg-[#1A1A1A] dark:border-[#2A2A2A] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#222] hover:scale-105'}`}>
               {t === 'URL' && <Link className="w-4 h-4 inline mr-2 opacity-80" />}
               {t === 'Text' && <TypeIcon className="w-4 h-4 inline mr-2 opacity-80" />}
               {t === 'Email' && <Mail className="w-4 h-4 inline mr-2 opacity-80" />}
               {t === 'SMS' && <MessageSquare className="w-4 h-4 inline mr-2 opacity-80" />}
               {t === 'Phone' && <Phone className="w-4 h-4 inline mr-2 opacity-80" />}
               {t === 'WiFi' && <Wifi className="w-4 h-4 inline mr-2 opacity-80" />}
               {t === 'vCard' && <Contact className="w-4 h-4 inline mr-2 opacity-80" />}
               {t}
             </button>
           ))}
        </div>

        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
           {qrType === 'URL' && (
              <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Website URL</label>
                 <input type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" placeholder="https://example.com" />
              </div>
           )}
           {qrType === 'Text' && (
              <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Plain Text Message</label>
                 <textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none" placeholder="Enter text to encode..." />
              </div>
           )}
           {qrType === 'Email' && (
              <div className="space-y-4">
                 <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">To</label><input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium" placeholder="hello@example.com" /></div>
                 <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label><input type="text" value={emailSub} onChange={e => setEmailSub(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium" placeholder="Meeting inquiry" /></div>
                 <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Body</label><textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={3} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium resize-none" placeholder="Type your message..." /></div>
              </div>
           )}
           {qrType === 'SMS' && (
              <div className="space-y-4">
                 <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label><input type="tel" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 mb-4 focus:outline-none focus:border-indigo-500 transition-all font-medium" placeholder="+1234567890" /></div>
                 <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Text Message</label><textarea value={smsMsg} onChange={e => setSmsMsg(e.target.value)} rows={3} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium resize-none" placeholder="Hey there..." /></div>
              </div>
           )}
           {qrType === 'Phone' && (
              <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                 <input type="tel" value={telPhone} onChange={e => setTelPhone(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition-all font-medium" placeholder="+1234567890" />
              </div>
           )}
           {qrType === 'WiFi' && (
              <div className="space-y-4 bg-slate-50 dark:bg-[#111111] p-6 rounded-[2rem] border border-slate-100 dark:border-[#222]">
                 <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Network Name (SSID)</label><input type="text" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium" /></div>
                 <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label><input type="password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium" /></div>
                 <div className="flex items-center gap-4">
                    <div className="flex-1">
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Encryption</label>
                       <select value={wifiEnc} onChange={e => setWifiEnc(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none">
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None</option>
                       </select>
                    </div>
                    <label className="flex items-center gap-3 pt-6 cursor-pointer">
                       <input type="checkbox" checked={wifiHidden} onChange={e => setWifiHidden(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-[#161616] dark:border-[#333]" />
                       <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Hidden Network</span>
                    </label>
                 </div>
              </div>
           )}
           {qrType === 'vCard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">First Name</label><input type="text" value={vcFirst} onChange={e => setVcFirst(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all" /></div>
                 <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Last Name</label><input type="text" value={vcLast} onChange={e => setVcLast(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all" /></div>
                 <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Phone</label><input type="tel" value={vcPhone} onChange={e => setVcPhone(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all" /></div>
                 <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Email</label><input type="email" value={vcEmail} onChange={e => setVcEmail(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all" /></div>
                 <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Company</label><input type="text" value={vcOrg} onChange={e => setVcOrg(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all" /></div>
                 <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Job Title</label><input type="text" value={vcTitle} onChange={e => setVcTitle(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all" /></div>
                 <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Website</label><input type="url" value={vcUrl} onChange={e => setVcUrl(e.target.value)} className="w-full bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#333] rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-500 transition-all" /></div>
              </div>
           )}
        </div>
     </div>
  );
}
