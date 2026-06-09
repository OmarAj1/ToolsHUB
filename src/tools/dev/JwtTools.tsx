import { useState } from "react";
import { AlertCircle } from "lucide-react";

function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT format. Must contain 3 parts.");
    
    const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    const signature = parts[2];
    
    return { header, payload, signature };
  } catch (e) {
    throw new Error("Unable to decode JWT. Make sure it is a valid token.");
  }
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = (val: string) => {
    setToken(val);
    if (!val.trim()) {
      setDecoded(null);
      setError(null);
      return;
    }
    try {
      setDecoded(decodeJwt(val));
      setError(null);
    } catch (e: any) {
      setDecoded(null);
      setError(e.message);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Encoded Token</label>
          <textarea
            value={token}
            onChange={(e) => handleDecode(e.target.value)}
            className="w-full h-32 p-4 font-mono text-sm border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none break-all"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center text-sm font-medium">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0" /> {error}
          </div>
        )}

        {decoded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Header (Algorithm & Type)</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm overflow-auto text-pink-600">
                  <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Payload (Data)</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm overflow-auto text-purple-600">
                  <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Signature</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm overflow-auto text-blue-600 break-all">
                {decoded.signature}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Inspector is effectively the same tool
export const JwtInspector = JwtDecoder;
