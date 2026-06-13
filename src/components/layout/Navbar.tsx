import { Link } from "react-router-dom";
import { Wrench, Moon, Sun, Menu, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
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
    <header className="h-16 bg-slate-800 bg-slate-900 border-b border-slate-700 border-slate-700/60 flex items-center justify-between px-4 md:px-8 flex-shrink-0 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 bg-slate-800 rounded-xl flex items-center justify-center shadow-sm transition-colors">
            <Terminal className="w-5 h-5 text-white text-slate-50" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-50 text-white transition-colors">ToolHub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-400 hover:text-slate-50 text-slate-50 hover:text-white transition-colors">Explore</Link>
          <Link to="/#categories" className="text-sm font-medium text-slate-400 hover:text-slate-50 text-slate-50 hover:text-white transition-colors">Categories</Link>
          <Link to="/#favorites" className="text-sm font-medium text-slate-400 hover:text-slate-50 text-slate-50 hover:text-white transition-colors">Favorites</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3 md:gap-4 relative">
        <div className="hidden sm:block" id="google_translate_element"></div>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-slate-400 hover:bg-slate-800 text-slate-50 hover:bg-slate-700 transition-colors focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>
        
        <button 
          className="lg:hidden p-2 rounded-full text-slate-400 hover:bg-slate-800 text-slate-50 hover:bg-slate-700 transition-colors"
          onClick={() => {
            if (onMenuClick) onMenuClick();
            else setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <Menu className="w-5 h-5 text-purple-500" />
        </button>

        {isMobileMenuOpen && (
          <div className="absolute top-12 right-0 w-48 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-xl shadow-lg py-2 flex flex-col md:hidden">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-50 text-slate-50 hover:bg-slate-800 hover:bg-slate-700">Explore</Link>
            <Link to="/#categories" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-50 text-slate-50 hover:bg-slate-800 hover:bg-slate-700">Categories</Link>
            <Link to="/#favorites" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-50 text-slate-50 hover:bg-slate-800 hover:bg-slate-700">Favorites</Link>
          </div>
        )}
      </div>
    </header>
  );
}
