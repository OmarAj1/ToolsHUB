import { Link } from "react-router-dom";
import { CATEGORIES } from "../../data/categories";

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/60 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0 transition-colors">
      <div className="flex gap-4 md:gap-6 uppercase tracking-widest font-bold mb-4 md:mb-0">
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">Privacy</a>
        <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">Terms</a>
        <a href="/" className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">Directory</a>
        <a href="mailto:contact@example.com" className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">Contact</a>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-500 dark:text-slate-400 transition-colors">Built for the Web.</span>
        <span className="text-slate-300 dark:text-slate-700 transition-colors">|</span>
        <span className="transition-colors">&copy; {new Date().getFullYear()} ToolHub Interactive</span>
      </div>
    </footer>
  );
}
