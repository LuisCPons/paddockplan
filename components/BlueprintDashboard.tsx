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
  ShoppingBag,
  Sun,
  CloudRain
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
  
   // 1. STAGE MANAGEMENT
   const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
   
   // 2. TACTICAL INTAKE STATE (Stage 1)
    const [missionPersonnel, setMissionPersonnel] = useState(1);
    const [originCity, setOriginCity] = useState('');
    const [inboundMode, setInboundMode] = useState<'plane' | 'train' | 'car'>('plane');
    const [stayType, setStayType] = useState<'hotel' | 'airbnb' | 'camping' | 'glamping'>('hotel');
    const [durationDays, setDurationDays] = useState<3 | 4 | 5>(3);
    const [budgetTier, setBudgetTier] = useState<'budget' | 'mid' | 'premium'>('mid');

   // 3. COMPARISON & HUB STATE (Stage 2/3)
   const [selectedHub, setSelectedHub] = useState<'LIN' | 'MXP' | 'BGY'>('LIN');
   const [isScanning, setIsScanning] = useState(false);
   const [flightCostOverride, setFlightCostOverride] = useState<{min: number; max: number} | null>(null);
   const [mounted, setMounted] = useState(false);

   // 4. AUDIT & BOOKING LOGIC (Stage 2)
   const [bookedItems, setBookedItems] = useState<Record<string, Record<string, boolean>>>({
     budget: { tickets: false, stay: false, transport: false },
     mid: { tickets: false, stay: false, transport: false },
     premium: { tickets: false, stay: false, transport: false }
   });
   const [actualCosts, setActualCosts] = useState<Record<string, Record<string, number>>>({
     budget: { tickets: 0, stay: 0, transport: 0 },
     mid: { tickets: 0, stay: 0, transport: 0 },
     premium: { tickets: 0, stay: 0, transport: 0 }
   });
   const [engagedCards, setEngagedCards] = useState<Record<string, boolean>>({
     budget: false, mid: false, premium: false
   });

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
    if (originCity && selectedHub) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        const charCodeSum = (originCity + selectedHub).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseFlight = 200 + (charCodeSum % 300);
        setFlightCostOverride({
          min: Math.round(baseFlight * 0.9),
          max: Math.round(baseFlight * 1.2)
        });
        setIsScanning(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [originCity, selectedHub]);

  const toggleBooked = (tier: string, item: string) => {
    setBookedItems(prev => ({
      ...prev,
      [tier]: { ...prev[tier], [item]: !prev[tier][item] }
    }));
    setEngagedCards(prev => ({ ...prev, [tier]: true }));
  };

  const updateActualCost = (tier: string, item: string, value: string) => {
    const cost = parseFloat(value) || 0;
    setActualCosts(prev => ({
      ...prev,
      [tier]: { ...prev[tier], [item]: cost }
    }));
  };

  const toggleItem = (index: number) => {
    setPackedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

   const getDistance = (city: string) => {
     const c = city.toLowerCase().trim();
     if (c.includes('madrid')) return 1550;
     if (c.includes('london')) return 1250;
     if (c.includes('paris')) return 850;
     if (c.includes('barcelona')) return 950;
     if (c.includes('rome')) return 580;
     if (c.includes('berlin')) return 1030;
     return 1000; // Fallback
   };

   const getBookingUrl = (type: string, tier: string, origin: string) => {
     const personnel = missionPersonnel;
     const hub = tier === 'premium' ? 'LIN' : tier === 'budget' ? 'BGY' : 'MXP';
     const airport = hub;
     
     if (type === 'tickets') return `https://tickets.formula1.com/en/f1-43257-italy`;
     if (type === 'stay') return `https://www.booking.com/search.html?ss=Milan&group_adults=${personnel}&checkin=2026-09-03&checkout=2026-09-07&selected_currency=EUR`;
     if (type === 'transport') {
       if (inboundMode === 'car') return `https://www.viamichelin.com/web/Routes?departure=${encodeURIComponent(origin || 'Madrid')}&arrival=Monza&index=0&vehicle=0&type=0&fuelCost=1.6&allowance=0&corridor=`;
       if (inboundMode === 'plane') return `https://www.kiwi.com/en/search/results/${encodeURIComponent(origin || 'anywhere')}/${airport}/2026-09-03/2026-09-07?adults=${personnel}`;
       return `https://www.google.com/search?q=train+tickets+from+${encodeURIComponent(origin)}+to+Milan+September+2026`;
     }
     return '#';
   };

   const resetItems = () => {
     setPackedItems({});
   };

  const getItemValues = (itemKey: string, overrideTier?: 'budget' | 'mid' | 'premium') => {
    const activeTier = overrideTier || budgetTier;
    const tierMultiplier = tierMultipliers[activeTier];
    const durationMultiplier = durationDays === 5 ? 1.6 : durationDays === 4 ? 1.3 : 1.0;
    const marketBuffer = 1.10; // 10% Market Volatility Buffer
    
    const distanceKm = getDistance(originCity);

    if (itemKey === 'food') {
      const cost = 120 * tierMultiplier * missionPersonnel * durationMultiplier;
      return { min: convert(cost * 0.9 * marketBuffer, 'EUR'), max: convert(cost * 1.1 * marketBuffer, 'EUR') };
    }

    if (itemKey === 'tickets') {
      const ticketPrices = { budget: 150, mid: 550, premium: 1200 }; // GA, Grandstand, VIP (v3.0 specs)
      const cost = ticketPrices[activeTier] * missionPersonnel;
      return { min: convert(cost, 'EUR'), max: convert(cost, 'EUR') };
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
          min: convert(baseMin * tierMultiplier * missionPersonnel * marketBuffer, 'EUR'), 
          max: convert(baseMax * tierMultiplier * missionPersonnel * marketBuffer, 'EUR') 
        };
      }
      if (inboundMode === 'train') {
        const cost = distanceKm * 0.15 * missionPersonnel * marketBuffer;
        return { min: convert(cost, 'EUR'), max: convert(cost, 'EUR') };
      }
      if (inboundMode === 'car') {
        // v3.0 Drive Logic: (Distance * 0.12) + €60 (Tolls)
        const cost = ((distanceKm * 0.12) + 60) * marketBuffer;
        return { min: convert(cost, 'EUR'), max: convert(cost, 'EUR') };
      }
    }

    if (itemKey === 'stay') {
      const stayMultipliers = { hotel: 1.0, airbnb: 0.75, camping: 0.35, glamping: 1.5 };
      const stayTypeMultiplier = stayMultipliers[stayType];
      
      const rates = { budget: 100, mid: 250, premium: 500 };
      const base = rates[activeTier];
      const cost = base * tierMultiplier * missionPersonnel * durationMultiplier * stayTypeMultiplier * marketBuffer;
      return { min: convert(cost * 0.9, 'EUR'), max: convert(cost * 1.1, 'EUR') };
    }

    if (itemKey === 'transport') {
      const cost = 30 * tierMultiplier * missionPersonnel * durationMultiplier * marketBuffer;
      let hub = selectedHub;
      if (overrideTier === 'budget') hub = 'BGY';
      if (overrideTier === 'premium') hub = 'LIN';
      
      let extra = 0;
      if (hub === 'MXP' || hub === 'BGY') extra = 20;
      return { min: convert(cost + extra, 'EUR'), max: convert(cost + extra, 'EUR') };
    }

    if (itemKey === 'misc') {
      const base = 50 * tierMultiplier * durationMultiplier * marketBuffer;
      const merch = (activeTier === 'premium' ? 250 : activeTier === 'mid' ? 100 : 50) * missionPersonnel;
      return { min: convert(base + merch, 'EUR'), max: convert(base + merch, 'EUR') };
    }

    return { min: 0, max: 0 };
  };

  const calculatePathTotal = (tier: 'budget' | 'mid' | 'premium') => {
    const keys = ['food', 'inbound', 'stay', 'transport', 'misc', 'tickets'];
    return keys.reduce((total, key) => {
      const val = getItemValues(key, tier);
      return total + ((val.min + val.max) / 2);
    }, 0);
  };

  const calculateAuditBadge = (tier: string) => {
    const estimate = calculatePathTotal(tier as any);
    const actual = Object.values(actualCosts[tier]).reduce((acc, val) => acc + val, 0);
    const bookedCount = Object.values(bookedItems[tier]).filter(Boolean).length;
    
    if (bookedCount === 0) return null;
    
    // We only audit if at least one item is marked as booked and has an actual cost > 0
    if (actual === 0) return null;

    if (actual < estimate) {
      const diff = Math.round(estimate - actual);
      return { type: 'win', label: `Tactical Win: ${getCurrencySymbol(selectedCurrency)}${diff} Saved`, color: 'text-green-500' };
    } else {
      const diff = Math.round(actual - estimate);
      return { type: 'loss', label: `Market Inefficiency: ${getCurrencySymbol(selectedCurrency)}${diff} Overpaid`, color: 'text-[#E10600]' };
    }
  };

  const currentTotal = calculatePathTotal(budgetTier);
  const lateBookingAvg = Math.round(currentTotal * 1.35);
  const strategySavings = lateBookingAvg - currentTotal;

  const openInMaps = (target: any) => {
    const url = target.mapUrl || `https://www.google.com/maps/search/?api=1&query=${target.coordinates.lat},${target.coordinates.lng}`;
    window.open(url, '_blank');
  };
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
        <AnimatePresence mode="popLayout" initial={false}>
          {currentStage === 1 && (
            <motion.div 
              key="stage1"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 600, damping: 45, mass: 1 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Tactical <span className="text-[#E10600]">Briefing.</span></h2>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed max-w-xl">
                  Configure mission parameters. Precision inputs required for strategy matrix deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personnel */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">01. Mission Personnel</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button 
                        key={n}
                        onClick={() => setMissionPersonnel(n)}
                        className={`h-12 rounded font-mono font-black text-sm transition-all ${missionPersonnel === n ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
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
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="SEARCH ORIGIN CITY..."
                    className="w-full bg-black border border-[#1A1A1A] rounded h-12 px-4 font-mono font-black uppercase text-sm focus:outline-none focus:border-[#E10600] transition-all placeholder:text-white/10"
                  />
                </div>

                {/* Inbound */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">03. Inbound Mode</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['plane', 'train', 'car'] as const).map(m => (
                      <button 
                        key={m}
                        onClick={() => setInboundMode(m)}
                        className={`h-12 rounded text-[9px] font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${inboundMode === m ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        <span>{m === 'plane' ? '✈️' : m === 'train' ? '🚆' : '🚗'}</span>
                        <span className="text-[7px] tracking-widest">{m === 'plane' ? 'FLIGHTS' : m === 'train' ? 'RAIL' : 'DRIVE'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accommodation */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">04. Accommodation Base</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['hotel', 'airbnb', 'camping', 'glamping'] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => setStayType(t)}
                        className={`h-12 rounded text-[9px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${stayType === t ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        <span>{t === 'hotel' ? '🏨' : t === 'airbnb' ? '🏠' : t === 'camping' ? '⛺' : '🎪'}</span>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">05. Deployment Duration</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5].map(d => (
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
                  onClick={() => originCity.trim() && setCurrentStage(2)}
                  disabled={!originCity.trim()}
                  className="px-16 py-6 border-2 border-white text-white text-sm font-black uppercase tracking-[0.4em] rounded hover:bg-[#E10600] hover:border-[#E10600] transition-all disabled:opacity-5 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10">Calculate Strategy</span>
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-[#E10600] opacity-20"
                  />
                </button>
                {!originCity.trim() && <p className="text-[10px] font-black text-[#E10600] uppercase tracking-[0.3em] animate-pulse italic">Input Required: Mission Origin city</p>}
              </div>
            </motion.div>
          )}

          {currentStage === 2 && (
             <motion.div 
               key="stage2"
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               transition={{ type: 'spring', stiffness: 600, damping: 45, mass: 1 }}
               className="space-y-12"
             >
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">Strategy <span className="text-[#E10600]">Matrix.</span></h2>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">3 Comparative paths decoded for {data.name}.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentStage(1)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Recalibrate mission
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {[
                     { id: 'budget', label: budgetTier === 'budget' ? 'SELECTED STRATEGY' : 'BUDGET ALTERNATIVE', tier: 'budget', desc: 'GA (€150) + Camping entry.' },
                     { id: 'mid', label: budgetTier === 'mid' ? 'SELECTED STRATEGY' : 'RECOMMENDED PATH', tier: 'mid', desc: 'Grandstand (€550) + Strategic Stay.' },
                     { id: 'premium', label: budgetTier === 'premium' ? 'SELECTED STRATEGY' : 'PERFORMANCE UPGRADE', tier: 'premium', desc: 'VIP (€1,200) + Elite Proximity.' }
                   ].map((path) => (
                     <div key={path.id} className={`p-8 border bg-[#050505] rounded-xl space-y-8 relative overflow-hidden group ${path.label === 'SELECTED STRATEGY' ? 'border-[#E10600]/80 shadow-[0_0_30px_rgba(225,6,0,0.1)]' : 'border-[#1A1A1A]'}`}>
                        {path.label === 'SELECTED STRATEGY' && <div className="absolute top-0 right-0 px-3 py-1 bg-[#E10600] text-white text-[8px] font-black uppercase tracking-widest">Selected Strategy</div>}
                        
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#E10600]">{path.label}</span>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter">{path.tier} deployment</h3>
                          {calculateAuditBadge(path.tier) && (
                            <div className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${calculateAuditBadge(path.tier)?.color}`}>
                              <Zap className="w-3 h-3 fill-current" /> {calculateAuditBadge(path.tier)?.label}
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 font-mono">
                           <div className="flex justify-between items-end border-b border-white/5 pb-2">
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Est. mission budget</span>
                              <div className="text-2xl font-black"><Counter value={Math.round(calculatePathTotal(path.tier as any))} currency={selectedCurrency} /></div>
                           </div>
                        </div>

                        {/* Booking Matrix v3.1 */}
                        <div className="space-y-6">
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Execution matrix</span>
                          {(['tickets', 'stay', 'transport'] as const).map(item => (
                            <div key={item} className="space-y-3">
                              <div className="flex items-center justify-between gap-4">
                                <button 
                                  onClick={() => window.open(getBookingUrl(item, path.tier, originCity), '_blank')}
                                  className="flex-1 py-3 bg-[#1A1A1A] border border-white/5 rounded text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                                >
                                  {item === 'tickets' ? 'Book GP Tickets' : item === 'stay' ? 'Book Stay' : (inboundMode === 'car' ? 'CALCULATE FUEL & TOLLS' : 'Book Transport')}
                                </button>
                                <button 
                                  onClick={() => toggleBooked(path.tier, item)}
                                  className={`p-3 rounded border transition-all ${bookedItems[path.tier][item] ? 'bg-[#E10600] border-[#E10600] text-white' : 'bg-black border-white/10 text-white/20 hover:text-white'}`}
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                              
                              <AnimatePresence>
                                {bookedItems[path.tier][item] && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pl-2 space-y-1 overflow-hidden"
                                  >
                                    <span className="text-[8px] font-black uppercase text-white/20">Actual Price Paid?</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-mono text-white/40">{getCurrencySymbol(selectedCurrency)}</span>
                                      <input 
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => updateActualCost(path.tier, item, e.target.value)}
                                        className="bg-transparent border-b border-white/10 w-24 text-[11px] font-mono focus:outline-none focus:border-[#E10600] py-1 text-white"
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 space-y-3">
                          {engagedCards[path.tier] ? (
                            <button 
                              onClick={() => {
                                setBudgetTier(path.tier as any);
                                setCurrentStage(3);
                              }}
                              className="w-full py-5 bg-[#E10600] text-white text-[11px] font-black uppercase tracking-[0.5em] rounded hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(225,6,0,0.3)]"
                            >
                              Deploy Mission Hub
                            </button>
                          ) : (
                            <p className="text-center text-[9px] font-black uppercase text-white/10 tracking-[0.3em] italic">Engage matrix to activate</p>
                          )}
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}

          {currentStage === 3 && (
            <motion.div 
              key="stage3"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 600, damping: 45, mass: 1 }}
              className="space-y-12"
            >
               <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">Command <span className="text-[#E10600]">Center.</span></h2>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">Live mission execution for Monza 2026. Telemetry active.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentStage(2)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Exit to matrix
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   {/* Integrated Timeline */}
                   <div className="lg:col-span-8 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 font-mono font-black text-sm text-[#E10600] animate-pulse uppercase tracking-widest">Live Battle Feed</div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Real-time Telemetry</span>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mission Schedule & Weather</h3>
                      </div>
                      
                      <div className="space-y-4">
                         {[
                           { event: 'FP1: Practice Session 1', time: 'FRI 13:30', temp: '26°C', rain: '2%', icon: <Sun className="w-3 h-3 text-[#E10600]" /> },
                           { event: 'FP2: Practice Session 2', time: 'FRI 17:00', temp: '25°C', rain: '8%', icon: <Sun className="w-3 h-3 text-[#E10600]" /> },
                           { event: 'F1 Quali / Sprint Window', time: 'SAT 16:00', temp: '27°C', rain: '15%', icon: <Zap className="w-3 h-3 text-[#E10600]" /> },
                           { event: 'Grand Prix Main Race', time: 'SUN 15:00', temp: '29°C', rain: '5%', icon: <TrendingUp className="w-3 h-3 text-[#E10600]" /> }
                         ].map((ev, i) => (
                           <div key={i} className="flex items-center justify-between p-4 border border-[#1A1A1A] rounded bg-black group hover:border-[#E10600] transition-all font-mono">
                              <div className="flex items-center gap-6">
                                <div className="text-sm font-black text-[#E10600] w-24 tabular-nums text-right">{ev.time}</div>
                                <div className="h-4 w-px bg-white/10" />
                                <div className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-[#E10600] transition-colors">{ev.event}</div>
                              </div>
                              <div className="flex items-center gap-6 text-[10px] font-black uppercase">
                                <div className="flex items-center gap-2 text-white/60">
                                   {ev.icon}
                                   <span className="tabular-nums">{ev.temp}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#E10600]">
                                   <CloudRain className="w-3 h-3" />
                                   <span className="tabular-nums">{ev.rain} RAIN</span>
                                </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Expert Tactical Navigation */}
                   <div className="lg:col-span-4 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-8 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#E10600]">Tactical Intel Notes</span>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter">Monza 2026 Navigation</h3>
                        </div>
                        <div className="space-y-6">
                           <div className="p-5 bg-white/5 border border-[#1A1A1A] rounded space-y-3 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1 h-full bg-[#E10600]" />
                              <span className="text-[8px] font-black uppercase text-[#E10600] tracking-widest">Logistics Priority</span>
                              <p className="text-[11px] font-bold leading-relaxed text-white italic">"Trenord Digital: Buy the 'Monza Special' via app; station kiosks have 40-min lines."</p>
                           </div>
                           <div className="p-5 bg-white/5 border border-[#1A1A1A] rounded space-y-3 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1 h-full bg-white/20" />
                              <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Security Protocol</span>
                              <p className="text-[11px] font-bold leading-relaxed text-white italic">"Security Alert: Spare bottle caps required; security removes caps at gates."</p>
                           </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.print()}
                        className="w-full py-6 bg-[#E10600] font-mono text-white text-[11px] font-black uppercase tracking-[0.4em] rounded hover:shadow-[0_0_30px_rgba(225,6,0,0.4)] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(225,6,0,0.2)]"
                      >
                        <Printer className="w-4 h-4" /> Export Offline Dossier
                      </button>
                   </div>

                   {/* Tactical Gear Checklist */}
                   <div className="lg:col-span-12 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Deployment Kit</span>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Tactical Gear Checklist</h3>
                        </div>
                        <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Readiness: {Math.round((Object.values(packedItems).filter(Boolean).length / 5) * 100)}%</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                          { item: 'Earplugs', note: 'Noise Mitigation' },
                          { item: '20k mAh Powerbank', note: 'Telemetry Link' },
                          { item: 'Poncho', note: 'Precipitation Plan' },
                          { item: 'Comfort Shoes', note: '15km Distance' },
                          { item: 'Sunscreen', note: 'UV Protection' }
                        ].map((obj, i) => (
                          <button 
                            key={i}
                            onClick={() => toggleItem(i)}
                            className={`flex flex-col items-start gap-4 p-5 border rounded transition-all group relative overflow-hidden ${packedItems[i] ? 'bg-[#E10600]/10 border-[#E10600] text-white' : 'bg-black border-[#1A1A1A] text-white/30 hover:text-white'}`}
                          >
                             <div className="flex items-center justify-between w-full">
                               <span className="text-[10px] font-black uppercase tracking-widest">{obj.item}</span>
                               <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${packedItems[i] ? 'bg-[#E10600] border-[#E10600]' : 'border-white/20'}`}>
                                 {packedItems[i] && <Check className="w-2.5 h-2.5 text-white" />}
                               </div>
                             </div>
                             <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic">{obj.note}</span>
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
        .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
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
          .lg:col-span-8, .lg:col-span-4, .lg:col-span-12 { width: 100% !important; margin-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
}

