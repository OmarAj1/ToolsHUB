import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Star, Share2 } from "lucide-react";
import { TOOLS } from "../../data/tools";
import { CATEGORIES } from "../../data/categories";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AdBanner } from "../ads/AdBanner";
import { analytics } from "../../lib/analytics";
import { ErrorBoundary } from "../../lib/ErrorBoundary";
import { GenericToolWrapper } from "../ui/GenericToolWrapper";

export function ToolLayout({ children, toolId, faq }: { children: React.ReactNode, toolId: string, faq?: { question: string, answer: string }[] }) {
  const tool = TOOLS.find(t => t.id === toolId);
  const [favorites, setFavorites] = useLocalStorage<string[]>("tool-favorites", []);
  const [recent, setRecent] = useLocalStorage<string[]>("recent-tools", []);

  useEffect(() => {
    if (tool) {
      analytics.logOpen(tool.id);
      setRecent(prev => {
        const filtered = prev.filter(id => id !== tool.id);
        return [tool.id, ...filtered].slice(0, 6);
      });
    }
  }, [toolId, tool]);

  if (!tool) return <div>Tool not found</div>;
  if (!tool.isWorking) return (
    <div className="flex-1 flex flex-col bg-slate-900 bg-slate-900 px-4 md:px-8 py-32 items-center justify-center text-center">
        <h1 className="text-3xl font-extrabold text-slate-50 text-slate-50 mb-4 italic">Under Maintenance</h1>
        <p className="text-slate-400 text-slate-50 max-w-md mb-8">This tool has been temporarily disabled while we stabilize the platform. Please check back later.</p>
        <Link to="/" className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold transition">Return to Homepage</Link>
    </div>
  );
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
    <div className="flex-1 flex flex-col bg-slate-900 bg-slate-900 transition-colors">
      <Helmet>
        <title>{tool.name} - ToolHub</title>
        <meta name="description" content={tool.description} />
      </Helmet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      
      <div className="bg-slate-800 bg-slate-800 border-b border-slate-700 border-slate-700 transition-colors">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 text-slate-50 mb-6 transition-colors">
            <Link to="/" className="hover:text-slate-50 hover:text-slate-300 transition-colors">Tools</Link>
            <span>/</span>
            {category && (
              <>
                <Link to={`/category/${category.id}`} className="hover:text-slate-50 hover:text-slate-300 transition-colors">{category.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-slate-50 text-white transition-colors">{tool.name}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-50 text-white italic mb-2 transition-colors">{tool.name}</h1>
              <p className="text-slate-400 text-slate-50 text-lg transition-colors">{tool.description}</p>
            </div>
            <div className="flex bg-slate-900 bg-slate-800/50 rounded-xl border border-slate-700 border-slate-700/50 p-1 transition-colors">
              <button 
                className={`flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all ${isFavorite ? 'text-orange-500 bg-slate-800 bg-slate-800 shadow-sm' : 'text-slate-50 text-slate-50 hover:text-orange-500 hover:text-orange-400 hover:bg-slate-800 hover:bg-slate-700'}`}
                onClick={toggleFavorite}
              >
                <Star className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} /> {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
              <button 
                className="flex items-center px-4 py-2 text-sm font-bold text-slate-50 text-slate-50 hover:text-blue-600 hover:text-blue-400 hover:bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  const btn = document.getElementById('share-btn-text');
                  if (btn) {
                    const original = btn.innerText;
                    btn.innerText = 'Copied!';
                    setTimeout(() => btn.innerText = original, 2000);
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2 text-purple-500" /> <span id="share-btn-text">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col">
        <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-3xl shadow-sm overflow-hidden flex-1 transition-colors">
          <ErrorBoundary toolId={toolId}>
            <GenericToolWrapper toolName={toolId}>
              {children}
            </GenericToolWrapper>
          </ErrorBoundary>
        </div>
        
        {/* Ad Banner replacing SEO Content */}
        <div className="mt-12 max-w-3xl pb-12 space-y-8">
          <div className="w-full mb-6">
            <AdBanner adSlot="tool-bottom-banner" className="bg-slate-800 bg-slate-800/50 min-h-[90px] w-full" />
          </div>

          {faq && faq.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-slate-50 text-white transition-colors">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faq.map((f, i) => (
                  <div key={i} className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl p-5 shadow-sm transition-colors">
                    <h3 className="font-bold text-slate-50 text-slate-50 mb-2 transition-colors">{f.question}</h3>
                    <p className="text-sm text-slate-400 text-slate-50 transition-colors">{f.answer}</p>
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
