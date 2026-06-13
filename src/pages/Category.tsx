import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  if (!category) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-slate-50 transition-colors">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <Link to="/" className="text-blue-400 hover:underline transition-colors">Go back home</Link>
      </div>
    );
  }

  // Every category should show only working tools
  const categoryTools = TOOLS.filter(t => t.categoryId === categoryId && t.isWorking);

  const filteredTools = categoryTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-900 transition-colors">
      <div className="bg-slate-800/40 border-b border-slate-700/60 py-10 px-4 md:px-8 transition-colors">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to explore
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-slate-850 border border-slate-750 w-12 h-12 rounded-xl flex items-center justify-center text-slate-300 transition-colors">
              <DynamicIcon name={category.icon} className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white transition-colors">{category.name}</h1>
          </div>
          <p className="text-base text-slate-400 max-w-2xl transition-colors">{category.description}</p>

          {/* Search bar to find tools by name in this category */}
          <div className="relative mt-8 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={`Search in ${category.name}...`}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-700/80 bg-slate-900 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-sm transition-colors text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => {
              return (
                <Link 
                  key={tool.id} 
                  to={tool.path} 
                  className="p-6 bg-slate-800 border border-slate-700/60 rounded-3xl transition-all group flex flex-col items-start gap-4 hover:border-slate-600 block hover:shadow-md hover:shadow-slate-950/20 cursor-pointer"
                >
                  <div className="flex w-full justify-between items-start">
                    <div className="w-10 h-10 bg-slate-900 text-slate-300 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-blue-900/40 group-hover:text-blue-400">
                      <DynamicIcon name={tool.icon || "Hash"} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 transition-colors">{tool.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 text-sm font-medium transition-colors">
            {categoryTools.length === 0 ? "No tools available in this category yet." : `No tools found matching "${searchQuery}"`}
          </div>
        )}
      </div>
    </div>
  );
}
