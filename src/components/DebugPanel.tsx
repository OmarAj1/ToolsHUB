import React, { useEffect, useState } from 'react';
import { analytics, AnalyticsEvent } from '../lib/analytics';
import { Terminal, X, AlertCircle, PlayCircle, Maximize2, Minimize2 } from 'lucide-react';

export function DebugPanel() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    // Initial load
    setEvents([...analytics.getEvents()]);

    const unsubscribe = analytics.subscribe(() => {
      setEvents([...analytics.getEvents()]);
    });

    return unsubscribe;
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-slate-900 border border-slate-700 text-white p-3 flex items-center gap-2 rounded-full shadow-lg z-50 hover:bg-slate-800 transition-colors"
      >
        <Terminal className="w-5 h-5" />
        <span className="font-mono text-xs font-semibold pr-1">Debug</span>
      </button>
    );
  }

  return (
    <div className={`fixed right-4 bottom-4 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[32rem]'}`}>
      <div 
        className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2 text-white">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">Analytics Tracker</span>
          <span className="bg-slate-700 text-xs px-2 py-0.5 rounded-full">{events.length}</span>
        </div>
        <div className="flex items-center gap-2" flex-shrink-0>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="text-slate-400 hover:text-white p-1"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-900 custom-scrollbar">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 h-full">
              <Terminal className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs font-mono">No events logged yet.</p>
              <p className="text-[10px] mt-1 opacity-70">Open a tool to see events here.</p>
            </div>
          ) : (
            events.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg border flex flex-col gap-1 text-sm font-mono ${
                  event.type === 'TOOL_ERROR' 
                    ? 'bg-red-950/30 border-red-900/50 text-red-200' 
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {event.type === 'TOOL_ERROR' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span className="font-semibold text-white">
                      {event.type === 'OPEN_TOOL' ? 'OPEN' : 'ERROR'}
                    </span>
                  </div>
                  <span className="text-xs opacity-50">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-5 flex flex-col gap-1">
                  <span className="text-emerald-300">"{event.toolId}"</span>
                  {event.message && (
                    <span className="text-red-400 text-xs whitespace-pre-wrap flex-1">{event.message}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
