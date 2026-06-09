import { Link } from "react-router-dom";
import { Wrench, Moon, Sun, Menu, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedPref = localStorage.getItem('theme');
    if (storedPref === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      if (!storedPref) {
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = !isDarkMode;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between px-4 md:px-8 flex-shrink-0 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-sm transition-colors">
            <Terminal className="w-5 h-5 text-white dark:text-slate-900" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">ToolHub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Explore</Link>
          <Link to="/#categories" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Categories</Link>
          <Link to="/#favorites" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Favorites</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3 md:gap-4 relative">
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg px-2.5 py-1.5 border border-slate-200/50 dark:border-slate-800 transition-colors">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Offline Ready</span>
        </div>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>
        
        <button 
          className="md:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {isMobileMenuOpen && (
          <div className="absolute top-12 right-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-2 flex flex-col md:hidden">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Explore</Link>
            <Link to="/#categories" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Categories</Link>
            <Link to="/#favorites" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Favorites</Link>
          </div>
        )}
      </div>
    </header>
  );
}
