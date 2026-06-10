import React, { useState, useEffect } from 'react';

export function CidrSubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateSubnet(ip, cidr);
  }, [ip, cidr]);

  const calculateSubnet = (ipStr: string, prefix: number) => {
    try {
      // Validate IP
      const parts = ipStr.split('.');
      if (parts.length !== 4) throw new Error();
      const numParts = parts.map(Number);
      if (numParts.some(n => isNaN(n) || n < 0 || n > 255)) throw new Error();
      
      const ipNum = (numParts[0] << 24) | (numParts[1] << 16) | (numParts[2] << 8) | numParts[3];
      const mask = prefix === 0 ? 0 : ~((1 << (32 - prefix)) - 1);
      const network = ipNum & mask;
      const broadcast = network | ~mask;
      
      const firstHost = prefix >= 31 ? network : network + 1;
      const lastHost = prefix >= 31 ? broadcast : broadcast - 1;
      const totalHosts = prefix >= 31 ? 2 : (broadcast - network - 1);

      const numToIp = (num: number) => {
        return `${(num >>> 24) & 255}.${(num >>> 16) & 255}.${(num >>> 8) & 255}.${num & 255}`;
      };

      setResults({
        networkMode: true,
        networkAddress: numToIp(network),
        broadcastAddress: numToIp(broadcast),
        subnetMask: numToIp(mask),
        firstHost: numToIp(firstHost),
        lastHost: numToIp(lastHost),
        totalHosts: totalHosts,
        wildcardMask: numToIp(~mask)
      });
    } catch (e) {
      setResults(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-6">
         <div className="flex-1">
           <label className="block text-sm font-bold mb-2">IP Address</label>
           <input 
             type="text" 
             value={ip} 
             onChange={(e) => setIp(e.target.value)} 
             className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
         </div>
         <div className="w-full md:w-48">
           <label className="block text-sm font-bold mb-2">CIDR Prefix (/{cidr})</label>
           <input 
             type="number" 
             min="0" max="32" 
             value={cidr} 
             onChange={(e) => setCidr(Number(e.target.value))} 
             className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
         </div>
      </div>

      {results ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left font-mono text-sm">
             <tbody>
               <tr className="border-b border-slate-100 dark:border-slate-800">
                 <td className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold w-1/3">Network Address</td>
                 <td className="p-4">{results.networkAddress} <span className="text-slate-400">/{cidr}</span></td>
               </tr>
               <tr className="border-b border-slate-100 dark:border-slate-800">
                 <td className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold">Subnet Mask</td>
                 <td className="p-4">{results.subnetMask}</td>
               </tr>
               <tr className="border-b border-slate-100 dark:border-slate-800">
                 <td className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold">Wildcard Mask</td>
                 <td className="p-4">{results.wildcardMask}</td>
               </tr>
               <tr className="border-b border-slate-100 dark:border-slate-800">
                 <td className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold">First Assignable Host</td>
                 <td className="p-4 text-green-600 dark:text-green-400 font-bold">{results.firstHost}</td>
               </tr>
               <tr className="border-b border-slate-100 dark:border-slate-800">
                 <td className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold">Last Assignable Host</td>
                 <td className="p-4 text-green-600 dark:text-green-400 font-bold">{results.lastHost}</td>
               </tr>
               <tr className="border-b border-slate-100 dark:border-slate-800">
                 <td className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold">Broadcast Address</td>
                 <td className="p-4 text-red-500">{results.broadcastAddress}</td>
               </tr>
               <tr>
                 <td className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold">Total Usable Hosts</td>
                 <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{results.totalHosts.toLocaleString()}</td>
               </tr>
             </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl font-bold text-center">
          Invalid IPv4 Address Format
        </div>
      )}
    </div>
  );
}
