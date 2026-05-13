/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Package, 
  Weight, 
  Layers, 
  Calculator, 
  Info,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Constants for products
const PRODUCTS = {
  DEMI_MODULE: {
    name: "Demi module",
    unitsPerPallet: 72,
    weightPerUnit: 10,
    volumePerUnit: 0.2376,
  },
  PLAQUE_PERIPHERIQUE: {
    name: "Plaque périphérique",
    unitsPerPallet: 212,
    weightPerUnit: 2.1,
    volumePerUnit: 0,
  }
};

const TRUCK_CAPACITY = 22; // Pallets per truck

export default function App() {
  const [qty1, setQty1] = useState<string>('1500');
  const [qty2, setQty2] = useState<string>('3200');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const q1 = parseInt(qty1) || 0;
    const q2 = parseInt(qty2) || 0;

    const pal1 = q1 / PRODUCTS.DEMI_MODULE.unitsPerPallet;
    const pal2 = q2 / PRODUCTS.PLAQUE_PERIPHERIQUE.unitsPerPallet;

    const totalPalletsRaw = pal1 + pal2;
    const totalPalletsRounded = Math.ceil(totalPalletsRaw);

    const truckCount = Math.ceil(totalPalletsRounded / TRUCK_CAPACITY);
    
    const totalWeight = (q1 * PRODUCTS.DEMI_MODULE.weightPerUnit) + (q2 * PRODUCTS.PLAQUE_PERIPHERIQUE.weightPerUnit);
    const totalVolume = (q1 * PRODUCTS.DEMI_MODULE.volumePerUnit) + (q2 * PRODUCTS.PLAQUE_PERIPHERIQUE.volumePerUnit);
    
    const m3PerTruck = truckCount > 0 ? (totalVolume / truckCount).toFixed(3) : "0.000";

    const palletsInLastTruckRaw = totalPalletsRounded % TRUCK_CAPACITY;
    const palletsInLastTruck = palletsInLastTruckRaw === 0 && totalPalletsRounded > 0 ? TRUCK_CAPACITY : palletsInLastTruckRaw;
    const lastTruckFillRate = Math.round((palletsInLastTruck / TRUCK_CAPACITY) * 100);

    const fillPercent = truckCount > 0 ? Math.min((totalVolume / (truckCount * 35)) * 100, 100) : 0;

    setResults({
      pal1: Math.ceil(pal1),
      pal2: Math.ceil(pal2),
      totalPalletsRaw: totalPalletsRaw.toFixed(2),
      totalPalletsRounded,
      truckCount,
      totalWeight: Math.round(totalWeight).toLocaleString('fr-FR'),
      totalVolume: totalVolume.toFixed(3),
      m3PerTruck,
      fillPercent,
      lastTruckFillRate,
      lastTruckNum: truckCount,
      palletsInLastTruck
    });
  };

  React.useEffect(() => {
    calculate();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <header className="h-16 px-8 flex items-center border-b bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
            <Truck size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 uppercase">Calculateur Optibox</h1>
        </div>
        <div className="ml-auto text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">EXPERT MODE ACTIVE</div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r bg-white p-8 flex flex-col gap-8 shadow-sm shrink-0">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Saisie des Articles</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex justify-between">
                  <span>Article 1 <span className="text-slate-400 font-normal">({PRODUCTS.DEMI_MODULE.name})</span></span>
                  <span className="text-indigo-600 font-bold">{PRODUCTS.DEMI_MODULE.unitsPerPallet}/pal</span>
                </label>
                <input 
                  type="number" 
                  value={qty1}
                  onChange={(e) => setQty1(e.target.value)}
                  placeholder="0" 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex justify-between">
                  <span>Article 2 <span className="text-slate-400 font-normal">({PRODUCTS.PLAQUE_PERIPHERIQUE.name})</span></span>
                  <span className="text-indigo-600 font-bold">{PRODUCTS.PLAQUE_PERIPHERIQUE.unitsPerPallet}/pal</span>
                </label>
                <input 
                  type="number" 
                  value={qty2} 
                  onChange={(e) => setQty2(e.target.value)}
                  placeholder="0" 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg font-bold"
                />
              </div>
            </div>
          </section>

          <button 
            onClick={calculate} 
            className="mt-auto w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            CALCULER LES BESOINS
          </button>
        </aside>

        <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto bg-slate-50">
          <AnimatePresence mode="wait">
            {results && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Palettes</span>
                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-6xl font-black text-slate-900 leading-none">{results.totalPalletsRounded}</span>
                      <span className="text-lg font-bold text-slate-300 uppercase">Units</span>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 italic">Arrondi à l'unité supérieure</div>
                  </div>

                  <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 flex flex-col text-white">
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Besoins Camions</span>
                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-6xl font-black leading-none">{results.truckCount}</span>
                      <span className="text-lg font-bold text-indigo-300 uppercase">Trks</span>
                    </div>
                    <div className="mt-4 text-sm text-indigo-200">Capacité standard : 22 palettes</div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Poids Total Estimé</span>
                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-6xl font-black text-slate-900 leading-none truncate">{results.totalWeight}</span>
                      <span className="text-lg font-bold text-slate-300 uppercase">Kg</span>
                    </div>
                    <div className="mt-4 text-sm text-slate-500">Calculé sur densités réelles</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
                  <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col text-white">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Détails du Chargement</h3>
                    <div className="space-y-6 flex-1">
                      <div className="flex justify-between items-center py-4 border-b border-slate-800">
                        <span className="text-slate-400">palettes demi-module</span>
                        <span className="font-mono font-bold text-lg">{results.pal1}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-slate-800">
                        <span className="text-slate-400">palettes plaques périph.</span>
                        <span className="font-mono font-bold text-lg">{results.pal2}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-slate-800">
                        <span className="text-slate-400">Volume Total</span>
                        <span className="font-mono font-bold text-lg">{results.totalVolume} m³</span>
                      </div>
                    </div>
                    <div className="mt-8 p-4 bg-slate-800 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1 font-bold uppercase text-indigo-400 text-[10px] tracking-[0.2em]">Alerte Capacité</div>
                      <div className="text-sm text-slate-300">Chargement optimisé pour transporteur standard 22 pal.</div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Charge Volumétrique par Camion</h3>
                      <div className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                          {results.lastTruckNum}ème camion : {results.lastTruckFillRate}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                      <div className="relative w-full h-48 bg-slate-100 rounded-2xl overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${results.fillPercent}%` }}
                          className="absolute bottom-0 left-0 w-full bg-indigo-500 transition-all duration-500"
                        ></motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-black text-slate-900 drop-shadow-sm">{results.m3PerTruck}</span>
                          <span className="text-xl font-bold text-slate-600 ml-2 italic">m³/trk</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-500">Moyenne du volume utile par unité</p>
                        <p className="text-[11px] font-bold text-indigo-500 mt-1 uppercase tracking-widest">
                          Le {results.lastTruckNum}ème camion contient {results.palletsInLastTruck} palettes
                        </p>
                      </div>
                      
                      {/* Truck Icons Visualization */}
                      <div className="w-full pt-4 border-t border-slate-50">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: Math.ceil(results.truckCount) }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg shadow-sm"
                              title={`Camion ${i + 1}`}
                            >
                              <Truck size={20} />
                            </motion.div>
                          ))}
                        </div>
                        {results.truckCount > 0 && (
                          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                            Flotte nécessaire : {Math.ceil(results.truckCount)} unité(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
