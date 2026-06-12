import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { TOOLS } from "../data/tools";
import * as LucideIcons from "lucide-react";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Hash;
  return <Icon className={className || "h-5 w-5"} />;
}

export function Category() {
  const { categoryId } = useParams();
  const category = CATEGORIES.find(c => c.id === categoryId);
  const categoryTools = TOOLS.filter(t => t.categoryId === categoryId);

  if (!category) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-slate-800 dark:text-slate-200 transition-colors">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 px-4 md:px-8 transition-colors">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to explore
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
              <DynamicIcon name={category.icon} className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white italic transition-colors">{category.name}</h1>
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl transition-colors">{category.description}</p>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map(tool => {
            const isWorking = tool.isWorking;
            const innerContent = (
              <>
                <div className="flex w-full justify-between items-start">
                  <div className={`w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isWorking ? 'group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400': ''}`}>
                    <DynamicIcon name={tool.icon || "Hash"} />
                  </div>
                  {!isWorking && (
                    <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-md uppercase tracking-wider">
                      Under Maintenance
                    </span>
                  )}
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${isWorking ? 'text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>{tool.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{tool.description}</p>
                </div>
              </>
            );

            if (isWorking) {
              return (
                <Link key={tool.id} to={tool.path} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-all group flex flex-col items-start gap-4 block hover:shadow-md dark:hover:shadow-slate-900 cursor-pointer">
                  {innerContent}
                </Link>
              );
            } else {
              return (
                <div key={tool.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-all group flex flex-col items-start gap-4 block opacity-70 cursor-not-allowed">
                  {innerContent}
                </div>
              );
            }
          })}
          {categoryTools.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">
              More tools coming soon to this category!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
