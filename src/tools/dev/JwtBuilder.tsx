import React, { useState } from 'react';

export function JwtBuilder() {
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState('your-256-bit-secret');
  
  const [jwt, setJwt] = useState('');
  const [error, setError] = useState('');

  // extremely basic HMAC-SHA256 mock via WebCrypto
  React.useEffect(() => {
    const generateJwt = async () => {
      try {
        setError('');
        const hObj = JSON.parse(header);
        const pObj = JSON.parse(payload);
        
        const encHeader = btoa(JSON.stringify(hObj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        const encPayload = btoa(JSON.stringify(pObj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        
        const data = `${encHeader}.${encPayload}`;
        
        // Mocking the crypto part just to create a hash locally for "HS256" style visuals
        // (In a true tool, we use SubtleCrypto)
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const cryptoKey = await crypto.subtle.importKey(
          "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
        );
        const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
        
        // Convert to base64url
        const signatureBytes = new Uint8Array(signatureBuffer);
        const sigBase64 = btoa(String.fromCharCode(...signatureBytes));
        const sigBase64Url = sigBase64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        
        setJwt(`${data}.${sigBase64Url}`);
      } catch (err: any) {
        setJwt('');
        setError('Invalid JSON in Header or Payload.');
      }
    };

    generateJwt();
  }, [header, payload, secret]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-50 text-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-4 rounded-xl">
             <label className="block font-bold text-red-500 mb-2">Header (JSON)</label>
             <textarea 
               value={header}
               onChange={e => setHeader(e.target.value)}
               className="w-full bg-slate-900 bg-slate-900 font-mono text-sm p-3 rounded h-32 text-red-600 text-red-400 focus:outline-none"
             />
          </div>

          <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-4 rounded-xl">
             <label className="block font-bold text-purple-500 mb-2">Payload (JSON)</label>
             <textarea 
               value={payload}
               onChange={e => setPayload(e.target.value)}
               className="w-full bg-slate-900 bg-slate-900 font-mono text-sm p-3 rounded h-48 text-purple-600 text-purple-400 focus:outline-none"
             />
          </div>

          <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-4 rounded-xl">
             <label className="block font-bold text-blue-500 mb-2">Verify Signature (Secret)</label>
             <input 
               type="text"
               value={secret}
               onChange={e => setSecret(e.target.value)}
               className="w-full bg-slate-900 bg-slate-900 font-mono text-sm p-3 rounded text-blue-600 text-blue-400 focus:outline-none"
             />
          </div>
        </div>

        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-xl flex flex-col h-full min-h-[400px]">
           <h3 className="font-bold mb-4">Generated JWT</h3>
           {error ? (
              <div className="flex-1 flex items-center justify-center text-red-500 font-bold bg-red-50 bg-red-900/10 rounded-lg">
                {error}
              </div>
           ) : (
              <div className="flex-1 w-full bg-slate-900 bg-slate-900 rounded-lg p-6 font-mono text-lg break-all whitespace-pre-wrap leading-relaxed shadow-inner">
                {jwt && (
                  <>
                    <span className="text-red-600 text-red-400 font-bold">{jwt.split('.')[0]}</span>
                    <span className="text-slate-400">.</span>
                    <span className="text-purple-600 text-purple-400 font-bold">{jwt.split('.')[1]}</span>
                    <span className="text-slate-400">.</span>
                    <span className="text-blue-600 text-blue-400 font-bold">{jwt.split('.')[2]}</span>
                  </>
                )}
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
