import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Trash2, Shuffle } from 'lucide-react';

function InteractiveFlashcardsBase() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('flashcards_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, front: 'Photosynthesis', back: 'The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.' },
      { id: 2, front: 'Mitochondria', back: 'An organelle found in large numbers in most cells, in which the biochemical processes of respiration and energy production occur. (The powerhouse of the cell)' },
      { id: 3, front: 'Osmosis', back: 'A process by which molecules of a solvent tend to pass through a semipermeable membrane from a less concentrated solution into a more concentrated one.' }
    ];
  });
  
  useEffect(() => {
    localStorage.setItem('flashcards_data', JSON.stringify(cards));
  }, [cards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    }, 150);
  };

  const addCard = () => {
    setCards([...cards, { id: Date.now(), front: 'New Term', back: 'New Definition' }]);
  };

  const removeCard = (id: number) => {
    if (cards.length <= 1) return;
    setCards(cards.filter((c: any) => c.id !== id));
    setCurrentIndex(0);
  };

  const updateCard = (id: number, field: 'front' | 'back', value: string) => {
    setCards(cards.map((c: any) => c.id === id ? { ...c, [field]: value } : c));
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-50">
      
      <div className="flex justify-between items-center mb-8">
         <h2 className="font-bold text-xl">Flashcards</h2>
         <div className="flex gap-2">
           {!isEditMode && (
             <button 
               onClick={shuffleCards}
               className="px-4 py-2 font-bold rounded-lg transition-colors bg-slate-800 text-slate-50 hover:bg-slate-700 flex items-center gap-2"
             >
               <Shuffle className="w-4 h-4" /> Shuffle
             </button>
           )}
           <button 
             onClick={() => setIsEditMode(!isEditMode)}
             className={`px-4 py-2 font-bold rounded-lg transition-colors ${isEditMode ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-50 hover:bg-slate-700'}`}
           >
             {isEditMode ? 'Done Editing' : 'Edit Cards'}
           </button>
         </div>
      </div>

      {!isEditMode ? (
        <div className="flex flex-col items-center">
           <div 
             onClick={() => setIsFlipped(!isFlipped)}
             className="w-full max-w-2xl aspect-[3/2] perspective-1000 cursor-pointer"
           >
              <div 
                className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d rounded-3xl shadow-lg border border-slate-700 ${isFlipped ? 'rotate-y-180' : ''}`}
              >
                  {/* Front */}
                  <div className="absolute w-full h-full backface-hidden bg-slate-800 rounded-3xl flex items-center justify-center p-12 text-center shadow-inner">
                     <h3 className="text-4xl font-bold text-blue-400">{cards[currentIndex]?.front}</h3>
                     <span className="absolute bottom-6 text-slate-400 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                       <RefreshCw className="w-4 h-4 text-purple-500" /> Click to Flip
                     </span>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute w-full h-full backface-hidden bg-blue-900/30 rounded-3xl flex items-center justify-center p-12 text-center rotate-y-180 border-t-8 border-blue-500">
                     <p className="text-2xl font-medium leading-relaxed">{cards[currentIndex]?.back}</p>
                  </div>
              </div>
           </div>

           <div className="flex items-center gap-8 mt-10">
             <button onClick={prevCard} className="p-4 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors border border-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
             </button>
             <span className="font-bold text-lg text-slate-400">
               {currentIndex + 1} / {cards.length}
             </span>
             <button onClick={nextCard} className="p-4 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition-colors border border-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
             </button>
           </div>
        </div>
      ) : (
        <div className="space-y-6">
           {cards.map((card: any, index: number) => (
             <div key={card.id} className="bg-slate-800 border border-slate-700 rounded-2xl flex shadow-sm">
                <div className="w-16 flex items-center justify-center border-r border-slate-700 font-bold text-slate-400 bg-slate-900 rounded-l-2xl">
                  {index + 1}
                </div>
                <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Term (Front)</label>
                    <textarea value={card.front} onChange={(e) => updateCard(card.id, 'front', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 resize-none h-24" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Definition (Back)</label>
                    <textarea value={card.back} onChange={(e) => updateCard(card.id, 'back', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 resize-none h-24" />
                  </div>
                </div>
                <button onClick={() => removeCard(card.id)} disabled={cards.length <= 1} className="w-16 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors rounded-r-2xl border-l border-slate-700 disabled:opacity-30">
                  <Trash2 className="w-5 h-5" />
                </button>
             </div>
           ))}
           <button onClick={addCard} className="w-full py-4 border-2 border-dashed border-slate-700 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-center gap-2">
             <Plus className="w-5 h-5 text-purple-500" /> Add New Card
           </button>
        </div>
      )}

      {/* Add required custom CSS for 3D flip effect */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

export const InteractiveFlashcards = () => <GenericToolWrapper toolName="InteractiveFlashcards"><InteractiveFlashcardsBase /></GenericToolWrapper>;
