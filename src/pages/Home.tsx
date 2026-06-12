import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight, Hash, Star, Clock } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { TOOLS } from "../data/tools";
import { useLocalStorage } from "../hooks/useLocalStorage";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name] || Hash;
  return <Icon className={className || "h-5 w-5"} />;
}

export function Home() {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [favorites] = useLocalStorage<string[]>("tool-favorites", []);
  const [recent, setRecent] = useLocalStorage<string[]>("recent-tools", []);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>("search-history", []);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];
    return TOOLS.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase()) || 
      t.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSearchCommit = (term: string) => {
    if (!term.trim()) return;
    setSearchHistory(prev => {
      const newHistory = prev.filter(t => t !== term);
      return [term, ...newHistory].slice(0, 5);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (query.trim()) {
        handleSearchCommit(query.trim());
        if (filteredTools.length > 0) {
          navigate(filteredTools[0].path);
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
      <section className="bg-white dark:bg-slate-900 px-4 md:px-8 py-10 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight italic transition-colors">
            One tool for every task.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto transition-colors">
            100+ free, browser-based utilities for creators, developers, students, and sellers. Secure, fast, and no login required.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 100+ tools (e.g. Merge PDF, JSON Formatter)..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none text-lg shadow-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute right-4 top-4 text-slate-400 dark:text-slate-500">
              <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs hidden sm:inline-block shadow-sm transition-colors">CTRL + K</kbd>
            </div>
            
            {isSearchFocused && (query || searchHistory.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-10 overflow-hidden text-left transition-colors">
                {query ? (
                  filteredTools.length > 0 ? (
                    <ul className="max-h-96 overflow-y-auto">
                      {filteredTools.map(tool => (
                        <li key={tool.id}>
                          <Link 
                            to={tool.path} 
                            onClick={() => handleSearchCommit(query.trim())}
                            className="flex items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 group border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                          >
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mr-4">
                              <DynamicIcon name={tool.icon || "Hash"} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{tool.description}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">No tools found matching "{query}"</div>
                  )
                ) : (
                  searchHistory.length > 0 && (
                    <div className="py-2">
                       <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex justify-between transition-colors">
                         Recent Searches
                         <button onMouseDown={(e) => { e.preventDefault(); setSearchHistory([]); }} className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Clear</button>
                       </div>
                       <ul>
                         {searchHistory.map((term, i) => (
                            <li key={i}>
                              <button 
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center text-slate-700 dark:text-slate-300 transition-colors"
                                onClick={() => {
                                  setQuery(term);
                                  searchInputRef.current?.focus();
                                }}
                              >
                                <Clock className="w-4 h-4 mr-3 text-slate-400 dark:text-slate-500 transition-colors" />
                                {term}
                              </button>
                            </li>
                         ))}
                       </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex-1 p-4 md:p-8 pt-2 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          {!query && (
            <>
              {favorites.length > 0 && (
                <div id="favorites" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
                      <Star className="w-5 h-5 text-orange-500 fill-current" />
                      Favorites
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {favorites.map(favId => {
                      const tool = TOOLS.find(t => t.id === favId);
                      if (!tool) return null;
                      return (
                        <Link key={tool.id} to={tool.path} className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 cursor-pointer transition-all group">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center transition-colors">
                            <DynamicIcon name={tool.icon || "Hash"} className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recently Used Section */}
              {recent.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Recently Used
                    </h2>
                    <button onClick={() => setRecent([])} className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-wider transition-colors">Clear History</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {recent.map(recentId => {
                      const tool = TOOLS.find(t => t.id === recentId);
                      if (!tool) return null;
                      return (
                        <Link key={tool.id} to={tool.path} className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 cursor-pointer transition-all group">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-colors">
                            <DynamicIcon name={tool.icon || "Hash"} className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular Tools / All Categories */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TOOLS.filter(t => t.isPopular).map(tool => (
                    <Link key={tool.id} to={tool.path} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-md dark:hover:shadow-slate-900 transition-all group cursor-pointer block">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <DynamicIcon name={tool.icon || "Hash"} className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">{tool.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
