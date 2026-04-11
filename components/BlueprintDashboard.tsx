"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Map as MapIcon, 
  Clock, 
  CircleDollarSign, 
  CheckSquare, 
  Lightbulb, 
  Printer, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  Download,
  RotateCcw,
  Check,
  Zap,
  PlaneTakeoff,
  Loader2,
  Users,
  Info,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

import { WeatherModule } from './WeatherModule';
import { useCurrency } from '@/lib/CurrencyContext';
import { formatPrice } from '@/lib/formatPrice';
import { CurrencySelector } from './CurrencySelector';
import { CircuitLayout } from './CircuitLayout';
import { QuickActionBar } from './QuickActionBar';
import { BrandLogo } from './BrandLogo';
import { getCurrencySymbol } from '@/lib/formatPrice';

// Animated Counter Component with Mono Font
const Counter = ({ value, currency }: { value: number; currency: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easing = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = Math.floor(start + (end - start) * easing);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span className="font-mono tabular-nums tracking-tighter">{getCurrencySymbol(currency as any)}{displayValue.toLocaleString('de-DE')}</span>;
};

interface BlueprintDashboardProps {
  data: any;
  totalBudget: { amount: number; currency: any };
  gpKey: string;
}

export function BlueprintDashboard({ data, totalBudget, gpKey }: BlueprintDashboardProps) {
  const { selectedCurrency, convert } = useCurrency();
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});
  const [transportMode, setTransportMode] = useState<'publicTransport' | 'privateCar'>('publicTransport');
  
   // Stage Management
   const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
   
   // Tactical Briefing State (Stage 1)
   const [guestCount, setGuestCount] = useState(1);
   const [fromCity, setFromCity] = useState('Madrid');
   const [inboundMode, setInboundMode] = useState<'plane' | 'train' | 'car'>('plane');
   const [stayType, setStayType] = useState<'hotel' | 'airbnb' | 'camping'>('hotel');
   const [durationDays, setDurationDays] = useState<3 | 5>(3);
   const [budgetTier, setBudgetTier] = useState<'budget' | 'mid' | 'premium'>('mid');

   // Comparison & Hub State
   const [selectedHub, setSelectedHub] = useState<'LIN' | 'MXP' | 'BGY'>('LIN');
   const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});
   const [isScanning, setIsScanning] = useState(false);
   const [isCalculating, setIsCalculating] = useState(false);
   const [flightCostOverride, setFlightCostOverride] = useState<{min: number; max: number} | null>(null);
   const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tierMultipliers = {
    budget: 0.8,
    mid: 1.0,
    premium: 2.5
  };

  const merchRates = {
    budget: 50,
    mid: 100,
    premium: 250
  };

  const currentMultiplier = tierMultipliers[budgetTier];

  const gpDate = new Date('2026-09-04');
  const isSurging = mounted && (gpDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24) < 180;

  // Tier-Hub Sync: Automatically select hub based on strategic tier for Stage 1/2 defaults
  useEffect(() => {
    if (budgetTier === 'budget') setSelectedHub('BGY');
    else if (budgetTier === 'mid') setSelectedHub('MXP');
    else if (budgetTier === 'premium') setSelectedHub('LIN');
  }, [budgetTier]);

  // Reactive Price Engine: Fetch whenever origin or hub changes
  useEffect(() => {
    if (fromCity && selectedHub) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        const charCodeSum = (fromCity + selectedHub).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseFlight = 200 + (charCodeSum % 300);
        setFlightCostOverride({
          min: Math.round(baseFlight * 0.9),
          max: Math.round(baseFlight * 1.2)
        });
        setIsScanning(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [fromCity, selectedHub]);

  const toggleItem = (index: number) => {
    setPackedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetItems = () => {
    setPackedItems({});
  };

  const getItemValues = (itemKey: string, overrideTier?: 'budget' | 'mid' | 'premium') => {
    const activeTier = overrideTier || budgetTier;
    const tierMultiplier = tierMultipliers[activeTier];
    const durationMultiplier = durationDays === 5 ? 1.6 : 1.0;
    
    const distanceKm = fromCity.toLowerCase() === 'madrid' ? 1500 : 800;

    if (itemKey === 'food') {
      const cost = 120 * tierMultiplier * guestCount * durationMultiplier;
      return { min: convert(cost * 0.9, 'EUR'), max: convert(cost * 1.1, 'EUR') };
    }

    if (itemKey === 'inbound') {
      if (inboundMode === 'plane') {
        let terminal = selectedHub;
        if (overrideTier === 'budget') terminal = 'BGY';
        if (overrideTier === 'premium') terminal = 'LIN';

        let baseMin = data.detailedBudget.flightsAvg.min;
        let baseMax = data.detailedBudget.flightsAvg.max;
        if (flightCostOverride) {
          baseMin = flightCostOverride.min;
          baseMax = flightCostOverride.max;
        }
        return { 
          min: convert(baseMin * tierMultiplier * guestCount, 'EUR'), 
          max: convert(baseMax * tierMultiplier * guestCount, 'EUR') 
        };
      }
      if (inboundMode === 'train') {
        const cost = distanceKm * 0.15 * guestCount;
        return { min: convert(cost, 'EUR'), max: convert(cost, 'EUR') };
      }
      if (inboundMode === 'car') {
        const cost = (distanceKm * 0.12) + 60;
        return { min: convert(cost, 'EUR'), max: convert(cost, 'EUR') };
      }
    }

    if (itemKey === 'stay') {
      const stayMultipliers = { hotel: 1.0, airbnb: 0.75, camping: 0.25 };
      const stayTypeMultiplier = stayMultipliers[stayType];
      
      const rates = { budget: 100, mid: 250, premium: 500 };
      const base = rates[activeTier];
      const cost = base * tierMultiplier * guestCount * durationMultiplier * stayTypeMultiplier;
      return { min: convert(cost * 0.9, 'EUR'), max: convert(cost * 1.1, 'EUR') };
    }

    if (itemKey === 'transport') {
      const cost = 30 * tierMultiplier * guestCount * durationMultiplier;
      let hub = selectedHub;
      if (overrideTier === 'budget') hub = 'BGY';
      if (overrideTier === 'premium') hub = 'LIN';
      
      let extra = 0;
      if (hub === 'MXP' || hub === 'BGY') extra = 20;
      return { min: convert(cost + extra, 'EUR'), max: convert(cost + extra, 'EUR') };
    }

    if (itemKey === 'misc') {
      const base = 50 * tierMultiplier * durationMultiplier;
      const merch = activeTier === 'premium' ? 250 * guestCount : activeTier === 'mid' ? 100 * guestCount : 50 * guestCount;
      return { min: convert(base + merch, 'EUR'), max: convert(base + merch, 'EUR') };
    }

    return { min: 0, max: 0 };
  };

  const calculatePathTotal = (tier: 'budget' | 'mid' | 'premium') => {
    const keys = ['food', 'inbound', 'stay', 'transport', 'misc'];
    return keys.reduce((total, key) => {
      const val = getItemValues(key, tier);
      return total + ((val.min + val.max) / 2);
    }, 0);
  };

  const currentTotal = getTieredTotal();
  const lateBookingAvg = Math.round(currentTotal * 1.35);
  const strategySavings = lateBookingAvg - currentTotal;

  const openInMaps = (target: any) => {
    const url = target.mapUrl || `https://www.google.com/maps/search/?api=1&query=${target.coordinates.lat},${target.coordinates.lng}`;
    window.open(url, '_blank');
  const currentLogistics = data.logistics[transportMode];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#E10600] selection:text-white overflow-x-hidden">
      {/* Dynamic Header */}
      <header className="border-b border-[#1A1A1A] bg-black/80 backdrop-blur-md sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <BrandLogo />
             <div className="h-4 w-px bg-[#1A1A1A]" />
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E10600]">Tactical Flow</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  {currentStage === 1 ? 'Phase 01: Intake' : currentStage === 2 ? 'Phase 02: Matrix' : 'Phase 03: Command'}
                </span>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <CurrencySelector />
            {currentStage === 3 && (
              <button 
                onClick={() => window.print()}
                className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#E10600] hover:text-white transition-all rounded"
              >
                Export Dossier
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {currentStage === 1 && (
            <motion.div 
              key="stage1"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Tactical <span className="text-[#E10600]">Briefing.</span></h2>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed max-w-xl">
                  Configure your deployment parameters. Precision inputs lead to optimized race weekend strategy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Guests */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">01. Unit Size</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button 
                        key={n}
                        onClick={() => setGuestCount(n)}
                        className={`h-12 rounded font-mono font-black text-sm transition-all ${guestCount === n ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Origin */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">02. Mission Origin</span>
                  <input 
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="ENTER CITY"
                    className="w-full bg-black border border-[#1A1A1A] rounded h-12 px-4 font-mono font-black uppercase text-sm focus:outline-none focus:border-[#E10600] transition-all placeholder:text-white/10"
                  />
                </div>

                {/* Transport */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">03. Inbound Mode</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['plane', 'train', 'car'] as const).map(m => (
                      <button 
                        key={m}
                        onClick={() => setInboundMode(m)}
                        className={`h-12 rounded text-xs font-black uppercase transition-all ${inboundMode === m ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        {m === 'plane' ? '✈️' : m === 'train' ? '🚆' : '🚗'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stay Type */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">04. Accommodation Base</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['hotel', 'airbnb', 'camping'] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => setStayType(t)}
                        className={`h-12 rounded text-[9px] font-black uppercase tracking-tighter transition-all ${stayType === t ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">05. Deployment Duration</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[3, 5].map(d => (
                      <button 
                        key={d}
                        onClick={() => setDurationDays(d as any)}
                        className={`h-12 rounded font-mono font-black text-sm transition-all ${durationDays === d ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        {d} DAYS
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tier */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">06. Strategic Tier</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['budget', 'mid', 'premium'] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => setBudgetTier(t)}
                        className={`h-12 rounded text-[9px] font-black uppercase transition-all ${budgetTier === t ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center pt-12 space-y-6">
                <button 
                  onClick={() => fromCity.trim() && setCurrentStage(2)}
                  disabled={!fromCity.trim()}
                  className="px-16 py-6 bg-white text-black text-sm font-black uppercase tracking-[0.4em] rounded hover:bg-[#E10600] hover:text-white transition-all disabled:opacity-20 relative group"
                >
                  Calculate Strategy
                  <div className="absolute inset-0 border-2 border-white rounded animate-ping pointer-events-none group-hover:border-[#E10600]" />
                </button>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Ready for matrix deployment</p>
              </div>
            </motion.div>
          )}

          {currentStage === 2 && (
             <motion.div 
               key="stage2"
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -100, opacity: 0 }}
               className="space-y-12"
             >
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">Strategy <span className="text-[#E10600]">Matrix.</span></h2>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">3 Optimized paths decoded for {data.name}.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentStage(1)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Recalibrate Mission
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {[
                     { id: 'budget', label: 'Budget Alternative', tier: 'budget', desc: 'Lowest cost entry point.' },
                     { id: 'recommended', label: 'Recommended Path', tier: budgetTier, desc: 'Optimized for selected tier.' },
                     { id: 'performance', label: 'Performance Upgrade', tier: 'premium', desc: 'Maximum track proximity.' }
                   ].map((path) => (
                     <div key={path.id} className={`p-8 border bg-[#050505] rounded-xl space-y-8 relative overflow-hidden group ${path.id === 'recommended' ? 'border-[#E10600]/50 shadow-[0_0_30px_rgba(225,6,0,0.05)]' : 'border-[#1A1A1A]'}`}>
                        {path.id === 'recommended' && <div className="absolute top-0 right-0 px-3 py-1 bg-[#E10600] text-white text-[8px] font-black uppercase tracking-widest">Selected Strategy</div>}
                        
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#E10600]">{path.label}</span>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter">{path.tier} Tier</h3>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{path.desc}</p>
                        </div>

                        <div className="space-y-4 font-mono">
                           <div className="flex justify-between items-end border-b border-white/5 pb-2">
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Total Estimated Budget</span>
                              <div className="text-2xl font-black"><Counter value={Math.round(calculatePathTotal(path.tier as any))} currency={selectedCurrency} /></div>
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-[10px] uppercase">
                                <span className="text-white/30">Inbound Hub</span>
                                <span className="font-black">{path.tier === 'premium' ? 'LIN' : path.tier === 'budget' ? 'BGY' : 'MXP'}</span>
                              </div>
                              <div className="flex justify-between text-[10px] uppercase">
                                <span className="text-white/30">Accommodation</span>
                                <span className="font-black">{stayType}</span>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3 pt-4">
                          <button 
                            onClick={() => {
                              setSelectedHub(path.tier === 'premium' ? 'LIN' : path.tier === 'budget' ? 'BGY' : 'MXP');
                              setBudgetTier(path.tier as any);
                              setCurrentStage(3);
                            }}
                            className={`w-full py-4 rounded text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] ${path.id === 'recommended' ? 'bg-[#E10600] text-white' : 'bg-white text-black'}`}
                          >
                            Deploy {path.label.split(' ')[0]}
                          </button>
                          <button 
                            onClick={() => {
                              const hub = path.tier === 'premium' ? 'LIN' : path.tier === 'budget' ? 'BGY' : 'MXP';
                              const url = inboundMode === 'plane' 
                                ? `https://www.kiwi.com/en/search/results/${fromCity}/${hub}/2026-09-04/2026-09-07?adults=${guestCount}`
                                : `https://www.google.com/maps/dir/${fromCity}/Milan`;
                              window.open(url, '_blank');
                            }}
                            className="w-full py-3 border border-[#1A1A1A] rounded text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white transition-all"
                          >
                            Execute booking
                          </button>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}

          {currentStage === 3 && (
            <motion.div 
              key="stage3"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="space-y-12"
            >
               <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">Command <span className="text-[#E10600]">Center.</span></h2>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Always-on companion for Monza 2026 deployment.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentStage(2)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Exit to Matrix
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   {/* Schedule Countdown */}
                   <div className="lg:col-span-8 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 font-mono font-black text-sm text-[#E10600] animate-pulse">LIVE TELEMETRY</div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Official Schedule</span>
                        <h3 className="text-2xl font-black uppercase italic">Monza 2026 Timeline</h3>
                      </div>
                      
                      <div className="space-y-4">
                         {[
                           { event: 'FP1: Practice Session 1', time: 'FRI 13:30', status: 'Upcoming' },
                           { event: 'F1 Sprint / Quali', time: 'SAT 16:00', status: 'Tactical Window' },
                           { event: 'Grand Prix Race Start', time: 'SUN 15:00', status: 'Main Deployment' }
                         ].map((ev, i) => (
                           <div key={i} className="flex items-center justify-between p-4 border border-[#1A1A1A] rounded bg-black group hover:border-[#E10600] transition-all">
                              <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest">{ev.event}</p>
                                <p className="text-[10px] font-mono text-white/30 uppercase">{ev.status}</p>
                              </div>
                              <div className="text-sm font-mono font-black text-[#E10600]">{ev.time}</div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Weather */}
                   <div className="lg:col-span-4 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#E10600]">Weather Telemetry</span>
                        <WeatherModule />
                      </div>
                      <div className="pt-8 space-y-2">
                         <div className="flex justify-between text-[10px] uppercase font-black">
                            <span className="text-white/30">Track Temp</span>
                            <span>42°C Est.</span>
                         </div>
                         <div className="flex justify-between text-[10px] uppercase font-black">
                            <span className="text-white/30">Rain Risk</span>
                            <span className="text-[#E10600]">High Index (Sept Storms)</span>
                         </div>
                      </div>
                   </div>

                   {/* Last-Mile Logistics */}
                   <div className="lg:col-span-6 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Last-Mile Instructions</span>
                        <h3 className="text-xl font-black uppercase italic">Deployment Navigation</h3>
                      </div>
                      <div className="space-y-4">
                         <div className="p-4 bg-white/5 border border-[#1A1A1A] rounded space-y-2">
                            <span className="text-[9px] font-black text-[#E10600] uppercase tracking-widest">Main Strategy</span>
                            <p className="text-xs font-bold leading-relaxed italic text-white/80">"Take Trenord S8 from Centrale; Arrive at Monza Station; 40m walk to Gate G (Vedano). The Black Shuttle is the fastest route to the Ascari chicane."</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1">
                               <span className="text-[8px] font-black uppercase text-white/20">Station Hub</span>
                               <p className="text-[10px] font-black uppercase">Milano Centrale</p>
                            </div>
                            <div className="space-y-1 text-right">
                               <span className="text-[8px] font-black uppercase text-white/20">Transfer Time</span>
                               <p className="text-[10px] font-black uppercase">~35 Minutes</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Checklist */}
                   <div className="lg:col-span-6 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tactical Gear Checklist</span>
                          <h3 className="text-xl font-black uppercase italic">Personal Kit</h3>
                        </div>
                        <button 
                          onClick={resetItems}
                          className="text-[9px] font-black uppercase text-white/20 hover:text-[#E10600] transition-colors"
                        >Reset Cache</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[180px] overflow-y-auto no-scrollbar pr-2">
                        {data.packingChecklist.map((item: string, i: number) => (
                          <button 
                            key={i}
                            onClick={() => toggleItem(i)}
                            className={`flex items-center gap-3 p-3 border rounded text-[10px] font-bold uppercase transition-all ${packedItems[i] ? 'bg-[#E10600]/10 border-[#E10600] text-white' : 'bg-black border-[#1A1A1A] text-white/30 hover:text-white'}`}
                          >
                             <div className={`w-3 h-3 border rounded flex items-center justify-center ${packedItems[i] ? 'bg-[#E10600] border-[#E10600]' : 'border-white/20'}`}>
                               {packedItems[i] && <Check className="w-2.5 h-2.5 text-white" />}
                             </div>
                             <span className="truncate">{item}</span>
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media print {
          body { background: white !important; color: black !important; }
          header, button, input { display: none !important; }
          .min-h-screen { background: white !important; }
          .bg-[#050505], .bg-black { background: white !important; }
          .border-[#1A1A1A], .border { border-color: black !important; }
          .text-white, .text-[#E10600], .text-white/40 { color: black !important; }
          main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
          .lg:grid-cols-12 { display: block !important; }
          .lg:col-span-8, .lg:col-span-4, .lg:col-span-6 { width: 100% !important; margin-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );


