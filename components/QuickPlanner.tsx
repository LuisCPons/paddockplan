"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AccessModal } from './AccessModal';
import { Ticket, Home, Lightbulb, ArrowRight, CircleDollarSign, Map, Clock, Lock } from 'lucide-react';
import { useCurrency } from '@/lib/CurrencyContext';
import { formatPrice } from '@/lib/formatPrice';
import { CurrencySelector } from './CurrencySelector';

/**
 * MDODULARITY NOTE:
 * If this component grows, consider splitting:
 * 1. GP_PLANNER_DATA -> src/data/planner-data.ts
 * 2. SliderRow -> sub-component for range inputs
 * 3. ResultCard -> sub-component for the output display area
 */

type BudgetTier = 'Budget' | 'Balanced' | 'Premium';

interface TierData {
  budgetRange: { min: number, max: number, currency: 'EUR' | 'GBP' };
  ticketType: string;
  stayStyle: string;
  tips: string[];
}

interface GPData {
  name: string;
  tiers: Record<BudgetTier, TierData>;
}

const PLANNER_DATA: Record<number, GPData> = {
  1: {
    name: 'Monza',
    tiers: {
      Budget: {
        budgetRange: { min: 400, max: 700, currency: 'EUR' },
        ticketType: 'General Admission (Prato)',
        stayStyle: 'Hostel or Budget Airbnb in Milan',
        tips: ['Take the train from Milan Centrale early.', 'Bring a small stool for General Admission.', 'Pack comfortable walking shoes for the park.']
      },
      Balanced: {
        budgetRange: { min: 800, max: 1500, currency: 'EUR' },
        ticketType: 'Grandstand (Variante del Rettifilo)',
        stayStyle: '3-4 Star Hotel in Milan with Metro access',
        tips: ['Book your grandstand tickets months ahead.', 'Enjoy dinner in the Brera district.', 'Use the shuttle bus from Monza station.']
      },
      Premium: {
        budgetRange: { min: 3000, max: 5000, currency: 'EUR' },
        ticketType: 'VIP Hospitality & Pit Access',
        stayStyle: 'Luxury Boutique Hotel in Milan City Center',
        tips: ['Best arrival times for the morning pit walk.', 'Visit Lake Como for a post-race retreat.', 'Early track entry is essential for the podium dash.']
      }
    }
  },
  2: {
    name: 'Silverstone',
    tiers: {
      Budget: {
        budgetRange: { min: 350, max: 600, currency: 'GBP' },
        ticketType: 'General Admission',
        stayStyle: 'Camping at the track or nearby',
        tips: ['Bring a radio for track commentary.', 'Prepare for very unpredictable weather.', 'Book your parking well in advance.']
      },
      Balanced: {
        budgetRange: { min: 700, max: 1300, currency: 'GBP' },
        ticketType: 'Grandstand (Village or Woodcote)',
        stayStyle: 'B&B in Northampton or Milton Keynes',
        tips: ['Use the park and ride services.', 'Explore the Silverstone Museum on Thursday.', 'Pack a quality waterproof poncho.']
      },
      Premium: {
        budgetRange: { min: 2500, max: 4000, currency: 'GBP' },
        ticketType: 'Fusion Lounge or Octane Terrace',
        stayStyle: 'Luxury Manor House or Hotel in the Cotswolds',
        tips: ['Helicopter transfers avoid the traffic.', 'Enjoy the evening concerts from VIP areas.', 'Book a private guided track walk.']
      }
    }
  },
  3: {
    name: 'Barcelona',
    tiers: {
      Budget: {
        budgetRange: { min: 300, max: 500, currency: 'EUR' },
        ticketType: 'General Admission (Pelouse)',
        stayStyle: 'Hostel in Barcelona City Center',
        tips: ['Take the R2 Nord train to Montmeló.', 'Wear plenty of sunscreen, shade is rare.', 'The fan zone has great food at lower prices.']
      },
      Balanced: {
        budgetRange: { min: 600, max: 1100, currency: 'EUR' },
        ticketType: 'Grandstand G or M',
        stayStyle: 'Apartment rental in Eixample',
        tips: ['Book a grandstand near the first corner.', 'Stay for the track invasion at the finish.', 'Enjoy the nightlife in El Born.']
      },
      Premium: {
        budgetRange: { min: 2000, max: 3500, currency: 'EUR' },
        ticketType: 'Premium Grandstand or Garden Village',
        stayStyle: '5-Star Beach Hotel (Arts or W)',
        tips: ['Use the high-speed AVE train for city access.', 'VIP areas include the best circuit views.', 'Explore the Montserrat mountains via helicopter.']
      }
    }
  }
};

const getBudgetName = (val: number): BudgetTier => {
  if (val === 1) return 'Budget';
  if (val === 2) return 'Balanced';
  return 'Premium';
};

const getStyleName = (val: number): string => {
  if (val === 1) return 'Efficiency';
  if (val === 2) return 'Comfort';
  return 'Experience';
};

const CustomSlider = ({ 
  value, 
  min, 
  max, 
  onChange 
}: { 
  value: number, 
  min: number, 
  max: number, 
  onChange: (val: number) => void 
}) => {
  const steps = [];
  for (let i = min; i <= max; i++) steps.push(i);
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-8 flex items-center my-2">
      <div className="absolute left-0 right-0 h-1 bg-[#262626] rounded-full" />
      <div 
        className="absolute left-0 h-1 bg-accent rounded-full transition-all duration-300" 
        style={{ width: `${progress}%` }} 
      />
      <div className="absolute inset-0 flex justify-between items-center">
        {steps.map((step) => {
          const isActive = step === value;
          const isPassed = step <= value;
          return (
            <button
              key={step}
              onClick={() => onChange(step)}
              className={`w-4 h-4 rounded-full border-[3px] transition-all duration-300 z-10 ${
                isActive 
                  ? 'bg-accent border-background scale-[1.3] shadow-[0_0_12px_rgba(204,0,0,0.5)]' 
                  : isPassed 
                    ? 'bg-accent border-background hover:scale-110' 
                    : 'bg-muted-foreground border-background hover:bg-foreground/50 hover:scale-110'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export function QuickPlanner() {
  const { selectedCurrency, convert } = useCurrency();
  const [gpIndex, setGpIndex] = useState(1);
  const [budgetIndex, setBudgetIndex] = useState(2);
  const [lengthIndex, setLengthIndex] = useState(3);
  const [styleIndex, setStyleIndex] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsGenerating(true);
    const timer = setTimeout(() => setIsGenerating(false), 1000);
    return () => clearTimeout(timer);
  }, [gpIndex, budgetIndex, lengthIndex, styleIndex]);

  const results = useMemo(() => {
    const gpData = PLANNER_DATA[gpIndex];
    const budgetTier = getBudgetName(budgetIndex);
    return {
      gpName: gpData.name,
      ...gpData.tiers[budgetTier]
    };
  }, [gpIndex, budgetIndex]);

  const formattedRange = useMemo(() => {
    const range = results.budgetRange;
    const minConverted = convert(range.min, range.currency as any);
    const maxConverted = convert(range.max, range.currency as any);
    
    const minStr = formatPrice(minConverted, selectedCurrency, range.min, range.currency as any);
    const maxStr = formatPrice(maxConverted, selectedCurrency, range.max, range.currency as any);
    
    // Simple range display if converted
    if (selectedCurrency !== range.currency) {
      const symbol = selectedCurrency === 'EUR' ? '€' : selectedCurrency === 'GBP' ? '£' : '$';
      const origSymbol = range.currency === 'EUR' ? '€' : '£';
      return `${symbol}${Math.round(minConverted)} - ${symbol}${Math.round(maxConverted)} (~${origSymbol}${range.min}-${range.max})`;
    }
    
    return `${minStr} - ${maxStr}`;
  }, [results.budgetRange, selectedCurrency, convert]);

  // Derived state hash for animation triggers
  const stateHash = `${gpIndex}-${budgetIndex}-${lengthIndex}-${styleIndex}-${selectedCurrency}`;

  return (
    <section id="plan" className="py-24 md:py-32 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-2xl p-10 md:p-16 relative shadow-sm"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Interactive Planner</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tailor Your Weekend</h2>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Preferred Currency</span>
            <CurrencySelector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-16">
            {/* GP Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Grand Prix</label>
                <span className="text-sm font-bold text-accent">{PLANNER_DATA[gpIndex].name}</span>
              </div>
              <CustomSlider 
                min={1} max={3} 
                value={gpIndex} onChange={setGpIndex} 
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                <span className={`transition-colors duration-300 ${gpIndex === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Monza</span>
                <span className={`transition-colors duration-300 ${gpIndex === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Silverstone</span>
                <span className={`transition-colors duration-300 ${gpIndex === 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Barcelona</span>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget Level</label>
                <span className="text-sm font-bold text-accent">{getBudgetName(budgetIndex)}</span>
              </div>
              <CustomSlider 
                min={1} max={3} 
                value={budgetIndex} onChange={setBudgetIndex} 
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                <span className={`transition-colors duration-300 ${budgetIndex === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Value</span>
                <span className={`transition-colors duration-300 ${budgetIndex === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Balanced</span>
                <span className={`transition-colors duration-300 ${budgetIndex === 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Premium</span>
              </div>
            </div>

            {/* Length Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trip Length</label>
                <span className="text-sm font-bold text-accent">{lengthIndex} Nights</span>
              </div>
              <CustomSlider 
                min={2} max={4} 
                value={lengthIndex} onChange={setLengthIndex} 
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                <span className={`transition-colors duration-300 ${lengthIndex === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>2 Nights</span>
                <span className={`transition-colors duration-300 ${lengthIndex === 3 ? 'text-foreground' : 'text-muted-foreground'}`}>3 Nights</span>
                <span className={`transition-colors duration-300 ${lengthIndex === 4 ? 'text-foreground' : 'text-muted-foreground'}`}>4 Nights</span>
              </div>
            </div>

            {/* Style Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Travel Style</label>
                <span className="text-sm font-bold text-accent">{getStyleName(styleIndex)}</span>
              </div>
              <CustomSlider 
                min={1} max={3} 
                value={styleIndex} onChange={setStyleIndex} 
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                <span className={`transition-colors duration-300 ${styleIndex === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Efficiency</span>
                <span className={`transition-colors duration-300 ${styleIndex === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Comfort</span>
                <span className={`transition-colors duration-300 ${styleIndex === 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Experience</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-border relative">
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 top-12 bottom-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent animate-pulse">
                      Generating data for {PLANNER_DATA[gpIndex].name}...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={stateHash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Estimated Range</p>
                    <p className="text-3xl md:text-4xl font-light text-foreground tracking-tighter">{formattedRange}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 font-light uppercase tracking-wide">Includes {lengthIndex} nights • {getStyleName(styleIndex)} style</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-border flex items-center justify-center bg-background/50">
                        <Ticket className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Recommended Tickets</p>
                        <p className="text-sm font-bold">{results.ticketType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-border flex items-center justify-center bg-background/50">
                        <Home className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Stay Strategy</p>
                        <p className="text-sm font-bold">{results.stayStyle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-border p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Pro Tips</h4>
                  </div>
                  <ul className="space-y-6 mb-8">
                    {results.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-4 text-sm text-foreground/80 font-light leading-relaxed">
                        <span className="font-bold text-accent/40 text-xs">0{idx + 1}</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-border">
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed font-light">
                      The "Full Tactical Hub" provides the precise logistics needed to execute this {results.gpName} trip without the guesswork.
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
            <div className="mt-16 border-t border-border pt-12">
              <div className="mb-10 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6 block">Included in Premium</span>
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center">
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="w-4 h-4 text-accent/60" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/80">Detailed Budget Breakdown</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Map className="w-4 h-4 text-accent/60" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/80">Stay Area Recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-accent/60" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/80">Circuit Access Timelines</span>
                  </div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 w-full relative"
              >
                <div className="text-center mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Premium Tactical Hub Preview</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 blur-[3px] pointer-events-none select-none">
                  {/* Card A: Budget Chart */}
                  <div className="p-6 border border-border bg-background/50 space-y-4 h-[200px]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Precise Expense Breakdown</p>
                    <div className="space-y-4 pt-2">
                       {[0.8, 0.6, 0.4, 0.5].map((scale, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center text-[8px] text-muted-foreground uppercase font-bold">
                              <span>Label {i}</span>
                              <span>—</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                               <div className="h-full bg-accent" style={{ width: `${scale * 100}%` }} />
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Card B: Map Hotspot */}
                  <div className="p-6 border border-border bg-background/50 flex flex-col items-center justify-center h-[200px] relative overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4 absolute top-6 left-6">Stay Area Heatmap</p>
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 bg-accent/30 rounded-full blur-2xl animate-pulse" />
                      <div className="absolute inset-4 border border-accent/20 rounded-full" />
                      <div className="absolute inset-8 border border-accent/40 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#CC0000]" />
                    </div>
                  </div>

                  {/* Card C: Timeline */}
                  <div className="p-6 border border-border bg-background/50 space-y-4 h-[200px]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Arrival & Logistics</p>
                    <div className="space-y-4 pt-2">
                       {[1, 2, 3].map((i) => (
                         <div key={i} className="flex gap-3 items-start border-l border-border pl-4 relative">
                            <div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-accent/40" />
                            <div className="space-y-2 flex-1">
                              <div className="h-2 w-12 bg-muted rounded" />
                              <div className="h-1.5 w-full bg-muted/40 rounded" />
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Glass Overlay with Consolidated Button */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[6px] border border-white/5 rounded-sm">
                  <div className="flex flex-col items-center max-w-xs text-center">
                    <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-6">
                      <Lock className="w-5 h-5 text-white/40" />
                    </div>
                    <h5 className="text-lg font-bold tracking-tight text-white mb-6">Experience the Full Weekend.</h5>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(225, 6, 0, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsModalOpen(true)}
                      className="group bg-[#E10600] text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_15px_rgba(225,6,0,0.3)]"
                    >
                      ACCESS TACTICAL HUB <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultGP={results.gpName} />
    </section>
  );
}
