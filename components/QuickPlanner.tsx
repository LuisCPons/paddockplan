"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateEstimate, GP, BudgetLevel, TripLength, TravelStyle } from '@/src/data/planner-data';
import { AccessModal } from './AccessModal';

export function QuickPlanner() {
  const [gp, setGp] = useState<GP>('Monza');
  const [length, setLength] = useState<TripLength>('Weekend');
  const [style, setStyle] = useState<TravelStyle>('Couple');
  const [budget, setBudget] = useState<BudgetLevel>('Standard');
  
  const [results, setResults] = useState<ReturnType<typeof calculateEstimate> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCalculate = () => {
    const output = calculateEstimate(gp, budget, length, style);
    setResults(output);
  };

  return (
    <section id="plan" className="py-24 md:py-32 bg-[#F9F9F9] border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-background border border-zinc-200 p-10 md:p-16 relative shadow-sm"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Calculator</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Estimate Your Weekend</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
            <div className="flex flex-col border-b border-zinc-200 pb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Select Destination</label>
              <select 
                value={gp} onChange={(e) => setGp(e.target.value as GP)}
                className="w-full bg-transparent appearance-none focus:outline-none text-lg font-medium text-foreground cursor-pointer"
              >
                <option value="Monza">The Italian GP (Monza)</option>
                <option value="Silverstone">The British GP (Silverstone)</option>
                <option value="Monaco">The Monaco GP</option>
                <option value="Austin">The US GP (Austin)</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-zinc-200 pb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Budget Tier</label>
              <select 
                value={budget} onChange={(e) => setBudget(e.target.value as BudgetLevel)}
                className="w-full bg-transparent appearance-none focus:outline-none text-lg font-medium text-foreground cursor-pointer"
              >
                <option value="Value">Value / Self-Guided</option>
                <option value="Standard">Standard / Grandstand</option>
                <option value="Premium">Premium / Hospitality</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-zinc-200 pb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Duration</label>
              <select 
                value={length} onChange={(e) => setLength(e.target.value as TripLength)}
                className="w-full bg-transparent appearance-none focus:outline-none text-lg font-medium text-foreground cursor-pointer"
              >
                <option value="Race Day">Race Day Only (Sun)</option>
                <option value="Weekend">Standard Weekend (Sat-Sun)</option>
                <option value="Full Trip">Full Immersion (Thu-Mon)</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-zinc-200 pb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Travel Group</label>
              <select 
                value={style} onChange={(e) => setStyle(e.target.value as TravelStyle)}
                className="w-full bg-transparent appearance-none focus:outline-none text-lg font-medium text-foreground cursor-pointer"
              >
                <option value="Solo">Solo</option>
                <option value="Couple">Couple</option>
                <option value="Group">Group (3+)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <button 
              onClick={handleCalculate}
              className="px-10 py-4 bg-foreground text-background text-xs uppercase tracking-widest font-bold hover:bg-accent transition-colors duration-300"
            >
              Generate Estimate
            </button>
          </div>

          <AnimatePresence mode="wait">
            {results && (
              <motion.div
                key={`${gp}-${budget}-${length}-${style}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-12 pt-12 border-t border-zinc-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">Estimated Baseline</p>
                        <p className="text-5xl font-extrabold text-foreground tracking-tighter">{results.suggestedBudget}</p>
                        <p className="text-xs text-foreground/40 mt-2 font-light">Excludes international flights. Market rates apply.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1">Suggested Access</p>
                          <p className="text-lg font-medium">{results.ticketType}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1">Accommodation</p>
                          <p className="text-lg font-medium">{results.stayStyle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F9F9F9] border border-zinc-200 p-8">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Concierge Notes</h4>
                      <ul className="space-y-6">
                        {results.tips.map((tip, idx) => (
                          <li key={idx} className="flex gap-4 text-sm text-foreground/80 font-light leading-relaxed">
                            <span className="font-bold text-foreground/30">0{idx + 1}</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-12 flex justify-center pt-8 border-t border-zinc-200">
                     <button 
                       onClick={() => setIsModalOpen(true)}
                       className="px-8 py-4 border border-foreground text-foreground text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-colors duration-300"
                     >
                       Unlock Access for {gp}
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultGP={gp} />
    </section>
  );
}
