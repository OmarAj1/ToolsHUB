import { useState } from "react";
import { CircleDollarSign, TrendingUp, DollarSign } from "lucide-react";

export function ProfitCalculator() {
  const [cost, setCost] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  const numCost = Number(cost) || 0;
  const numPrice = Number(price) || 0;

  const profit = Math.max(0, numPrice - numCost);
  const margin = numPrice > 0 ? (profit / numPrice) * 100 : 0;
  const markup = numCost > 0 ? (profit / numCost) * 100 : 0;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Item Cost (What you pay)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-stone-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  className="block w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow dark:bg-stone-900 absolute dark:border-stone-800 dark:text-white"
                  style={{position: 'relative'}}
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Sale Price (What customer pays)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-stone-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  className="block w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow dark:bg-stone-900 absolute dark:border-stone-800 dark:text-white"
                  style={{position: 'relative'}}
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => { setCost(""); setPrice(""); }}
            className="w-full py-3 text-sm font-medium text-stone-500 hover:bg-stone-100 rounded-xl dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
          >
            Clear Fields
          </button>
        </div>

        <div className="bg-stone-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <h3 className="text-stone-400 font-medium tracking-wide text-sm mb-2 uppercase">Gross Profit</h3>
            <div className="text-5xl font-bold mb-8 flex items-baseline">
              <span className="text-3xl text-stone-400 mr-1">$</span>
              {profit.toFixed(2)}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-800 pt-6">
              <div>
                <div className="flex items-center text-stone-400 text-sm mb-1">
                  <CircleDollarSign className="w-4 h-4 mr-1.5" /> Margin
                </div>
                <div className="text-2xl font-bold">{margin.toFixed(2)}%</div>
              </div>
              <div>
                <div className="flex items-center text-stone-400 text-sm mb-1">
                  <TrendingUp className="w-4 h-4 mr-1.5" /> Markup
                </div>
                <div className="text-2xl font-bold">{markup.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
