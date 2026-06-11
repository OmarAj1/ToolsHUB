import { useState } from "react";
import { Play } from "lucide-react";
import { ToolContainer } from "@/components/ui/Layouts";
import { TextArea } from "@/components/ui/TextArea";
import { BUTTONS } from "@/constants";

export function ApiTester() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useState("GET");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchApi = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const start = Date.now();
      const res = await fetch(url, { method });
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
      <div className="flex flex-col md:flex-row gap-4">
        <select 
          value={method} 
          onChange={e => setMethod(e.target.value)}
          className="w-full md:w-32 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
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
          className="flex-1 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-colors placeholder-slate-400 dark:placeholder-slate-500"
        />
        <button 
          onClick={fetchApi}
          disabled={loading}
          className={`${BUTTONS.primary} w-full md:w-auto px-8 flex items-center justify-center h-12 md:h-auto py-0 disabled:opacity-50`}
        >
          {loading ? "Sending..." : <><Play className="w-4 h-4 mr-2 fill-current" /> Send</>}
        </button>
      </div>

      {response && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className={`px-6 py-4 flex items-center gap-4 text-sm font-bold border-b border-slate-100 dark:border-slate-800 ${response.error ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'}`}>
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
              className="h-96 border-none !bg-transparent p-0 m-0 shadow-none focus-visible:ring-0 resize-y"
            />
          </div>
        </div>
      )}
    </ToolContainer>
  );
}
