import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Star, Share2 } from "lucide-react";
import { TOOLS } from "../../data/tools";
import { CATEGORIES } from "../../data/categories";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export function ToolLayout({ children, toolId, faq }: { children: React.ReactNode, toolId: string, faq?: { question: string, answer: string }[] }) {
  const tool = TOOLS.find(t => t.id === toolId);
  const [favorites, setFavorites] = useLocalStorage<string[]>("tool-favorites", []);
  const [recent, setRecent] = useLocalStorage<string[]>("recent-tools", []);

  useEffect(() => {
    if (tool) {
      setRecent(prev => {
        const filtered = prev.filter(id => id !== tool.id);
        return [tool.id, ...filtered].slice(0, 6);
      });
    }
  }, [toolId]);

  if (!tool) return <div>Tool not found</div>;
  const category = CATEGORIES.find(c => c.id === tool.categoryId);
  const isFavorite = favorites.includes(tool.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(id => id !== tool.id));
    } else {
      setFavorites([tool.id, ...favorites]);
    }
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "applicationCategory": "BrowserApplication",
    "description": tool.description,
  };

  const faqSchema = faq && faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500 mb-6 transition-colors">
            <Link to="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Tools</Link>
            <span>/</span>
            {category && (
              <>
                <Link to={`/category/${category.id}`} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">{category.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-900 dark:text-white transition-colors">{tool.name}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white italic mb-2 transition-colors">{tool.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors">{tool.description}</p>
            </div>
            <div className="flex bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 p-1 transition-colors">
              <button 
                className={`flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all ${isFavorite ? 'text-orange-500 bg-white dark:bg-slate-800 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-slate-800'}`}
                onClick={toggleFavorite}
              >
                <Star className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} /> {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
              <button 
                className="flex items-center px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex-1 transition-colors">
          {children}
        </div>
        
        {/* Placeholder for SEO Content / Instructions */}
        <div className="mt-12 max-w-3xl pb-12 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-white transition-colors">How to use {tool.name}</h2>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed space-y-4 transition-colors">
              <p>Our completely free online {tool.name.toLowerCase()} works securely directly in your browser. All processing is local, keeping your data entirely private without any server uploads.</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Provide your inputs into the secure {tool.name.toLowerCase()} panel above.</li>
                <li>Wait for processing to complete or click the corresponding action button.</li>
                <li>Instantly retrieve, copy, or download your results.</li>
              </ol>
            </div>
          </div>

          {faq && faq.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white transition-colors">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faq.map((f, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">{f.question}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
