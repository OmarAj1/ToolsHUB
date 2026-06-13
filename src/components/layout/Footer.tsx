import { Link } from "react-router-dom";
import { CATEGORIES } from "../../data/categories";

export function Footer() {
  return (
    <footer className="w-full bg-slate-800 bg-slate-900 border-t border-slate-700 border-slate-700/60 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 text-slate-50 flex-shrink-0 transition-colors">
      <div className="flex gap-4 md:gap-6 uppercase tracking-widest font-bold mb-4 md:mb-0">
        <Link to="/privacy" className="hover:text-slate-50 hover:text-slate-300 cursor-pointer transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-slate-50 hover:text-slate-300 cursor-pointer transition-colors">Terms</Link>
        <Link to="/" className="hover:text-slate-50 hover:text-slate-300 cursor-pointer transition-colors">Directory</Link>
        <a href="mailto:contact@example.com" className="hover:text-slate-50 hover:text-slate-300 cursor-pointer transition-colors">Contact</a>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-400 text-slate-50 transition-colors">Built for the Web.</span>
        <span className="text-slate-300 text-slate-50 transition-colors">|</span>
        <span className="transition-colors">&copy; {new Date().getFullYear()} ToolHub</span>
      </div>
    </footer>
  );
}
