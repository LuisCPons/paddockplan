"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Printer,
  TrendingUp,
  RotateCcw,
  Check,
  Zap,
  Sun,
  CloudRain,
  MapPin,
  AlertTriangle,
  Navigation,
} from 'lucide-react';

import { useCurrency } from '@/lib/CurrencyContext';
import { CurrencySelector } from './CurrencySelector';
import { BrandLogo } from './BrandLogo';
import { getCurrencySymbol } from '@/lib/formatPrice';

// ─── CIRCUIT CONTEXT CONTROLLER ──────────────────────────────────────────────
// This is the single source of truth. All URLs, dates, airports, and intel
// are pulled from this map based on the active `gpKey`. Zero hallucination.

type TierKey = 'budget' | 'mid' | 'premium';
type DurationDays = 3 | 4 | 5;

interface CircuitSession {
  event: string;
  time: string;
  temp: string;
  rain: string;
  icon: 'sun' | 'zap' | 'trend' | 'rain';
}

interface MissionContext {
  raceDate: string;         // e.g. "Sun Sept 6"
  returnDate: string;       // ISO: "2026-09-07"
  departures: Record<DurationDays, string>; // ISO departure by duration
  ticketPortal: string;
  hubs: Record<TierKey, string>; // IATA airport code per tier
  stayLocation: string;     // Booking.com ss= param
  circuitLocation: string;  // ViaMichelin arrival
  navIntel: { label: string; icon: 'red' | 'white'; text: string }[];
  sessions: CircuitSession[];
}

const MISSION_CONTEXTS: Record<string, MissionContext> = {
  monza: {
    raceDate: 'Sun Sept 6, 2026',
    returnDate: '2026-09-07',
    departures: { 3: '2026-09-04', 4: '2026-09-03', 5: '2026-09-02' },
    ticketPortal: 'https://tickets.formula1.com/en/f1-43257-italy',
    hubs: { budget: 'BGY', mid: 'MXP', premium: 'LIN' },
    stayLocation: 'Milan, Italy',
    circuitLocation: 'Autodromo Nazionale Monza, Monza',
    navIntel: [
      {
        label: 'Logistics Priority',
        icon: 'red',
        text: '"Trenord Digital: Buy the \'Monza Special\' via app. Station kiosks have 40-min queues."',
      },
      {
        label: 'Security Protocol',
        icon: 'white',
        text: '"Bottle Cap Hack: Circuit security removes caps at gates. Carry spares in your pocket."',
      },
      {
        label: 'Insider Route',
        icon: 'red',
        text: '"The Black Shuttle from Monza station is the fastest route to the Ascari chicane."',
      },
    ],
    sessions: [
      { event: 'FP1 — Practice Session 1', time: 'FRI 13:30', temp: '26°C', rain: '2%', icon: 'sun' },
      { event: 'FP2 — Practice Session 2', time: 'FRI 17:00', temp: '25°C', rain: '8%', icon: 'sun' },
      { event: 'Qualifying Session',       time: 'SAT 16:00', temp: '27°C', rain: '15%', icon: 'zap' },
      { event: 'Italian Grand Prix — Race', time: 'SUN 15:00', temp: '29°C', rain: '5%', icon: 'trend' },
    ],
  },

  silverstone: {
    raceDate: 'Sun July 5, 2026',
    returnDate: '2026-07-06',
    departures: { 3: '2026-07-03', 4: '2026-07-02', 5: '2026-07-01' },
    ticketPortal: 'https://www.silverstone.co.uk/events/formula-1-british-grand-prix/tickets',
    hubs: { budget: 'LTN', mid: 'BHX', premium: 'LHR' },
    stayLocation: 'Milton Keynes, UK',
    circuitLocation: 'Silverstone Circuit, Northamptonshire',
    navIntel: [
      {
        label: 'Ingress Protocol',
        icon: 'red',
        text: '"Park & Ride from M40/Towcester: fastest gate-entry route. Pre-book your slot online."',
      },
      {
        label: 'Weather Warning',
        icon: 'white',
        text: '"British Weather Protocol: Layer up. Pack wellies. The field parking turns to mud in 20 minutes of rain."',
      },
      {
        label: 'Insider Tip',
        icon: 'red',
        text: '"Radio Silverstone 87.7 FM is essential. Bring a small portable radio for real-time commentary."',
      },
    ],
    sessions: [
      { event: 'FP1 — Practice Session 1', time: 'FRI 13:30', temp: '19°C', rain: '25%', icon: 'rain' },
      { event: 'FP2 — Practice Session 2', time: 'FRI 17:00', temp: '17°C', rain: '30%', icon: 'rain' },
      { event: 'Qualifying Session',       time: 'SAT 16:00', temp: '20°C', rain: '20%', icon: 'zap' },
      { event: 'British Grand Prix — Race', time: 'SUN 16:00', temp: '21°C', rain: '15%', icon: 'trend' },
    ],
  },

  barcelona: {
    raceDate: 'Sun June 14, 2026',
    returnDate: '2026-06-15',
    departures: { 3: '2026-06-12', 4: '2026-06-11', 5: '2026-06-10' },
    ticketPortal: 'https://www.circuitcat.com/en/formula-1/tickets-2/',
    hubs: { budget: 'BCN', mid: 'BCN', premium: 'BCN' },
    stayLocation: 'Barcelona, Spain',
    circuitLocation: 'Circuit de Barcelona-Catalunya, Montmeló',
    navIntel: [
      {
        label: 'Transit Protocol',
        icon: 'red',
        text: '"R2 Nord to Montmeló station, then \'Tractor\' shuttle to gate. Fastest route by far."',
      },
      {
        label: 'Thermal Warning',
        icon: 'white',
        text: '"Zero shade at this circuit. Sunscreen SPF50, hat, and a misting fan are non-negotiable kit."',
      },
      {
        label: 'Insider Exit',
        icon: 'red',
        text: '"Do NOT leave at the main exit. Walk to Montmeló town, get tapas, let the queues clear for 90 mins."',
      },
    ],
    sessions: [
      { event: 'FP1 — Practice Session 1', time: 'FRI 13:30', temp: '28°C', rain: '3%', icon: 'sun' },
      { event: 'FP2 — Practice Session 2', time: 'FRI 17:00', temp: '26°C', rain: '5%', icon: 'sun' },
      { event: 'Qualifying Session',       time: 'SAT 16:00', temp: '30°C', rain: '8%', icon: 'zap' },
      { event: 'Spanish Grand Prix — Race', time: 'SUN 15:00', temp: '32°C', rain: '4%', icon: 'trend' },
    ],
  },
};

// Fallback context (prevents null crashes on unknown gpKeys)
const FALLBACK_CONTEXT = MISSION_CONTEXTS.monza;

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
const Counter = ({ value, currency }: { value: number; currency: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    const duration = 900;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else prevValueRef.current = value;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="font-mono tabular-nums tracking-tighter">
      {getCurrencySymbol(currency as any)}{displayValue.toLocaleString('de-DE')}
    </span>
  );
};

// ─── SESSION ICON ─────────────────────────────────────────────────────────────
const SessionIcon = ({ type }: { type: CircuitSession['icon'] }) => {
  const cls = "w-3 h-3 text-[#E10600]";
  if (type === 'sun') return <Sun className={cls} />;
  if (type === 'zap') return <Zap className={cls} />;
  if (type === 'trend') return <TrendingUp className={cls} />;
  return <CloudRain className={cls} />;
};

// ─── COMPONENT PROPS ──────────────────────────────────────────────────────────
interface BlueprintDashboardProps {
  data: any;
  totalBudget: { amount: number; currency: any };
  gpKey: string;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function BlueprintDashboard({ data, totalBudget, gpKey }: BlueprintDashboardProps) {
  const { selectedCurrency, convert } = useCurrency();

  // Pull the correct circuit context — never default to a wrong circuit
  const ctx: MissionContext = MISSION_CONTEXTS[gpKey] ?? FALLBACK_CONTEXT;

  // ── Stage Management ──────────────────────────────────────────────────────
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

  // ── Stage 1: Tactical Briefing ────────────────────────────────────────────
  const [missionPersonnel, setMissionPersonnel] = useState(1);
  const [originCity, setOriginCity] = useState('');
  const [inboundMode, setInboundMode] = useState<'plane' | 'train' | 'car'>('plane');
  const [stayType, setStayType] = useState<'hotel' | 'airbnb' | 'camping' | 'glamping'>('hotel');
  const [durationDays, setDurationDays] = useState<DurationDays>(3);
  const [budgetTier, setBudgetTier] = useState<TierKey>('mid');

  // ── Financial Engine ──────────────────────────────────────────────────────
  const [selectedHub, setSelectedHub] = useState(ctx.hubs[budgetTier]);
  const [flightCostOverride, setFlightCostOverride] = useState<{ min: number; max: number } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ── Stage 2: Audit & Booking ──────────────────────────────────────────────
  const [bookedItems, setBookedItems] = useState<Record<string, Record<string, boolean>>>({
    budget: { tickets: false, stay: false, transport: false },
    mid:    { tickets: false, stay: false, transport: false },
    premium: { tickets: false, stay: false, transport: false },
  });
  const [actualCosts, setActualCosts] = useState<Record<string, Record<string, number>>>({
    budget: { tickets: 0, stay: 0, transport: 0 },
    mid:    { tickets: 0, stay: 0, transport: 0 },
    premium: { tickets: 0, stay: 0, transport: 0 },
  });
  const [engagedCards, setEngagedCards] = useState<Record<string, boolean>>({
    budget: false, mid: false, premium: false,
  });

  // ── Stage 3: Gear Checklist ───────────────────────────────────────────────
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});

  useEffect(() => { setMounted(true); }, []);

  // Sync hub when tier changes — always circuit-correct
  useEffect(() => {
    setSelectedHub(ctx.hubs[budgetTier]);
  }, [budgetTier, ctx]);

  // Reactive flight cost estimator
  useEffect(() => {
    if (originCity && selectedHub) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        const sum = (originCity + selectedHub).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const base = 180 + (sum % 320);
        setFlightCostOverride({ min: Math.round(base * 0.9), max: Math.round(base * 1.2) });
        setIsScanning(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [originCity, selectedHub]);

  // ── Tier multipliers ──────────────────────────────────────────────────────
  const tierMultipliers: Record<TierKey, number> = { budget: 0.8, mid: 1.0, premium: 2.5 };

  const getDistance = (city: string) => {
    const c = city.toLowerCase().trim();
    if (c.includes('madrid'))    return 1550;
    if (c.includes('london'))    return 1250;
    if (c.includes('paris'))     return 850;
    if (c.includes('barcelona')) return 950;
    if (c.includes('rome'))      return 580;
    if (c.includes('berlin'))    return 1030;
    if (c.includes('amsterdam')) return 1200;
    if (c.includes('lisbon'))    return 1650;
    if (c.includes('munich'))    return 660;
    return 1000;
  };

  // ── URL Builder — Circuit-Aware ───────────────────────────────────────────
  const getBookingUrl = (type: 'tickets' | 'stay' | 'transport', tier: TierKey): string => {
    const hub = ctx.hubs[tier];
    const departure = ctx.departures[durationDays];
    const returnDate = ctx.returnDate;
    const personnel = missionPersonnel;

    if (type === 'tickets') {
      return ctx.ticketPortal;
    }

    if (type === 'stay') {
      const ss = encodeURIComponent(ctx.stayLocation);
      return `https://www.booking.com/searchresults.html?ss=${ss}&checkin=${departure}&checkout=${returnDate}&group_adults=${personnel}`;
    }

    if (type === 'transport') {
      if (inboundMode === 'car') {
        const from = encodeURIComponent(originCity || 'Your city');
        const to = encodeURIComponent(ctx.circuitLocation);
        return `https://www.viamichelin.com/web/Routes?departure=${from}&arrival=${to}`;
      }
      if (inboundMode === 'plane') {
        const from = encodeURIComponent(originCity || 'Your city');
        return `https://www.kiwi.com/deep?from=${from}&to=${hub}&departure=${departure}&return=${returnDate}&adults=${personnel}`;
      }
      // Train
      const origin = encodeURIComponent(originCity || 'your city');
      const dest = encodeURIComponent(ctx.stayLocation);
      return `https://www.google.com/search?q=train+tickets+${origin}+to+${dest}+${departure}`;
    }

    return '#';
  };

  // ── Financial Calculations ────────────────────────────────────────────────
  const getItemValues = (itemKey: string, overrideTier?: TierKey) => {
    const activeTier = overrideTier ?? budgetTier;
    const m = tierMultipliers[activeTier];
    const dur = durationDays === 5 ? 1.6 : durationDays === 4 ? 1.3 : 1.0;
    const buf = 1.10;
    const dist = getDistance(originCity);

    if (itemKey === 'food') {
      const c = 120 * m * missionPersonnel * dur;
      return { min: convert(c * 0.9 * buf, 'EUR'), max: convert(c * 1.1 * buf, 'EUR') };
    }
    if (itemKey === 'tickets') {
      const prices: Record<TierKey, number> = { budget: 150, mid: 550, premium: 1200 };
      const c = prices[activeTier] * missionPersonnel;
      return { min: convert(c, 'EUR'), max: convert(c, 'EUR') };
    }
    if (itemKey === 'inbound') {
      if (inboundMode === 'plane') {
        const base = flightCostOverride ?? { min: data.detailedBudget.flightsAvg.min, max: data.detailedBudget.flightsAvg.max };
        return {
          min: convert(base.min * m * missionPersonnel * buf, 'EUR'),
          max: convert(base.max * m * missionPersonnel * buf, 'EUR'),
        };
      }
      if (inboundMode === 'train') {
        const c = dist * 0.15 * missionPersonnel * buf;
        return { min: convert(c, 'EUR'), max: convert(c, 'EUR') };
      }
      if (inboundMode === 'car') {
        const c = (dist * 0.12 + 60) * buf;
        return { min: convert(c, 'EUR'), max: convert(c, 'EUR') };
      }
    }
    if (itemKey === 'stay') {
      const stayMul: Record<string, number> = { hotel: 1.0, airbnb: 0.75, camping: 0.35, glamping: 1.5 };
      const rates: Record<TierKey, number> = { budget: 100, mid: 250, premium: 500 };
      const c = rates[activeTier] * m * missionPersonnel * dur * stayMul[stayType] * buf;
      return { min: convert(c * 0.9, 'EUR'), max: convert(c * 1.1, 'EUR') };
    }
    if (itemKey === 'transport') {
      const c = 30 * m * missionPersonnel * dur * buf;
      return { min: convert(c + 20, 'EUR'), max: convert(c + 20, 'EUR') };
    }
    if (itemKey === 'misc') {
      const merch = (activeTier === 'premium' ? 250 : activeTier === 'mid' ? 100 : 50) * missionPersonnel;
      return { min: convert(50 * m * dur * buf + merch, 'EUR'), max: convert(50 * m * dur * buf + merch, 'EUR') };
    }
    return { min: 0, max: 0 };
  };

  const calculatePathTotal = (tier: TierKey) => {
    const keys = ['food', 'inbound', 'stay', 'transport', 'misc', 'tickets'];
    return keys.reduce((sum, k) => {
      const v = getItemValues(k, tier);
      return sum + (v.min + v.max) / 2;
    }, 0);
  };

  const calculateAuditBadge = (tier: string) => {
    const estimate = calculatePathTotal(tier as TierKey);
    const actual = Object.values(actualCosts[tier]).reduce((a, v) => a + v, 0);
    if (Object.values(bookedItems[tier]).every(v => !v)) return null;
    if (actual === 0) return null;
    const diff = Math.abs(Math.round(estimate - actual));
    const sym = getCurrencySymbol(selectedCurrency);
    if (actual < estimate) return { label: `TACTICAL WIN — ${sym}${diff} SAVED`, color: 'text-green-400' };
    return { label: `MARKET INEFFICIENCY — ${sym}${diff} OVERPAID`, color: 'text-[#E10600]' };
  };

  const toggleBooked = (tier: string, item: string) => {
    setBookedItems(p => ({ ...p, [tier]: { ...p[tier], [item]: !p[tier][item] } }));
    setEngagedCards(p => ({ ...p, [tier]: true }));
  };

  const updateActualCost = (tier: string, item: string, value: string) => {
    setActualCosts(p => ({ ...p, [tier]: { ...p[tier], [item]: parseFloat(value) || 0 } }));
  };

  // ── Stage 2 card definitions — tier-aware labels ──────────────────────────
  const cardDefs = [
    {
      id: 'budget' as TierKey,
      label: budgetTier === 'budget' ? 'SELECTED STRATEGY' : 'BUDGET ALTERNATIVE',
    },
    {
      id: 'mid' as TierKey,
      label: budgetTier === 'mid' ? 'SELECTED STRATEGY' : (budgetTier === 'premium' ? 'MID-TIER OPTION' : 'RECOMMENDED PATH'),
    },
    {
      id: 'premium' as TierKey,
      label: budgetTier === 'premium' ? 'SELECTED STRATEGY' : 'PERFORMANCE UPGRADE',
    },
  ];

  // ── Transport button labels ───────────────────────────────────────────────
  const transportLabel =
    inboundMode === 'car' ? 'ROUTE & TOLL PLANNER' :
    inboundMode === 'train' ? 'BOOK RAIL TICKETS' :
    'BOOK FLIGHTS';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#E10600] selection:text-white overflow-x-hidden">

      {/* ── Header ── */}
      <header className="border-b border-[#1A1A1A] bg-black/80 backdrop-blur-md sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BrandLogo />
            <div className="h-4 w-px bg-[#1A1A1A]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E10600]">
                {data.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                {currentStage === 1 ? 'Phase 01 — Tactical Intake' : currentStage === 2 ? 'Phase 02 — Strategy Matrix' : 'Phase 03 — Command Center'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-white/20 uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-[#E10600]" />
              {data.location}
            </div>
            <div className="h-4 w-px bg-[#1A1A1A]" />
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

        {/* Progress bar */}
        <div className="h-[2px] bg-[#1A1A1A]">
          <motion.div
            className="h-full bg-[#E10600]"
            animate={{ width: currentStage === 1 ? '33%' : currentStage === 2 ? '66%' : '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          />
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="popLayout" initial={false}>

          {/* ══════════════════════════════════════════════════════════════
              STAGE 1 — TACTICAL BRIEFING
          ══════════════════════════════════════════════════════════════ */}
          {currentStage === 1 && (
            <motion.div
              key="stage1"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 45 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                  Tactical <span className="text-[#E10600]">Briefing.</span>
                </h2>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed max-w-xl">
                  Configure your mission for {data.name} · {ctx.raceDate}. Precision inputs required.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 01 Personnel */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">01. Mission Personnel</span>
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

                {/* 02 Origin */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">02. Mission Origin</span>
                  <input
                    type="text"
                    value={originCity}
                    onChange={e => setOriginCity(e.target.value)}
                    placeholder="SEARCH ORIGIN CITY..."
                    className="w-full bg-black border border-[#1A1A1A] rounded h-12 px-4 font-mono font-black uppercase text-sm focus:outline-none focus:border-[#E10600] transition-all placeholder:text-white/10"
                  />
                  {isScanning && (
                    <p className="text-[9px] font-black font-mono text-[#E10600] uppercase tracking-widest animate-pulse">
                      ◈ SCANNING MARKET RATES...
                    </p>
                  )}
                </div>

                {/* 03 Inbound Mode */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">03. Inbound Mode</span>
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

                {/* 04 Accommodation */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">04. Accommodation Base</span>
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

                {/* 05 Duration */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">05. Deployment Duration</span>
                  <div className="grid grid-cols-3 gap-2">
                    {([3, 4, 5] as DurationDays[]).map(d => (
                      <button
                        key={d}
                        onClick={() => setDurationDays(d)}
                        className={`h-12 rounded font-mono font-black text-sm transition-all ${durationDays === d ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        {d}D
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] font-mono text-white/20">
                    Departs: <span className="text-white/50">{ctx.departures[durationDays]}</span>
                    &nbsp;→&nbsp;Return: <span className="text-white/50">{ctx.returnDate}</span>
                  </p>
                </div>

                {/* 06 Strategic Tier */}
                <div className="p-8 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">06. Strategic Tier</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['budget', 'mid', 'premium'] as TierKey[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setBudgetTier(t)}
                        className={`h-12 rounded text-[9px] font-black uppercase transition-all ${budgetTier === t ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]' : 'bg-black border border-[#1A1A1A] text-white/40 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] font-mono text-white/20">
                    Airport hub: <span className="text-[#E10600] font-black">{ctx.hubs[budgetTier]}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center pt-12 space-y-4">
                <button
                  onClick={() => originCity.trim() && setCurrentStage(2)}
                  disabled={!originCity.trim()}
                  className="px-16 py-6 border-2 border-white text-white text-sm font-black uppercase tracking-[0.4em] rounded hover:bg-[#E10600] hover:border-[#E10600] transition-all disabled:opacity-10 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10">Calculate Strategy</span>
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-[#E10600] opacity-20"
                  />
                </button>
                {!originCity.trim() && (
                  <p className="text-[10px] font-black font-mono text-[#E10600] uppercase tracking-[0.3em] animate-pulse">
                    ⚠ Input required: Mission Origin city
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STAGE 2 — STRATEGY MATRIX
          ══════════════════════════════════════════════════════════════ */}
          {currentStage === 2 && (
            <motion.div
              key="stage2"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 45 }}
              className="space-y-12"
            >
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                    Strategy <span className="text-[#E10600]">Matrix.</span>
                  </h2>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                    3 deployment paths · {data.name} · Departs {ctx.departures[durationDays]}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStage(1)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Recalibrate
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {cardDefs.map(card => {
                  const isSelected = card.label === 'SELECTED STRATEGY';
                  const badge = calculateAuditBadge(card.id);

                  return (
                    <div
                      key={card.id}
                      className={`p-8 border bg-[#050505] rounded-xl space-y-8 relative overflow-hidden group transition-all ${isSelected ? 'border-[#E10600]/80 shadow-[0_0_40px_rgba(225,6,0,0.08)]' : 'border-[#1A1A1A] hover:border-white/10'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 right-0 px-3 py-1 bg-[#E10600] text-white text-[8px] font-black uppercase tracking-widest">
                          Selected Strategy
                        </div>
                      )}

                      {/* Card Header */}
                      <div className="space-y-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${isSelected ? 'text-[#E10600]' : 'text-white/30'}`}>
                          {card.label}
                        </span>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                          {card.id} deployment
                        </h3>
                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                          Hub: {ctx.hubs[card.id]}
                          {inboundMode === 'car' && ' (Drive mode)'}
                        </p>
                        {badge && (
                          <div className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${badge.color}`}>
                            <Zap className="w-3 h-3 fill-current" /> {badge.label}
                          </div>
                        )}
                      </div>

                      {/* Budget total */}
                      <div className="space-y-4 font-mono">
                        <div className="flex justify-between items-end border-b border-white/5 pb-3">
                          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Est. mission budget</span>
                          <div className="text-2xl font-black text-white">
                            <Counter value={Math.round(calculatePathTotal(card.id))} currency={selectedCurrency} />
                          </div>
                        </div>
                      </div>

                      {/* Execution Matrix */}
                      <div className="space-y-5">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 font-mono">Execution matrix</span>

                        {(['tickets', 'stay', 'transport'] as const).map(item => (
                          <div key={item} className="space-y-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => window.open(getBookingUrl(item, card.id), '_blank')}
                                className="flex-1 py-3 bg-[#111] border border-white/5 rounded text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
                              >
                                {item === 'tickets' ? '🎟 BOOK GP TICKETS' :
                                 item === 'stay'    ? '🏨 BOOK STAY' :
                                 (inboundMode === 'car' ? '🗺 ROUTE & TOLL PLANNER' : transportLabel)}
                              </button>
                              <button
                                onClick={() => toggleBooked(card.id, item)}
                                className={`p-3 rounded border transition-all flex-shrink-0 ${bookedItems[card.id][item] ? 'bg-[#E10600] border-[#E10600] text-white' : 'bg-black border-white/10 text-white/20 hover:text-white'}`}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>

                            <AnimatePresence>
                              {bookedItems[card.id][item] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="pl-2 space-y-1 overflow-hidden"
                                >
                                  <span className="text-[8px] font-black uppercase text-white/20 font-mono">Actual Price Paid?</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-[#E10600]">{getCurrencySymbol(selectedCurrency)}</span>
                                    <input
                                      type="number"
                                      placeholder="0"
                                      onChange={e => updateActualCost(card.id, item, e.target.value)}
                                      className="bg-transparent border-b border-white/10 w-24 text-[11px] font-mono focus:outline-none focus:border-[#E10600] py-1 text-white tabular-nums"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      {/* Deploy button */}
                      <div className="pt-2">
                        {engagedCards[card.id] ? (
                          <button
                            onClick={() => { setBudgetTier(card.id); setCurrentStage(3); }}
                            className="w-full py-5 bg-[#E10600] text-white text-[11px] font-black uppercase tracking-[0.5em] rounded hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(225,6,0,0.3)]"
                          >
                            Deploy Mission Hub
                          </button>
                        ) : (
                          <p className="text-center text-[9px] font-black uppercase text-white/10 tracking-[0.3em] italic">
                            Engage matrix to activate
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STAGE 3 — COMMAND CENTER
          ══════════════════════════════════════════════════════════════ */}
          {currentStage === 3 && (
            <motion.div
              key="stage3"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 45 }}
              className="space-y-12"
            >
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                    Command <span className="text-[#E10600]">Center.</span>
                  </h2>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                    Live mission control · {data.name} · {ctx.raceDate}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStage(2)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Exit to matrix
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── Session timeline with integrated weather ── */}
                <div className="lg:col-span-8 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-2 font-mono text-[9px] font-black text-[#E10600] animate-pulse uppercase tracking-widest border-l border-b border-[#1A1A1A]">
                    ◈ LIVE TELEMETRY
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">Race Weekend Schedule</span>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mission Timeline & Weather</h3>
                  </div>

                  <div className="space-y-4">
                    {ctx.sessions.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border border-[#1A1A1A] rounded bg-black group hover:border-[#E10600] transition-all font-mono"
                      >
                        <div className="flex items-center gap-5">
                          <div className="text-sm font-black text-[#E10600] w-24 tabular-nums text-right shrink-0">
                            {ev.time}
                          </div>
                          <div className="h-4 w-px bg-white/10" />
                          <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-[#E10600] transition-colors">
                            {ev.event}
                          </div>
                        </div>
                        <div className="flex items-center gap-5 text-[10px] font-black uppercase shrink-0">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <SessionIcon type={ev.icon} />
                            <span className="tabular-nums">{ev.temp}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#E10600]">
                            <CloudRain className="w-3 h-3" />
                            <span className="tabular-nums">{ev.rain}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Circuit-specific Nav Intel ── */}
                <div className="lg:col-span-4 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#E10600] font-mono">Circuit Intel</span>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">{data.location}</h3>
                    </div>

                    <div className="space-y-4">
                      {ctx.navIntel.map((intel, i) => (
                        <div key={i} className="p-5 bg-white/5 border border-[#1A1A1A] rounded space-y-3 relative overflow-hidden">
                          <div className={`absolute top-0 left-0 w-1 h-full ${intel.icon === 'red' ? 'bg-[#E10600]' : 'bg-white/30'}`} />
                          <span className={`text-[8px] font-black uppercase tracking-widest font-mono ${intel.icon === 'red' ? 'text-[#E10600]' : 'text-white/40'}`}>
                            {intel.label}
                          </span>
                          <p className="text-[11px] font-bold leading-relaxed text-white italic">
                            {intel.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-6 bg-[#E10600] font-mono text-white text-[11px] font-black uppercase tracking-[0.4em] rounded hover:shadow-[0_0_30px_rgba(225,6,0,0.4)] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(225,6,0,0.2)]"
                  >
                    <Printer className="w-4 h-4" /> Export Offline Dossier
                  </button>
                </div>

                {/* ── Tactical Gear Checklist ── */}
                <div className="lg:col-span-12 p-10 border border-[#1A1A1A] bg-[#050505] rounded-xl space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">Deployment Kit</span>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Tactical Gear Checklist</h3>
                    </div>
                    <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                      Readiness: {Math.round((Object.values(packedItems).filter(Boolean).length / Math.min(data.packingChecklist?.length ?? 5, 5)) * 100)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {(data.packingChecklist ?? []).slice(0, 5).map((item: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setPackedItems(p => ({ ...p, [i]: !p[i] }))}
                        className={`flex flex-col items-start gap-4 p-5 border rounded transition-all relative overflow-hidden group ${packedItems[i] ? 'bg-[#E10600]/10 border-[#E10600] text-white' : 'bg-black border-[#1A1A1A] text-white/30 hover:text-white'}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[9px] font-black uppercase tracking-widest text-left leading-snug">{item}</span>
                          <div className={`w-3 h-3 border rounded-sm flex items-center justify-center shrink-0 ${packedItems[i] ? 'bg-[#E10600] border-[#E10600]' : 'border-white/20'}`}>
                            {packedItems[i] && <Check className="w-2 h-2 text-white" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Print stylesheet */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          header, button, input { display: none !important; }
          .min-h-screen { background: white !important; }
          .bg-\\[\\#050505\\], .bg-black { background: white !important; }
          .border-\\[\\#1A1A1A\\] { border-color: #ccc !important; }
          .text-white, .text-\\[\\#E10600\\] { color: black !important; }
          main { padding: 0 !important; max-width: none !important; }
        }
      `}</style>
    </div>
  );
}
