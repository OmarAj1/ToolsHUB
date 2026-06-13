import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from "react";
import { ArrowLeftRight, Copy, CheckCircle2 } from "lucide-react";

const CATEGORIES = {
  length: {
    Meter: 1,
    Kilometer: 1000,
    Centimeter: 0.01,
    Millimeter: 0.001,
    Inch: 0.0254,
    Foot: 0.3048,
    Yard: 0.9144,
    Mile: 1609.34
  },
  weight: {
    Kilogram: 1,
    Gram: 0.001,
    Milligram: 0.000001,
    Pound: 0.453592,
    Ounce: 0.0283495
  },
  data: {
    Byte: 1,
    Kilobyte: 1024,
    Megabyte: 1048576,
    Gigabyte: 1073741824,
    Terabyte: 1099511627776
  },
  currency: {
    USD: 1,
    EUR: 0.94,
    GBP: 0.79,
    JPY: 153.6,
    CAD: 1.36,
    AUD: 1.53,
    INR: 83.2,
    CNY: 7.23,
    CHF: 0.91
  }
};

function UnitConvertersBase() {
  const [activeCategory, setActiveCategory] = useState<"length" | "weight" | "temperature" | "data" | "currency">("length");
  
  const [value1, setValue1] = useState<string>("1");
  const [unit1, setUnit1] = useState<string>("Meter");
  const [value2, setValue2] = useState<string>("3.28084");
  const [unit2, setUnit2] = useState<string>("Foot");

  const [copied, setCopied] = useState(false);

  const handleCategoryChange = (cat: "length" | "weight" | "temperature" | "data" | "currency") => {
    setActiveCategory(cat);
    if (cat === "temperature") {
      setUnit1("Celsius");
      setUnit2("Fahrenheit");
      setValue1("0");
      setValue2("32");
    } else {
      const units = Object.keys(CATEGORIES[cat]);
      setUnit1(units[0]);
      setUnit2(units[1] || units[0]);
      setValue1("1");
      // Calculate
      const m1 = CATEGORIES[cat][units[0]];
      const m2 = CATEGORIES[cat][units[1] || units[0]];
      setValue2(((1 * m1) / m2).toString());
    }
  };

  const convert = (val: string, from: string, to: string, isReversed = false) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      if (isReversed) setValue1(""); else setValue2("");
      return;
    }

    let result = 0;
    
    if (activeCategory === "temperature") {
      // Temp conversion
      if (from === "Celsius" && to === "Fahrenheit") result = (num * 9/5) + 32;
      else if (from === "Celsius" && to === "Kelvin") result = num + 273.15;
      else if (from === "Fahrenheit" && to === "Celsius") result = (num - 32) * 5/9;
      else if (from === "Fahrenheit" && to === "Kelvin") result = (num - 32) * 5/9 + 273.15;
      else if (from === "Kelvin" && to === "Celsius") result = num - 273.15;
      else if (from === "Kelvin" && to === "Fahrenheit") result = (num - 273.15) * 9/5 + 32;
      else result = num;
    } else {
      // Factor conversion
      const factors = CATEGORIES[activeCategory as "length" | "weight" | "data" | "currency"];
      const factor1 = factors[from as keyof typeof factors];
      const factor2 = factors[to as keyof typeof factors];
      result = (num * factor1) / factor2;
    }

    // Format avoiding scientific notation for reasonable numbers if possible, but keep simple
    const resStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(6)).toString();
    
    if (isReversed) {
      setValue1(resStr);
    } else {
      setValue2(resStr);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(value2);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tempUnits = ["Celsius", "Fahrenheit", "Kelvin"];
  const currentUnits = activeCategory === "temperature" ? tempUnits : Object.keys(CATEGORIES[activeCategory as "length" | "weight" | "data" | "currency"]);

  return (
    <div className="p-6 md:p-8 flex flex-col items-center min-h-[500px]">
      <div className="w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-10 transition-colors shadow-sm">
        
        <div className="flex flex-wrap gap-2 mb-8">
          {(["length", "weight", "temperature", "data", "currency"] as const).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide capitalize transition-colors ${activeCategory === cat ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-blue-500 transition-colors">
            <select 
              value={unit1} 
              onChange={e => {
                setUnit1(e.target.value);
                convert(value1, e.target.value, unit2, false);
              }}
              className="w-full bg-transparent text-slate-400 font-bold outline-none mb-2"
            >
              {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input 
              type="number" 
              value={value1}
              onChange={e => {
                setValue1(e.target.value);
                convert(e.target.value, unit1, unit2, false);
              }}
              className="w-full bg-transparent text-3xl font-bold text-white outline-none"
              placeholder="0"
            />
          </div>

          <div className="w-12 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-full shrink-0 shadow-sm text-slate-400">
             <ArrowLeftRight className="w-5 h-5 hidden md:block" />
             <ArrowLeftRight className="w-5 h-5 md:hidden rotate-90" />
          </div>

          <div className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-blue-500 transition-colors">
            <select 
              value={unit2} 
              onChange={e => {
                setUnit2(e.target.value);
                convert(value2, e.target.value, unit1, true);
              }}
              className="w-full bg-transparent text-slate-400 font-bold outline-none mb-2"
            >
              {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input 
              type="number" 
              value={value2}
              onChange={e => {
                setValue2(e.target.value);
                convert(e.target.value, unit2, unit1, true);
              }}
              className="w-full bg-transparent text-3xl font-bold text-white outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={copyResult} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors text-sm"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Result"}
          </button>
        </div>

      </div>
    </div>
  );
}

export const UnitConverters = () => <GenericToolWrapper toolName="UnitConverters"><UnitConvertersBase /></GenericToolWrapper>;
