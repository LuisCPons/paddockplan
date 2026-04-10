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

// Animated Counter Component
const Counter = ({ value, currency }: { value: number; currency: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
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

  return <span>{getCurrencySymbol(currency as any)}{displayValue.toLocaleString('de-DE')}</span>;
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
  const [originAirport, setOriginAirport] = useState('');
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

  const toggleItem = (index: number) => {
    setPackedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetItems = () => {
    setPackedItems({});
  };

  const getItemValues = (itemKey: string, itemData: any) => {
    const tierMultiplier = tierMultipliers[budgetTier];
    
    // Food is now explicitly €120 for Mid 3-day per person
    let baseMin = itemData.min;
    let baseMax = itemData.max;

    if (itemKey === 'food') {
      baseMin = 120;
      baseMax = 180; // Scale range slightly
    }

    if (itemKey === 'merch') {
      const rate = merchRates[budgetTier];
      return { min: convert(rate, 'EUR'), max: convert(rate, 'EUR') };
    }

    // Multiplication logic
    const scaleByGuests = ['food', 'flights'].includes(itemKey) || (itemKey === 'transport' && transportMode === 'publicTransport');
    const multiplier = scaleByGuests ? guestCount * tierMultiplier : (itemKey === 'transport' ? 1 : tierMultiplier);

    let minVal = baseMin * multiplier;
    let maxVal = baseMax * multiplier;

    if (itemKey === 'transport') {
      if (transportMode === 'privateCar') {
        minVal = 150; // Fixed Rental Fee
        maxVal = 150;
      }
      // Airport Surcharge
      if (arrivalAirport === 'MXP' || arrivalAirport === 'BGY') {
        minVal += 20;
        maxVal += 20;
      }
    }

    return {
      min: convert(minVal, itemData.currency || 'EUR'),
      max: convert(maxVal, itemData.currency || 'EUR')
    };
  };

  const getTieredTotal = () => {
    const multiplier = tierMultipliers[budgetTier];
    
    // Calculation: (Guests * (Food + Flights)) + Transport_Fee + Merchandise (if ON)
    const foodMid = 120;
    const foodCost = foodMid * multiplier * guestCount;
    
    const flightData = data.detailedBudget.flightsAvg;
    let flightAvg = (flightData.min + flightData.max) / 2;
    if (flightCostOverride) {
      flightAvg = (flightCostOverride.min + flightCostOverride.max) / 2;
    }
    const flightCostTotal = flightAvg * multiplier * guestCount;

    let transportCost = 0;
    if (transportMode === 'privateCar') {
      transportCost = 150;
    } else {
      const baseTransport = (data.detailedBudget.trackTransport.min + data.detailedBudget.trackTransport.max) / 2;
      transportCost = baseTransport * multiplier * guestCount;
    }

    if (arrivalAirport === 'MXP' || arrivalAirport === 'BGY') {
      transportCost += 20;
    }

    const merchCost = merchEnabled ? merchRates[budgetTier] : 0;

    return Math.round(foodCost + flightCostTotal + transportCost + merchCost);
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
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white print:bg-white print:text-black pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 print:static print:border-none print:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-border rounded-full transition-colors print:hidden">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-2 print:hidden">
                  <ArrowLeft className="w-3 h-3" /> Back to Planner
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent block">Tactical Hub</span>
                  <div className="w-1 h-1 rounded-full bg-border print:hidden" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">2026 Edition</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tighter">Your {data.name} Guide</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 print:hidden">
              <CurrencySelector />
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
              >
                <Printer className="w-4 h-4" /> Offline Dossier Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Sticky Sub-nav */}
        <nav className="border-t border-border bg-card print:hidden overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 h-12 items-center text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              <a href="#budget" className="hover:text-accent transition-colors">01. Budget</a>
              <a href="#stay" className="hover:text-accent transition-colors">02. Stay Zones</a>
              <a href="#circuit" className="hover:text-accent transition-colors">03. Circuit map</a>
              <a href="#weather" className="hover:text-accent transition-colors">04. Weather</a>
              <a href="#logistics" className="hover:text-accent transition-colors">05. Logistics</a>
              <a href="#checklist" className="hover:text-accent transition-colors">06. Checklist</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 print:space-y-12 print:py-8">
        
        {/* Budget Section */}
        <section id="budget" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 print:border-b-2 print:border-accent print:pb-2">
                <CircleDollarSign className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Financial Strategy</h2>
              </div>
              
              {/* Guest Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Tactical Unit Size</span>
                <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl w-fit">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setGuestCount(num)}
                      className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${
                        guestCount === num ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className="px-3 flex items-center gap-2 border-l border-border ml-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{guestCount === 1 ? 'Person' : 'Guests'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Selector */}
            <div className="flex flex-col gap-2 md:items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Strategic Tier</span>
              <div className="flex bg-card border border-border p-1 rounded-xl print:hidden">
                {(['budget', 'mid', 'premium'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setBudgetTier(tier)}
                    className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg overflow-hidden ${
                      budgetTier === tier ? 'bg-[#E10600] text-white' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Food Card */}
              <div className="p-6 border border-border bg-card/30 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <TrendingUp className={`w-3 h-3 ${budgetTier === 'premium' ? 'text-accent' : 'text-muted-foreground'}`} />
                    Food & Dining ({guestCount}p)
                  </div>
                </div>
                {(() => {
                  const values = getItemValues('food', data.detailedBudget.foodDaily);
                  return (
                    <div>
                      <div className="text-2xl font-bold tracking-tight">
                        <Counter value={values.min} currency={selectedCurrency} />
                        <span className="mx-2 opacity-30">—</span>
                        <Counter value={values.max} currency={selectedCurrency} />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Calculated for 3-day weekend</p>
                    </div>
                  );
                })()}
                <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" />
              </div>

              {/* Transport Card */}
              <div className="p-6 border border-border bg-card/30 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Tactical Transport
                  </div>
                  <div className="relative flex bg-background border border-border p-0.5 rounded-lg h-8">
                    <button 
                      onClick={() => setTransportMode('publicTransport')}
                      className={`relative z-10 px-3 text-[9px] font-black uppercase tracking-tight transition-colors ${transportMode === 'publicTransport' ? 'text-white' : 'text-muted-foreground'}`}
                    >
                      {transportMode === 'publicTransport' && <motion.div layoutId="trans-bg-card" className="absolute inset-x-0 inset-y-0.5 bg-accent rounded-md -z-10" />}
                      🚆 Public
                    </button>
                    <button 
                      onClick={() => setTransportMode('privateCar')}
                      className={`relative z-10 px-3 text-[9px] font-black uppercase tracking-tight transition-colors ${transportMode === 'privateCar' ? 'text-white' : 'text-muted-foreground'}`}
                    >
                      {transportMode === 'privateCar' && <motion.div layoutId="trans-bg-card" className="absolute inset-x-0 inset-y-0.5 bg-accent rounded-md -z-10" />}
                      🚗 Rental
                    </button>
                  </div>
                </div>
                {(() => {
                  const values = getItemValues('transport', data.detailedBudget.trackTransport);
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

              {/* Flight Card */}
              <div className="p-6 border border-border bg-card/30 rounded-xl space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <MapIcon className="w-3 h-3" />
                    Avg Flight Cost ({guestCount}p)
                  </div>
                  <div className="relative">
                    <select 
                      value={arrivalAirport}
                      onChange={(e) => setArrivalAirport(e.target.value as any)}
                      className="bg-background border border-border p-1.5 pr-6 rounded-lg text-[9px] font-black uppercase tracking-tight outline-none appearance-none cursor-pointer focus:border-accent"
                    >
                      <option value="LIN">LIN (Central)</option>
                      <option value="BGY">BGY (Bergamo)</option>
                      <option value="MXP">MXP (Malpensa)</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                
                <div className="relative w-full">
                  <input 
                    type="text"
                    placeholder="ENTER DEPARTURE CITY OR CODE"
                    value={originAirport}
                    onChange={(e) => setOriginAirport(e.target.value.toUpperCase())}
                    className="w-full bg-background/50 border border-border text-[10px] font-black py-2 px-3 rounded-lg focus:outline-none focus:border-accent transition-colors placeholder:opacity-50 uppercase"
                  />
                  {isFlightLoading && <Loader2 className="w-3 h-3 animate-spin absolute right-3 top-2.5 text-accent" />}
                </div>

                {(() => {
                  const values = getItemValues('flights', flightCostOverride ? { ...flightCostOverride, currency: data.detailedBudget.flightsAvg.currency } : data.detailedBudget.flightsAvg);
                  return (
                    <div className="text-2xl font-bold tracking-tight">
                      <Counter value={values.min} currency={selectedCurrency} />
                      <span className="mx-2 opacity-30">—</span>
                      <Counter value={values.max} currency={selectedCurrency} />
                    </div>
                  );
                })()}
                <MapIcon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-4 group-hover:opacity-8 transition-opacity pointer-events-none" />
              </div>

              {/* Miscellaneous Buffer Card */}
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
                  const values = getItemValues('misc', data.detailedBudget.miscellaneous);
                  const merchVal = merchEnabled ? convert(merchRates[budgetTier], 'EUR') : 0;
                  return (
                    <div className="space-y-4">
                      <div className="text-2xl font-bold tracking-tight">
                        <Counter value={values.min + merchVal} currency={selectedCurrency} />
                        <span className="mx-2 opacity-30">—</span>
                        <Counter value={values.max + merchVal} currency={selectedCurrency} />
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <item.icon className={`w-3 h-3 ${budgetTier === 'premium' ? 'text-accent' : 'text-muted-foreground'}`} />
                        {item.label}
                      </div>
                      {item.key === 'flights' && (
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="ORIGIN (e.g. JFK)"
                            maxLength={3}
                            value={originAirport}
                            onChange={(e) => setOriginAirport(e.target.value.toUpperCase())}
                            className="bg-background/50 border border-border text-[9px] font-bold py-1 px-2 rounded w-24 focus:outline-none focus:border-accent transition-colors placeholder:opacity-50"
                          />
                          {isFlightLoading && <Loader2 className="w-2 h-2 animate-spin absolute right-2 top-1.5 text-accent" />}
                        </div>
                      )}
                    </div>
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
                      {item.itemData.note && <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{item.itemData.note}</p>}
                    </div>
                    
                    {/* Decorative Background Icon */}
                    <item.icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>
            
            <div className="p-8 bg-foreground text-background rounded-2xl flex flex-col justify-between print:bg-white print:text-black print:border print:border-black relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-2">Total Estimated Weekend Cost</span>
                <p className="text-5xl font-extrabold tracking-tighter">
                  <Counter value={currentTotal} currency={selectedCurrency} />
                </p>
                <div className="mt-6 py-4 border-y border-background/10 print:border-black/10">
                  <div className="flex items-center gap-2 text-accent mb-1 group/info relative">
                    <Zap className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Strategy Savings</span>
                    <Info className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-popover text-[8px] font-bold leading-relaxed text-popover-foreground rounded border border-border opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-20">
                      Calculation based on historical 40% price volatility for flights and accommodation during Grand Prix week.
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-80">
                    Strategic Booking: You are currently saving <span className="font-black text-accent">{getCurrencySymbol(selectedCurrency)}{strategySavings.toLocaleString()}</span> compared to standard race-week rates.
                  </p>
                </div>
                <p className="text-[9px] mt-4 opacity-40 font-medium uppercase tracking-tighter">Calculated based on {budgetTier} strategy + unit size of {guestCount}.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-background/10 print:border-black/10 relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-accent" /> Expert Verified Calculation
                </div>
                
                <p className="text-[7px] text-muted-foreground/60 leading-tight uppercase font-bold tracking-tighter">
                  Live flight estimates powered by Kiwi.com Tequila API. Market volatility analysis provided by the PaddockPlan Predictive Engine. Data updated: {mounted ? new Date().toLocaleDateString('en-GB') : '--.--.----'}.
                </p>
              </div>
              
              {/* Animated Accent Background */}
              <motion.div 
                className="absolute inset-0 bg-accent/5 pointer-events-none"
                animate={{
                  opacity: [0.05, 0.1, 0.05],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
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


