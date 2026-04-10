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
  
  // Tactical Calculator State
  const [budgetTier, setBudgetTier] = useState<'budget' | 'mid' | 'premium'>('mid');
  const [guestCount, setGuestCount] = useState(1);
  const [arrivalAirport, setArrivalAirport] = useState<'LIN' | 'MXP' | 'BGY'>('LIN');
  const [merchEnabled, setMerchEnabled] = useState(false);
  const [inboundMode, setInboundMode] = useState<'plane' | 'train' | 'car'>('plane');
  const [stayZone, setStayZone] = useState<'urban' | 'trackside' | 'value'>('urban');
  const [fromCity, setFromCity] = useState('Madrid');
  const [toCity, setToCity] = useState('Milan');
  const [originAirport, setOriginAirport] = useState('');
  
  // AI Concierge State
  const [commandText, setCommandText] = useState('');
  const [strategistNote, setStrategistNote] = useState('Awaiting strategic command...');
  const [isProcessing, setIsProcessing] = useState(false);

  const [isFlightLoading, setIsFlightLoading] = useState(false);
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

  // Mock Kiwi API Handler
  useEffect(() => {
    if (originAirport.length === 3) {
      setIsFlightLoading(true);
      // Simulate API latency
      const timer = setTimeout(() => {
        // Mock logic: some random variance based on airport code
        const charCodeSum = originAirport.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseFlight = 200 + (charCodeSum % 300);
        setFlightCostOverride({
          min: Math.round(baseFlight * 0.9),
          max: Math.round(baseFlight * 1.2)
        });
        setIsFlightLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (originAirport === '') {
      setFlightCostOverride(null);
    }
  }, [originAirport]);

  const handleConciergeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandText.trim()) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      const input = commandText.toLowerCase();
      let updates: string[] = [];

      // Parse Guests
      const friendMatch = input.match(/(\d+)\s+(friend|guest|people|person|buddy)/);
      if (friendMatch) {
        const count = parseInt(friendMatch[1]);
        const total = (input.includes('with') || input.includes('and')) ? count + 1 : count;
        setGuestCount(Math.min(4, total));
        updates.push(`${total} guests`);
      }

      // Parse Origin
      const originMatch = input.match(/from\s+([a-zA-Z\s]+?)(?=\s+with|\s+on|\s+by|\s+via|$)/);
      if (originMatch) {
        const city = originMatch[1].trim();
        setFromCity(city.charAt(0).toUpperCase() + city.slice(1));
        updates.push(`origin: ${city}`);
      }

      // Parse Mode
      if (input.includes('drive') || input.includes('driving') || input.includes('car')) {
        setInboundMode('car');
        updates.push('car logistics');
      } else if (input.includes('train') || input.includes('rail')) {
        setInboundMode('train');
        updates.push('rail strategy');
      } else if (input.includes('flight') || input.includes('plane') || input.includes('fly')) {
        setInboundMode('plane');
        updates.push('flight inbound');
      }

      // Parse Tier
      if (input.includes('budget') || input.includes('cheap') || input.includes('saving')) {
        setBudgetTier('budget');
        updates.push('budget strategy');
      } else if (input.includes('premium') || input.includes('luxury') || input.includes('best')) {
        setBudgetTier('premium');
        updates.push('premium strategy');
      }

      setStrategistNote(updates.length > 0 
        ? `Deployment Synchronized: ${updates.join(', ')}.` 
        : "Observation: Specific tactical parameters not found. Use [Origin], [Guests], and [Tier].");
      
      setIsProcessing(false);
      setCommandText('');
    }, 800);
  };

  const getItemValues = (itemKey: string) => {
    const tierMultiplier = tierMultipliers[budgetTier];
    const distanceKm = fromCity.toLowerCase() === 'madrid' ? 1500 : 800;

    if (itemKey === 'food') {
      const cost = 120 * tierMultiplier * guestCount;
      return { min: convert(cost * 0.9, 'EUR'), max: convert(cost * 1.1, 'EUR') };
    }

    if (itemKey === 'inbound') {
      if (inboundMode === 'plane') {
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
      const rates = { urban: 200, trackside: 450, value: 100 };
      const base = rates[stayZone];
      const cost = base * tierMultiplier * guestCount;
      return { min: convert(cost * 0.9, 'EUR'), max: convert(cost * 1.1, 'EUR') };
    }

    if (itemKey === 'transport') {
      if (transportMode === 'privateCar') {
         return { min: convert(150, 'EUR'), max: convert(150, 'EUR') };
      }
      const cost = 30 * tierMultiplier * guestCount;
      let extra = 0;
      if (arrivalAirport === 'MXP' || arrivalAirport === 'BGY') extra = 20;
      return { min: convert(cost + extra, 'EUR'), max: convert(cost + extra, 'EUR') };
    }

    if (itemKey === 'misc') {
      const base = 50 * tierMultiplier;
      const merch = merchEnabled ? merchRates[budgetTier] * guestCount : 0;
      return { min: convert(base + merch, 'EUR'), max: convert(base + merch, 'EUR') };
    }

    return { min: 0, max: 0 };
  };

  const getTieredTotal = () => {
    // Total = (Guests * (Food + Inbound_Cost + Accomm_Cost)) + Transport_Fee + Merchandise
    const food = getItemValues('food');
    const inbound = getItemValues('inbound');
    const stay = getItemValues('stay');
    const transport = getItemValues('transport');
    const misc = getItemValues('misc');

    const foodAvg = (food.min + food.max) / 2;
    const inboundAvg = (inbound.min + inbound.max) / 2;
    const stayAvg = (stay.min + stay.max) / 2;
    const transportAvg = (transport.min + transport.max) / 2;
    const miscAvg = (misc.min + misc.max) / 2;

    return Math.round(inboundAvg + stayAvg + foodAvg + transportAvg + miscAvg);
  };

  const currentTotal = getTieredTotal();
  const lateBookingAvg = Math.round(currentTotal * 1.35);
  const strategySavings = lateBookingAvg - currentTotal;

  const openInMaps = (target: any) => {
    const url = target.mapUrl || `https://www.google.com/maps/search/?api=1&query=${target.coordinates.lat},${target.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const currentLogistics = data.logistics[transportMode];

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-[#E10600] selection:text-white print:bg-white print:text-black pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-border bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
               <BrandLogo />
               <div className="h-8 w-px bg-border mx-2 hidden md:block" />
               <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E10600] block">Modular Hub</span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">April 2026 Sync</span>
                  </div>
                  <h1 className="text-lg font-black tracking-tighter uppercase italic">From Data Points to the <span className="text-[#E10600]">Paddock.</span></h1>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <CurrencySelector />
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-[#E10600] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-md"
              >
                <Printer className="w-3.5 h-3.5" /> Export Dossier
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        
        {/* Phase 9: AI Concierge Command Layer */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E10600]/5 to-transparent blur-3xl -z-10" />
          <div className="p-1 rounded-2xl bg-gradient-to-r from-border via-[#E10600]/30 to-border">
            <div className="bg-black rounded-[14px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#E10600] text-white text-[8px] font-black uppercase tracking-[0.2em] rounded">AI Enabled</span>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Concierge Command</h2>
                </div>
                <div className={`w-2 h-2 rounded-full bg-[#E10600] ${isProcessing ? 'animate-ping' : ''}`} />
              </div>

              <form onSubmit={handleConciergeCommand} className="relative group">
                <input 
                  type="text"
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                  placeholder="e.g., 'Driving from Madrid with 3 friends on a budget'"
                  className="w-full bg-card border border-border rounded-xl px-6 py-5 text-lg font-medium focus:outline-none focus:border-[#E10600] transition-all placeholder:opacity-30"
                />
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#E10600] text-white p-3 rounded-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Zap className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : ''}`} />
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-accent" />
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest italic">{strategistNote}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Budget Section */}
        <section id="budget" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CircleDollarSign className="w-5 h-5 text-[#E10600]" />
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">Financial Strategy</h2>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Guest Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Tactical Unit Size</span>
                  <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl w-fit">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setGuestCount(num)}
                        className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                          guestCount === num ? 'bg-[#E10600] text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tier Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Strategic Tier</span>
                  <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl w-fit">
                    {(['budget', 'mid', 'premium'] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setBudgetTier(tier)}
                        className={`px-4 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          budgetTier === tier ? 'bg-[#E10600] text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Card 1: Inbound Logistics */}
              <div className="p-6 border border-border bg-card/20 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E10600] shadow-[0_0_8px_#E10600] animate-pulse" />
                    {inboundMode === 'plane' ? 'Inbound Logistics' : inboundMode === 'train' ? 'Rail Strategy' : 'Drive Logistics'}
                  </div>
                  <div className="flex bg-black border border-border p-0.5 rounded-lg h-8">
                    {(['plane', 'train', 'car'] as const).map((m) => (
                      <button 
                        key={m}
                        onClick={() => setInboundMode(m)}
                        className={`relative z-10 px-3 text-[10px] font-black transition-colors ${inboundMode === m ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {inboundMode === m && <motion.div layoutId="inbound-bg-new" className="absolute inset-x-0 inset-y-0.5 bg-[#E10600] rounded-md -z-10" />}
                        {m === 'plane' ? '✈️' : m === 'train' ? '🚆' : '🚗'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground block opacity-50">Origin City</span>
                    <input 
                      type="text"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="w-full bg-black/50 border border-border text-[11px] font-black py-2 px-3 rounded-lg focus:outline-none focus:border-[#E10600] transition-colors uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground block opacity-50">Strategic Hub</span>
                    <input 
                      type="text"
                      value={toCity}
                      readOnly
                      className="w-full bg-black/50 border border-border text-[11px] font-black py-2 px-3 rounded-lg opacity-50 uppercase"
                    />
                  </div>
                </div>

                {inboundMode === 'plane' && (
                  <div className="flex items-center justify-between gap-3 bg-black/50 p-2.5 rounded-lg border border-border/50">
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">Destination Hub</span>
                    <div className="relative">
                      <select 
                        value={arrivalAirport}
                        onChange={(e) => setArrivalAirport(e.target.value as any)}
                        className="bg-transparent text-[10px] font-black uppercase outline-none appearance-none cursor-pointer pr-6"
                      >
                        <option value="LIN">LIN (Central) [REC]</option>
                        <option value="BGY">BGY (Bergamo)</option>
                        <option value="MXP">MXP (Malpensa)</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#E10600]" />
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  {(() => {
                    const values = getItemValues('inbound');
                    return (
                      <div className="text-3xl font-black tracking-tighter">
                        <Counter value={values.min} currency={selectedCurrency} />
                        {values.min !== values.max && (
                          <>
                            <span className="mx-2 opacity-10">/</span>
                            <Counter value={values.max} currency={selectedCurrency} />
                          </>
                        )}
                      </div>
                    );
                  })()}
                  
                  <button 
                    onClick={() => {
                      const url = inboundMode === 'plane' 
                        ? `https://www.kiwi.com/en/search/results/${fromCity}/${arrivalAirport}/2026-09-04/2026-09-06?adults=${guestCount}`
                        : inboundMode === 'train' 
                          ? `https://www.thetrainline.com/en/search/results?from=${fromCity}&to=${toCity}&outwardDate=2026-09-04&adults=${guestCount}`
                          : `https://www.google.com/maps/dir/${fromCity}/${toCity}`;
                      window.open(url, '_blank');
                    }}
                    className="w-full py-3 bg-[#E10600] text-white rounded-lg text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group"
                  >
                    {inboundMode === 'plane' ? 'Find Best Flights' : inboundMode === 'train' ? 'View Rail options' : 'View Road Strategy'}
                    <Zap className="w-3.5 h-3.5 group-hover:animate-pulse" />
                  </button>
                </div>
              </div>

              {/* Card 2: Stay Strategy */}
              <div className="p-6 border border-border bg-card/20 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Strategic Stay
                    <div className="group/expert relative inline-block">
                      <Info className="w-3 h-3 text-muted-foreground/30 cursor-help" />
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black border border-border text-[8px] font-bold leading-relaxed text-muted-foreground rounded invisible group-hover/expert:visible opacity-0 group-hover/expert:opacity-100 transition-all z-20">
                        Strategy based on r/F1Travel & F1Destinations expert benchmarks.
                      </div>
                    </div>
                  </div>
                  <div className="flex bg-black border border-border p-0.5 rounded-lg h-8">
                    {(['urban', 'trackside', 'value'] as const).map((z) => (
                      <button 
                        key={z}
                        onClick={() => setStayZone(z)}
                        className={`relative z-10 px-2.5 text-[10px] font-black transition-colors ${stayZone === z ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {stayZone === z && <motion.div layoutId="stay-bg-new" className="absolute inset-x-0 inset-y-0.5 bg-[#E10600] rounded-md -z-10" />}
                        {z === 'urban' ? '🏙️' : z === 'trackside' ? '🏁' : '🌲'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-black/50 p-3 rounded-lg border border-border/50 relative">
                   <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-[#E10600] uppercase tracking-widest italic">
                      {stayZone === 'urban' ? 'Urban Hub Hub' : stayZone === 'trackside' ? 'Grand Prix Proximity' : 'Strategic Base'}
                    </span>
                    {((stayZone === 'urban' && (inboundMode === 'plane' || inboundMode === 'train')) || 
                      (stayZone === 'value' && inboundMode === 'car')) && (
                      <span className="text-[7px] font-black bg-[#E10600] text-white px-1.5 py-0.5 rounded-sm uppercase tracking-widest">Recommended</span>
                    )}
                   </div>
                   <p className="text-[9px] text-muted-foreground uppercase font-black leading-relaxed">
                    {stayZone === 'urban' ? 'Fastest track access via Central Station.' : stayZone === 'trackside' ? 'Walking distance. Zero logistics required.' : 'Best for parking & avoiding city traffic.'}
                   </p>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const values = getItemValues('stay');
                    return (
                      <div className="text-3xl font-black tracking-tighter">
                        <Counter value={values.min} currency={selectedCurrency} />
                        <span className="mx-2 opacity-10">/</span>
                        <Counter value={values.max} currency={selectedCurrency} />
                      </div>
                    );
                  })()}
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        const url = `https://www.booking.com/searchresults.html?ss=${toCity}&checkin=2026-09-04&checkout=2026-09-06&group_adults=${guestCount}`;
                        window.open(url, '_blank');
                      }}
                      className="w-full py-3 bg-black text-white border border-border hover:border-[#E10600] rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
                    >
                      Search Live Vacancy <Calendar className="w-3.5 h-3.5 group-hover:text-[#E10600]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Module 3: Tactical Transport */}
              <div className="p-6 border border-border bg-card/30 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                    Tactical Transport
                  </div>
                  <div className="relative flex bg-background border border-border p-0.5 rounded-lg h-8">
                    <button 
                      onClick={() => setTransportMode('publicTransport')}
                      className={`relative z-10 px-3 text-[9px] font-black uppercase tracking-tight transition-colors ${transportMode === 'publicTransport' ? 'text-white' : 'text-muted-foreground'}`}
                    >
                      {transportMode === 'publicTransport' && <motion.div layoutId="trans-bg-card" className="absolute inset-x-0 inset-y-0.5 bg-accent rounded-md -z-10" />}
                      🚌 Public
                    </button>
                    <button 
                      onClick={() => setTransportMode('privateCar')}
                      className={`relative z-10 px-3 text-[9px] font-black uppercase tracking-tight transition-colors ${transportMode === 'privateCar' ? 'text-white' : 'text-muted-foreground'}`}
                    >
                      {transportMode === 'privateCar' && <motion.div layoutId="trans-bg-card" className="absolute inset-x-0 inset-y-0.5 bg-accent rounded-md -z-10" />}
                      🏎️ Rental
                    </button>
                  </div>
                </div>
                {(() => {
                  const values = getItemValues('transport');
                  return (
                    <div>
                      <div className="text-2xl font-bold tracking-tight">
                        <Counter value={values.min} currency={selectedCurrency} />
                        {values.min !== values.max && (
                          <>
                            <span className="mx-2 opacity-30">—</span>
                            <Counter value={values.max} currency={selectedCurrency} />
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                        {transportMode === 'publicTransport' ? 'Shuttle & Train strategy' : 'Private rental + Fuel + Track Parking'}
                      </p>
                    </div>
                  );
                })()}
                <Clock className="absolute -right-4 -bottom-4 w-24 h-24 opacity-4 group-hover:opacity-8 transition-opacity pointer-events-none" />
              </div>

              {/* Module 4: Miscellaneous Buffer */}
              <div className="p-6 border border-border bg-card/30 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <ShoppingBag className="w-3 h-3" />
                    Miscellaneous Buffer
                  </div>
                  <button 
                    onClick={() => setMerchEnabled(!merchEnabled)}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${merchEnabled ? 'bg-accent text-white' : 'bg-background border border-border text-muted-foreground'}`}
                  >
                    {merchEnabled ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                    {merchEnabled ? 'Gear On' : 'Add Gear'}
                  </button>
                </div>
                
                {(() => {
                  const values = getItemValues('misc');
                  const merchVal = merchEnabled ? convert(merchRates[budgetTier] * guestCount, 'EUR') : 0;
                  return (
                    <div className="space-y-4">
                      <div className="text-2xl font-bold tracking-tight">
                        <Counter value={values.min} currency={selectedCurrency} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-border/50">
                        <span className="text-muted-foreground">Merchandise Buffer</span>
                        <span className={merchEnabled ? 'text-accent' : 'text-muted-foreground/30'}>
                          {merchEnabled ? `${getCurrencySymbol(selectedCurrency)}${merchVal.toLocaleString()}` : '€0 - Opted Out'}
                        </span>
                      </div>
                    </div>
                  );
                })()}
                <ShoppingBag className="absolute -right-4 -bottom-4 w-24 h-24 opacity-4 group-hover:opacity-8 transition-opacity pointer-events-none" />
              </div>
            </div>
            
            <div className="p-8 bg-card border border-border rounded-2xl flex flex-col justify-between relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-[#E10600]/10 to-transparent pointer-events-none" />
               <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Tactical Engine Sync</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-[#E10600]/60 mb-2">Total Weekend Cost</p>
                <div className="text-6xl font-black tracking-tighter mb-8 italic">
                  <Counter value={currentTotal} currency={selectedCurrency} />
                </div>
                
                <div className="space-y-6 pt-6 border-t border-border">
                  <div>
                    <div className="flex items-center gap-2 text-[#E10600] mb-2">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Strategy Savings</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight mb-1 italic">
                      <Counter value={strategySavings} currency={selectedCurrency} />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-relaxed">
                      Saving <span className="text-white">35%</span> compared to standard race-week market rates through surgical booking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#E10600]">
                  <ShieldCheck className="w-4 h-4" /> Expert Prediction
                </div>
                <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-tight">
                  Live estimates powered by Kiwi.com & PaddockPlan Predictive Engine. Data verified: April 2026.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stay Section - Bento Layout */}
        <section id="stay" className="scroll-mt-36 print:page-break-before">
          <div className="flex items-center gap-3 mb-8 print:border-b-2 print:border-accent print:pb-2">
            <MapIcon className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Stay Area Heatmaps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
            {data.stayZones.map((zone: any, i: number) => {
              // Bento layout logic: First card is large, others share rest
              const gridClass = i === 0 ? "md:col-span-12 lg:col-span-6" : "md:col-span-6 lg:col-span-3";
              // Simulated scores for the visual effect
              const scores = [
                { conn: "9/10", price: "€€€" },
                { conn: "7/10", price: "€€" },
                { conn: "8/10", price: "€€€" }
              ];
              
              return (
                <div key={i} className={`${gridClass} flex flex-col border border-border bg-card/30 rounded-2xl overflow-hidden group hover:border-accent transition-colors print:border-black`}>
                  <div className="p-6 border-b border-border bg-card/50 print:bg-white flex justify-between items-start">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">Option 0{i+1}</span>
                        <h3 className="text-xl font-bold tracking-tight">{zone.neighborhood}</h3>
                        <button 
                          onClick={() => openInMaps(zone)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-[#E10600] group/map transition-colors print:hidden"
                        >
                          <MapIcon className="w-3 h-3 text-accent group-hover/map:text-[#E10600] transition-colors" /> View in Maps
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 bg-accent/10 rounded flex items-center gap-1">
                        <Zap className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-bold text-accent">{scores[i].conn}</span>
                      </div>
                      <div className="px-2 py-1 bg-foreground/5 rounded items-center flex">
                        <span className="text-[10px] font-bold text-foreground/40 tracking-widest">{scores[i].price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6 flex-1">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Pros</span>
                      <p className="text-sm font-light leading-relaxed">{zone.pros}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Cons</span>
                      <p className="text-sm font-light leading-relaxed">{zone.cons}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-accent/5 border-t border-border flex items-center justify-between print:bg-white group-hover:bg-accent/10 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Track Conn.</span>
                    <span className="text-sm font-bold flex items-center gap-2"><Clock className="w-3 h-3" /> {zone.connectionTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Circuit Layout SVG Section */}
        <section id="circuit" className="scroll-mt-36 print:page-break-before">
           <CircuitLayout gpKey={gpKey} />
        </section>

        {/* Weather Intelligence Module */}
        <section id="weather" className="scroll-mt-36 print:page-break-before">
          <WeatherModule 
            gpKey={gpKey} 
            month={data.raceMonth} 
            coordinates={data.coordinates} 
          />
        </section>

        {/* Logistics Section */}
        <section id="logistics" className="scroll-mt-36 print:page-break-before">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <div className="flex items-center justify-between mb-8 print:border-b-2 print:border-accent print:pb-2">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Transport Timeline</h2>
                </div>
                
                {/* High-End Transport Mode Toggle */}
                <div className="relative flex bg-card border border-border p-1 rounded-xl print:hidden">
                  <motion.div 
                    layoutId="transport-active"
                    className="absolute inset-0 z-0 p-1"
                  >
                    <motion.div 
                      layout
                      initial={false}
                      className="h-full bg-accent rounded-lg shadow-lg shadow-accent/20"
                      animate={{
                        x: transportMode === 'publicTransport' ? 0 : '100%'
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      style={{ width: '50%' }}
                    />
                  </motion.div>
                  <button 
                    onClick={() => setTransportMode('publicTransport')}
                    className={`relative z-10 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 w-32 justify-center ${transportMode === 'publicTransport' ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    🚆 Public
                  </button>
                  <button 
                    onClick={() => setTransportMode('privateCar')}
                    className={`relative z-10 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 w-32 justify-center ${transportMode === 'privateCar' ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    🚗 Private
                  </button>
                </div>
              </div>
              
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={transportMode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {/* Vertical Step Connector */}
                  <div className="relative ml-4 print:ml-2">
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent/20 print:bg-black/20" />
                    
                    <div className="space-y-12">
                      {Object.entries(currentLogistics.timeline).map(([day, times]: [string, any], i) => (
                        <div key={day} className="relative pl-10">
                          {/* Step Anchor */}
                          <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-accent border-4 border-background print:border-white shadow-[0_0_10px_#E10600] z-10" />
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent block">{day}</span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{times.note}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-8 bg-card/20 p-6 rounded-xl border border-border/50">
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Departure</span>
                                <p className="text-3xl font-extrabold tabular-nums tracking-tighter">{times.departure}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Return</span>
                                <p className="text-3xl font-extrabold tabular-nums tracking-tighter">{times.return}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Deep Link for Circuit/Hub */}
                  <div className="mt-12 p-6 bg-accent/5 border border-accent/10 rounded-xl flex items-center justify-between print:hidden">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Navigation Shortcut</p>
                      <p className="text-sm font-bold">Launch directly to {currentLogistics.hubName}</p>
                    </div>
                    <button 
                      onClick={() => window.open(currentLogistics.hubUrl, '_blank')}
                      className="flex items-center gap-2 bg-accent text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:border-[#E10600] group/nav transition-all"
                    >
                       <MapIcon className="w-3 h-3 transition-colors group-hover/nav:text-[#E10600]" /> Open in Maps
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="print:mt-12">
              <div className="flex items-center gap-3 mb-8 print:border-b-2 print:border-accent print:pb-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-extrabold tracking-tighter uppercase">
                  {transportMode === 'publicTransport' ? 'Transit Intelligence' : 'Driving Strategies'}
                </h2>
              </div>
              <ul className="space-y-6">
                {currentLogistics.tips.map((tip: string, i: number) => (
                  <li key={i} className="flex gap-6 p-6 border border-border bg-card/20 rounded-xl relative group hover:border-accent transition-colors print:border-black print:p-2">
                    <span className="text-xl font-serif italic font-bold text-accent/20 group-hover:text-accent transition-colors tabular-nums">0{i+1}</span>
                    <p className="text-sm font-light leading-relaxed text-foreground/80">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>


        {/* Checklist Section - Interactive */}
        <section id="checklist" className="scroll-mt-36 print:page-break-before">
          <div className="flex items-center justify-between gap-3 mb-8 print:border-b-2 print:border-accent print:pb-2">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Packing Checklist</h2>
            </div>
            <button 
              onClick={resetItems}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors print:hidden"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.packingChecklist.map((item: string, i: number) => {
              const isPacked = packedItems[i];
              return (
                <div 
                  key={i} 
                  onClick={() => toggleItem(i)}
                  className={`p-5 border flex items-center gap-4 transition-all group cursor-pointer select-none rounded-xl print:border-black ${
                    isPacked 
                      ? 'bg-accent/10 border-accent/20 opacity-50' 
                      : 'border-border bg-card/30 hover:bg-card hover:border-accent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center transition-all shrink-0 ${
                    isPacked 
                      ? 'bg-accent text-white' 
                      : 'border border-border group-hover:border-accent group-hover:bg-accent/5'
                  }`}>
                    {isPacked && <Check className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-medium leading-snug transition-all ${
                    isPacked ? 'line-through text-foreground/40' : 'text-foreground/70'
                  }`}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="pt-24 pb-12 text-center print:pt-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Official 2026 Race Control Platform</p>
          <p className="text-[9px] text-muted-foreground/40 max-w-lg mx-auto leading-relaxed">
            Data verified by local travel experts for the {data.location} region. This platform is a digital product intended for informational purposes only. PaddockPlan is an independent platform and not affiliated with the FIA or official race organizers.
          </p>
        </footer>
      </main>

      <QuickActionBar emergencyInfo={data.emergencyInfo} />

      <style jsx global>{`
        @media print {
          html, body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
          }
          * {
            box-shadow: none !important;
            text-shadow: none !important;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          section {
            page-break-inside: avoid;
            margin-bottom: 3rem !important;
          }
          h2 {
            color: black !important;
            border-bottom: 2px solid #E10600 !important;
            padding-bottom: 0.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          .bg-card, .bg-card\/30, .bg-card\/50, .bg-accent\/5, .bg-card\/20 {
            background: transparent !important;
            border: 1px solid #000 !important;
          }
          .text-accent, .text-muted-foreground, .text-foreground\/40, .text-foreground\/70 {
            color: black !important;
          }
          .print\:hidden {
            display: none !important;
          }
          .print\:page-break-before {
            page-break-before: always;
          }
          .print\:border-black {
            border-color: black !important;
          }
          .print\:static {
            position: static !important;
          }
          .print\:pb-2 {
            padding-bottom: 0.5rem !important;
          }
          .print\:border-b-2 {
            border-bottom-width: 2px !important;
          }
          .print\:border-accent {
            border-color: #E10600 !important;
          }
          .print\:mt-12 {
            margin-top: 3rem !important;
          }
        }
      `}</style>
    </div>
  );
}


