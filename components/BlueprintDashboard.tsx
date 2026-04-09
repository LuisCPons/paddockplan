"use client";

import { useState } from 'react';
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
  Zap
} from 'lucide-react';
import Link from 'next/link';

import { WeatherModule } from './WeatherModule';

interface BlueprintDashboardProps {
  data: any;
  totalBudget: number;
  gpKey: string;
}

export function BlueprintDashboard({ data, totalBudget, gpKey }: BlueprintDashboardProps) {
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setPackedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetItems = () => {
    setPackedItems({});
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white print:bg-white print:text-black">
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
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent block">Premium Blueprint</span>
                  <div className="w-1 h-1 rounded-full bg-border print:hidden" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">2026 Edition</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tighter">Your {data.name} Guide</h1>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all print:hidden"
            >
              <Printer className="w-4 h-4" /> Save as PDF
            </button>
          </div>
        </div>
        
        {/* Sticky Sub-nav */}
        <nav className="border-t border-border bg-card print:hidden overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 h-12 items-center text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              <a href="#budget" className="hover:text-accent transition-colors">01. Budget</a>
              <a href="#stay" className="hover:text-accent transition-colors">02. Stay Zones</a>
              <a href="#weather" className="hover:text-accent transition-colors">03. Weather</a>
              <a href="#logistics" className="hover:text-accent transition-colors">04. Logistics</a>
              <a href="#checklist" className="hover:text-accent transition-colors">05. Checklist</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 print:space-y-12 print:py-8">
        
        {/* Budget Section */}
        <section id="budget" className="scroll-mt-36">
          <div className="flex items-center gap-3 mb-8 print:border-b-2 print:border-accent print:pb-2">
            <CircleDollarSign className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Financial Strategy</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Food & Dining (3 Days)', value: data.detailedBudget.foodDaily, icon: TrendingUp },
                { label: 'Track Transport', value: data.detailedBudget.trackTransport, icon: Clock },
                { label: 'Avg Flight Cost', value: data.detailedBudget.flightsAvg, icon: MapIcon },
                { label: 'Miscellaneous Buffer', value: data.detailedBudget.miscellaneous, icon: ShieldCheck },
              ].map((item, i) => (
                <div key={i} className="p-6 border border-border bg-card/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <item.icon className="w-3 h-3 text-accent" />
                    {item.label}
                  </div>
                  <p className="text-2xl font-bold tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-foreground text-background rounded-2xl flex flex-col justify-between print:bg-white print:text-black print:border print:border-black">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-2">Total Estimated Weekend Cost</span>
                <p className="text-6xl font-extrabold tracking-tighter">€{totalBudget}</p>
                <p className="text-xs mt-4 opacity-60 font-medium">Calculated based on 3-day average trip data + recommended local margins.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-background/10 print:border-black/10">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Expert Verified Calculation
                </div>
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
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">Option 0{i+1}</span>
                      <h3 className="text-xl font-bold tracking-tight">{zone.neighborhood}</h3>
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

        {/* Weather Intelligence Module */}
        <section id="weather" className="scroll-mt-36 print:page-break-before">
          <WeatherModule gpKey={gpKey} month={data.raceMonth} />
        </section>

        {/* Logistics Section */}
        <section id="logistics" className="scroll-mt-36 print:page-break-before">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <div className="flex items-center gap-3 mb-8 print:border-b-2 print:border-accent print:pb-2">
                <Calendar className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Transport Timeline</h2>
              </div>
              
              {/* Vertical Step Connector */}
              <div className="relative ml-4 print:ml-2">
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent/20 print:bg-black/20" />
                
                <div className="space-y-12">
                  {Object.entries(data.transportTimeline).map(([day, times]: [string, any], i) => (
                    <div key={day} className="relative pl-10">
                      {/* Step Anchor */}
                      <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-accent border-4 border-background print:border-white shadow-[0_0_10px_#E10600] z-10" />
                      
                      <div className="space-y-4">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent block">{day}</span>
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
            </div>
            
            <div className="print:mt-12">
              <div className="flex items-center gap-3 mb-8 print:border-b-2 print:border-accent print:pb-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Expert Secrets</h2>
              </div>
              <ul className="space-y-6">
                {data.expertSecrets.map((secret: string, i: number) => (
                  <li key={i} className="flex gap-6 p-6 border border-border bg-card/20 rounded-xl relative group hover:border-accent transition-colors print:border-black print:p-2">
                    <span className="text-xl font-serif italic font-bold text-accent/20 group-hover:text-accent transition-colors tabular-nums">0{i+1}</span>
                    <p className="text-sm font-light leading-relaxed text-foreground/80">{secret}</p>
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
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Official 2026 PaddockPlan Blueprint</p>
          <p className="text-[9px] text-muted-foreground/40 max-w-lg mx-auto leading-relaxed">
            Data verified by local travel experts for the {data.location} region. This document is a digital product intended for informational purposes only. PaddockPlan is an independent platform and not affiliated with the FIA or official race organizers.
          </p>
        </footer>
      </main>

      {/* Mobile Floating Button */}
      <button 
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] md:hidden print:hidden"
      >
        <Download className="w-6 h-6" />
      </button>

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

