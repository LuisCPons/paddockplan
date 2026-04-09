"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AccessModal } from './AccessModal';
import { Ticket, Home, Lightbulb, ArrowRight, CircleDollarSign, Map, Clock } from 'lucide-react';

/**
 * MDODULARITY NOTE:
 * If this component grows, consider splitting:
 * 1. GP_PLANNER_DATA -> src/data/planner-data.ts
 * 2. SliderRow -> sub-component for range inputs
 * 3. ResultCard -> sub-component for the output display area
 */

type BudgetTier = 'Budget' | 'Balanced' | 'Premium';

interface TierData {
  budgetRange: string;
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
        budgetRange: '€400 - €700',
        ticketType: 'General Admission (Prato)',
        stayStyle: 'Hostel or Budget Airbnb in Milan',
        tips: ['Take the train from Milan Centrale early.', 'Bring a small stool for General Admission.', 'Pack comfortable walking shoes for the park.']
      },
      Balanced: {
        budgetRange: '€800 - €1,500',
        ticketType: 'Grandstand (Variante del Rettifilo)',
        stayStyle: '3-4 Star Hotel in Milan with Metro access',
        tips: ['Book your grandstand tickets months ahead.', 'Enjoy dinner in the Brera district.', 'Use the shuttle bus from Monza station.']
      },
      Premium: {
        budgetRange: '€3,000+',
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
        budgetRange: '£350 - £600',
        ticketType: 'General Admission',
        stayStyle: 'Camping at the track or nearby',
        tips: ['Bring a radio for track commentary.', 'Prepare for very unpredictable weather.', 'Book your parking well in advance.']
      },
      Balanced: {
        budgetRange: '£700 - £1,300',
        ticketType: 'Grandstand (Village or Woodcote)',
        stayStyle: 'B&B in Northampton or Milton Keynes',
        tips: ['Use the park and ride services.', 'Explore the Silverstone Museum on Thursday.', 'Pack a quality waterproof poncho.']
      },
      Premium: {
        budgetRange: '£2,500+',
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
        budgetRange: '€300 - €500',
        ticketType: 'General Admission (Pelouse)',
        stayStyle: 'Hostel in Barcelona City Center',
        tips: ['Take the R2 Nord train to Montmeló.', 'Wear plenty of sunscreen, shade is rare.', 'The fan zone has great food at lower prices.']
      },
      Balanced: {
        budgetRange: '€600 - €1,100',
        ticketType: 'Grandstand G or M',
        stayStyle: 'Apartment rental in Eixample',
        tips: ['Book a grandstand near the first corner.', 'Stay for the track invasion at the finish.', 'Enjoy the nightlife in El Born.']
      },
      Premium: {
        budgetRange: '€2,000+',
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

export function QuickPlanner() {
  const [gpIndex, setGpIndex] = useState(1);
  const [budgetIndex, setBudgetIndex] = useState(2);
  const [lengthIndex, setLengthIndex] = useState(3);
  const [styleIndex, setStyleIndex] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const results = useMemo(() => {
    const gpData = PLANNER_DATA[gpIndex];
    const budgetTier = getBudgetName(budgetIndex);
    return {
      gpName: gpData.name,
      ...gpData.tiers[budgetTier]
    };
  }, [gpIndex, budgetIndex]);

  // Derived state hash for animation triggers
  const stateHash = `${gpIndex}-${budgetIndex}-${lengthIndex}-${styleIndex}`;

  return (
    <section id="plan" className="py-24 md:py-32 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border p-10 md:p-16 relative shadow-sm"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Interactive Planner</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tailor Your Weekend</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-16">
            {/* GP Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Grand Prix</label>
                <span className="text-sm font-bold text-accent">{PLANNER_DATA[gpIndex].name}</span>
              </div>
              <input 
                type="range" min="1" max="3" step="1"
                value={gpIndex} onChange={(e) => setGpIndex(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                <span>Monza</span>
                <span>Silverstone</span>
                <span>Barcelona</span>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget Level</label>
                <span className="text-sm font-bold text-accent">{getBudgetName(budgetIndex)}</span>
              </div>
              <input 
                type="range" min="1" max="3" step="1"
                value={budgetIndex} onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                <span>Value</span>
                <span>Balanced</span>
                <span>Premium</span>
              </div>
            </div>

            {/* Length Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trip Length</label>
                <span className="text-sm font-bold text-accent">{lengthIndex} Nights</span>
              </div>
              <input 
                type="range" min="2" max="4" step="1"
                value={lengthIndex} onChange={(e) => setLengthIndex(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                <span>2 Nights</span>
                <span>3 Nights</span>
                <span>4 Nights</span>
              </div>
            </div>

            {/* Style Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Travel Style</label>
                <span className="text-sm font-bold text-accent">{getStyleName(styleIndex)}</span>
              </div>
              <input 
                type="range" min="1" max="3" step="1"
                value={styleIndex} onChange={(e) => setStyleIndex(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                <span>Efficiency</span>
                <span>Comfort</span>
                <span>Experience</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
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
                    <p className="text-5xl font-light text-foreground tracking-tighter">{results.budgetRange}</p>
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
                      The "Full Weekend Plan" provides the precise logistics needed to execute this {results.gpName} trip without the guesswork.
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-16 flex flex-col items-center border-t border-border pt-12">
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
              
              <div className="flex justify-center">
               <motion.button 
                 whileHover={{ scale: 1.02, backgroundColor: '#CC0000', color: '#FFFFFF' }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setIsModalOpen(true)}
                 className="px-10 py-5 border border-border text-foreground text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center gap-3 bg-card"
               >
                 Unlock Full Weekend Plan <ArrowRight className="w-4 h-4" />
               </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultGP={results.gpName} />
    </section>
  );
}
