import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";
import { BUTTONS } from "@/constants";

export function ApiTester() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("{\n  \"Content-Type\": \"application/json\"\n}");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{url: string, method: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("api_tester_history");
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveHistory = (m: string, u: string) => {
    const newHist = [{ method: m, url: u }, ...history.filter(h => h.url !== u || h.method !== m)].slice(0, 5);
    setHistory(newHist);
    localStorage.setItem("api_tester_history", JSON.stringify(newHist));
  };

  const fetchApi = async () => {
    if (!url) return;
    setLoading(true);
    try {
      saveHistory(method, url);
      let parsedHeaders = {};
      try { parsedHeaders = JSON.parse(headers); } catch {}
      
      const start = Date.now();
      const options: RequestInit = { method, headers: parsedHeaders };
      if (method !== "GET" && method !== "HEAD" && body) {
        options.body = body;
      }
      const res = await fetch(url, options);
      const time = Date.now() - start;
      const text = await res.text();
      let data = text;
      try { data = JSON.parse(text); } catch {}
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        time,
        data
      });
    } catch (e: any) {
      let errorMessage = e.message;
      if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
        errorMessage = "CORS Error: Failed to fetch. Ensure the destination API allows cross-origin requests from this domain, or use a CORS proxy. Browsers block opaque responses by default.";
      }
      setResponse({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolContainer className="max-w-5xl">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select 
          value={method} 
          onChange={e => setMethod(e.target.value)}
          className="w-full md:w-32 bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 font-bold text-slate-50 outline-none focus:border-blue-500 transition-colors"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
        </select>
        <input 
          type="text" 
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://api.example.com"
          className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 font-mono text-slate-50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30 transition-colors placeholder-slate-500"
        />
        <button 
          onClick={fetchApi}
          disabled={loading}
          className={`${BUTTONS.primary} w-full md:w-auto px-8 flex items-center justify-center h-12 md:h-auto py-0 disabled:opacity-50`}
        >
          {loading ? "Sending..." : <><Play className="w-4 h-4 mr-2 fill-current text-purple-500" /> Send</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
           <label className="block text-sm font-bold text-slate-400 mb-2">Headers (JSON)</label>
           <TextArea 
             value={headers}
             onChange={e => setHeaders(e.target.value)}
             className="font-mono text-sm h-32"
           />
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-400 mb-2">Req Body</label>
           <TextArea 
             value={body}
             onChange={e => setBody(e.target.value)}
             className="font-mono text-sm h-32"
             placeholder="Request body (optional)"
           />
        </div>
      </div>
      
      {history.length > 0 && (
        <div className="mb-8 overflow-x-auto whitespace-nowrap">
          <span className="text-xs font-bold text-slate-500 mr-2 uppercase">Recent:</span>
          {history.map((h, i) => (
            <button key={i} onClick={() => { setUrl(h.url); setMethod(h.method); }} className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs mr-2 hover:bg-slate-700 font-mono">
              <span className="text-blue-400 font-bold mr-1">{h.method}</span> {h.url.substring(0, 30)}{h.url.length > 30 ? '...' : ''}
            </button>
          ))}
        </div>
      )}

      {response && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className={`px-6 py-4 flex items-center gap-4 text-sm font-bold border-b border-slate-700 ${response.error ? 'bg-red-900/20 text-red-400' : 'bg-slate-800/50 text-slate-50'}`}>
            {response.error ? (
              <span>Error</span>
            ) : (
              <>
                <span className={response.status < 400 ? 'text-green-600' : 'text-red-500'}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-slate-400 font-medium">{response.time} ms</span>
              </>
            )}
          </div>
          <div className="p-4 md:p-6">
            <TextArea 
              readOnly
              value={response.error ? response.error : (typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2))}
              className="h-96 border-none !bg-transparent p-0 m-0 shadow-none focus-visible:ring-0 resize-y font-mono"
            />
          </div>
        </div>
      )}
    </ToolContainer>
  );
}
