import { Link, useLocation } from "react-router-dom";
import { CATEGORIES } from "../../data/categories";
import { TOOLS } from "../../data/tools";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import * as LucideIcons from "lucide-react";
import { Star, Hash } from "lucide-react";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name] || Hash;
  return <Icon className={className || "h-5 w-5"} />;
}

export function Sidebar({ isMobileOpen, closeMobile }: { isMobileOpen?: boolean; closeMobile?: () => void }) {
  const [favorites] = useLocalStorage<string[]>("tool-favorites", []);
  const location = useLocation();

  const favoriteTools = favorites.slice(0, 5).map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as typeof TOOLS;

  const sidebarContent = (
    <div className="h-full flex flex-col py-6 px-4 overflow-y-auto">
      {favoriteTools.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-2 flex items-center gap-2">
            <Star className="w-3.5 h-3.5" /> Favorites
          </h3>
          <ul className="space-y-1">
            {favoriteTools.map((tool) => (
              <li key={`fav-${tool.id}`}>
                <Link
                  to={tool.path}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group ${
                    location.pathname === tool.path
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <DynamicIcon
                    name={tool.icon || "Hash"}
                    className={`w-4 h-4 transition-colors ${
                      location.pathname === tool.path
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                    }`}
                  />
                  <span className="truncate">{tool.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-2">
          Categories
        </h3>
        <ul className="space-y-1">
          {CATEGORIES.map((category) => {
            const isActive = location.pathname === `/category/${category.id}`;
            return (
              <li key={category.id}>
                <Link
                  to={`/category/${category.id}`}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <DynamicIcon
                    name={category.icon}
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                    }`}
                  />
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobile}></div>
          <div className="relative w-64 max-w-sm bg-slate-50 dark:bg-slate-950 shadow-xl h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
