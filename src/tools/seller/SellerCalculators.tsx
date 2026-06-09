import React, { useState } from "react";
import { DollarSign, Percent, TrendingUp, ShoppingCart, Tag, Receipt, PieChart, Info } from "lucide-react";

export function RoiCalculator() {
  const [investment, setInvestment] = useState<number | "">("");
  const [returnAmount, setReturnAmount] = useState<number | "">("");

  const numInvest = Number(investment) || 0;
  const numReturn = Number(returnAmount) || 0;
  const netProfit = numReturn - numInvest;
  const roi = numInvest > 0 ? (netProfit / numInvest) * 100 : 0;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Investment Amount" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={investment} setValue={setInvestment} />
          <InputGroup label="Return Amount" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={returnAmount} setValue={setReturnAmount} />
        </div>
        <ResultCard title="Return on Investment (ROI)" value={`${roi.toFixed(2)}%`} secondaryLabel="Net Profit" secondaryValue={`$${netProfit.toFixed(2)}`} />
      </div>
    </div>
  );
}

export function MarketplaceFeeCalculator() {
  const [price, setPrice] = useState<number | "">("");
  const [feePercent, setFeePercent] = useState<number | "">("");

  const numPrice = Number(price) || 0;
  const numFee = Number(feePercent) || 0;
  const feeAmount = numPrice * (numFee / 100);
  const netAmount = numPrice - feeAmount;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Selling Price" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={price} setValue={setPrice} />
          <InputGroup label="Marketplace Fee %" icon={<Percent className="w-5 h-5 text-slate-400" />} value={feePercent} setValue={setFeePercent} />
        </div>
        <ResultCard title="Net Earnings" value={`$${netAmount.toFixed(2)}`} secondaryLabel="Fee Amount" secondaryValue={`$${feeAmount.toFixed(2)}`} />
      </div>
    </div>
  );
}

export function PricingCalculator() {
  const [cost, setCost] = useState<number | "">("");
  const [margin, setMargin] = useState<number | "">("");

  const numCost = Number(cost) || 0;
  const numMargin = Number(margin) || 0;
  // Margin = (Price - Cost) / Price => Cost = Price * (1 - Margin) => Price = Cost / (1 - Margin)
  const price = numMargin < 100 ? numCost / (1 - numMargin / 100) : 0;
  const profit = price - numCost;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Product Cost" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={cost} setValue={setCost} />
          <InputGroup label="Desired Margin %" icon={<Percent className="w-5 h-5 text-slate-400" />} value={margin} setValue={setMargin} />
        </div>
        <ResultCard title="Target Selling Price" value={`$${price.toFixed(2)}`} secondaryLabel="Gross Profit" secondaryValue={`$${profit.toFixed(2)}`} />
      </div>
    </div>
  );
}

export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState<number | "">("");
  const [variableCost, setVariableCost] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  const fc = Number(fixedCosts) || 0;
  const vc = Number(variableCost) || 0;
  const p = Number(price) || 0;
  
  const contributionMargin = p - vc;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fc / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * p;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Fixed Costs (Rent, Salaries, etc.)" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={fixedCosts} setValue={setFixedCosts} />
          <InputGroup label="Variable Cost per Unit" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={variableCost} setValue={setVariableCost} />
          <InputGroup label="Selling Price per Unit" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={price} setValue={setPrice} />
        </div>
        <ResultCard title="Break-Even Units" value={`${breakEvenUnits}`} secondaryLabel="Break-Even Revenue" secondaryValue={`$${breakEvenRevenue.toFixed(2)}`} />
      </div>
    </div>
  );
}

export function MarginCalculator() {
  const [cost, setCost] = useState<number | "">("");
  const [revenue, setRevenue] = useState<number | "">("");

  const numCost = Number(cost) || 0;
  const numRev = Number(revenue) || 0;
  const profit = numRev - numCost;
  const margin = numRev > 0 ? (profit / numRev) * 100 : 0;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Product Cost" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={cost} setValue={setCost} />
          <InputGroup label="Total Revenue (Price)" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={revenue} setValue={setRevenue} />
        </div>
        <ResultCard title="Gross Margin" value={`${margin.toFixed(2)}%`} secondaryLabel="Gross Profit" secondaryValue={`$${profit.toFixed(2)}`} />
      </div>
    </div>
  );
}

export function DiscountCalculator() {
  const [price, setPrice] = useState<number | "">("");
  const [discount, setDiscount] = useState<number | "">("");

  const numPrice = Number(price) || 0;
  const numDiscount = Number(discount) || 0;
  const savedAmount = numPrice * (numDiscount / 100);
  const finalPrice = numPrice - savedAmount;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Original Price" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={price} setValue={setPrice} />
          <InputGroup label="Discount %" icon={<Percent className="w-5 h-5 text-slate-400" />} value={discount} setValue={setDiscount} />
        </div>
        <ResultCard title="Final Price" value={`$${finalPrice.toFixed(2)}`} secondaryLabel="You Save" secondaryValue={`$${savedAmount.toFixed(2)}`} />
      </div>
    </div>
  );
}

export function SalesTaxCalculator() {
  const [price, setPrice] = useState<number | "">("");
  const [taxRate, setTaxRate] = useState<number | "">("");

  const numPrice = Number(price) || 0;
  const numTax = Number(taxRate) || 0;
  const taxAmount = numPrice * (numTax / 100);
  const finalPrice = numPrice + taxAmount;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Price before Tax" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={price} setValue={setPrice} />
          <InputGroup label="Sales Tax Rate %" icon={<Percent className="w-5 h-5 text-slate-400" />} value={taxRate} setValue={setTaxRate} />
        </div>
        <ResultCard title="Price with Tax" value={`$${finalPrice.toFixed(2)}`} secondaryLabel="Tax Amount" secondaryValue={`$${taxAmount.toFixed(2)}`} />
      </div>
    </div>
  );
}

export function RevenueForecastTool() {
  const [currentRev, setCurrentRev] = useState<number | "">("");
  const [growthRate, setGrowthRate] = useState<number | "">("");
  const [months, setMonths] = useState<number | "">("");

  const rev = Number(currentRev) || 0;
  const rate = Number(growthRate) || 0;
  const m = Number(months) || 0;
  
  // Compound growth: Future Value = Present Value * (1 + rate)^n
  const finalRevenue = rev * Math.pow(1 + rate / 100, m);

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Current Monthly Revenue" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={currentRev} setValue={setCurrentRev} />
          <InputGroup label="Monthly Growth Rate %" icon={<Percent className="w-5 h-5 text-slate-400" />} value={growthRate} setValue={setGrowthRate} />
          <InputGroup label="Forecast Period (Months)" icon={<TrendingUp className="w-5 h-5 text-slate-400" />} value={months} setValue={setMonths} />
        </div>
        <ResultCard title="Forecasted Revenue" value={`$${finalRevenue.toFixed(2)}`} secondaryLabel="Total Growth" secondaryValue={`$${(finalRevenue - rev).toFixed(2)}`} />
      </div>
    </div>
  );
}

export function ProductCostCalculator() {
  const [manufacturing, setManufacturing] = useState<number | "">("");
  const [shipping, setShipping] = useState<number | "">("");
  const [customs, setCustoms] = useState<number | "">("");
  const [packaging, setPackaging] = useState<number | "">("");

  const mfg = Number(manufacturing) || 0;
  const shp = Number(shipping) || 0;
  const cst = Number(customs) || 0;
  const pkg = Number(packaging) || 0;
  
  const totalLandedCost = mfg + shp + cst + pkg;

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputGroup label="Manufacturing Cost" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={manufacturing} setValue={setManufacturing} />
          <InputGroup label="Shipping Cost" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={shipping} setValue={setShipping} />
          <InputGroup label="Customs / Duties" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={customs} setValue={setCustoms} />
          <InputGroup label="Packaging Cost" icon={<DollarSign className="w-5 h-5 text-slate-400" />} value={packaging} setValue={setPackaging} />
        </div>
        <ResultCard title="Total Landed Cost" value={`$${totalLandedCost.toFixed(2)}`} secondaryLabel="Items Tracked" secondaryValue="4 Costs" />
      </div>
    </div>
  );
}

// Helpers

function InputGroup({ label, icon, value, setValue }: { label: string, icon: React.ReactNode, value: number | "", setValue: (v: number | "") => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type="number"
          className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
          placeholder="0.00"
          value={value}
          onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
    </div>
  );
}

function ResultCard({ title, value, secondaryLabel, secondaryValue }: { title: string, value: string, secondaryLabel: string, secondaryValue: string }) {
  return (
    <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-center relative overflow-hidden transition-colors">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
      
      <div className="relative z-10">
        <h3 className="text-slate-400 font-medium tracking-wide text-sm mb-2 uppercase">{title}</h3>
        <div className="text-4xl md:text-5xl font-bold mb-8 break-words text-white">
          {value}
        </div>

        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center text-slate-400 text-sm mb-1">
            <Info className="w-4 h-4 mr-1.5" /> {secondaryLabel}
          </div>
          <div className="text-2xl font-bold text-white">{secondaryValue}</div>
        </div>
      </div>
    </div>
  );
}
