"use client";

import { use, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BLUEPRINT_DETAILS } from '@/lib/blueprintData';
import { 
  ArrowLeft, 
  Download, 
  Map as MapIcon, 
  Clock, 
  CircleDollarSign, 
  CheckSquare, 
  Lightbulb,
  Printer,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return Object.keys(BLUEPRINT_DETAILS).map((gp) => ({
    gp: gp,
  }));
}

export default function BlueprintPage({ params: paramsPromise }: { params: Promise<{ gp: string }> }) {
  const params = use(paramsPromise);
  const gpKey = params?.gp?.toLowerCase();
  
  if (!gpKey) {
    notFound();
  }

  const data = (BLUEPRINT_DETAILS as any)[gpKey];

  if (!data) {
    notFound();
  }

  // Calculate total budget (average of ranges)
  const calculateTotal = () => {
    const parseRange = (range: string) => {
      const numbers = range.match(/\d+/g);
      if (!numbers) return 0;
      if (numbers.length === 1) return parseInt(numbers[0]);
      return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
    };

    const food = parseRange(data.detailedBudget.foodDaily) * 3; // 3 days
    const transport = parseRange(data.detailedBudget.trackTransport) * 3;
    const flights = parseRange(data.detailedBudget.flightsAvg);
    const misc = parseRange(data.detailedBudget.miscellaneous);

    return Math.round(food + transport + flights + misc);
  };

  const totalBudget = calculateTotal();

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
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-0.5">Premium Blueprint</span>
                <h1 className="text-xl font-extrabold tracking-tighter">Your {data.name} Guide <span className="text-muted-foreground font-light text-sm ml-2">2026 Edition</span></h1>
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
              <a href="#logistics" className="hover:text-accent transition-colors">03. Logistics</a>
              <a href="#checklist" className="hover:text-accent transition-colors">04. Checklist</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 print:space-y-12 print:py-8">
        
        {/* Budget Section */}
        <section id="budget" className="scroll-mt-36">
          <div className="flex items-center gap-3 mb-8">
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

        {/* Stay Section */}
        <section id="stay" className="scroll-mt-36">
          <div className="flex items-center gap-3 mb-8">
            <MapIcon className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Stay Zone Heatmaps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.stayZones.map((zone: any, i: number) => (
              <div key={i} className="flex flex-col border border-border bg-card/30 rounded-2xl overflow-hidden print:border-black">
                <div className="p-6 border-b border-border bg-card/50 print:bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">Option 0{i+1}</span>
                  <h3 className="text-xl font-bold tracking-tight">{zone.neighborhood}</h3>
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
                <div className="p-6 bg-accent/5 border-t border-border flex items-center justify-between print:bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Track Conn.</span>
                  <span className="text-sm font-bold flex items-center gap-2"><Clock className="w-3 h-3" /> {zone.connectionTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Logistics Section */}
        <section id="logistics" className="scroll-mt-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Transport Timeline</h2>
              </div>
              
              <div className="space-y-0 relative border-l border-accent/20 ml-3 print:border-black/20">
                {Object.entries(data.transportTimeline).map(([day, times]: [string, any], i) => (
                  <div key={day} className="relative pl-10 pb-12 last:pb-0">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#E10600] print:border print:border-black" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-2">{day}</span>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Departure</span>
                        <p className="text-2xl font-extrabold tabular-nums tracking-tighter">{times.departure}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Return</span>
                        <p className="text-2xl font-extrabold tabular-nums tracking-tighter">{times.return}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-8">
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

        {/* Checklist Section */}
        <section id="checklist" className="scroll-mt-36 print:page-break-before">
          <div className="flex items-center gap-3 mb-8">
            <CheckSquare className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-extrabold tracking-tighter uppercase">Circuit Packing Checklist</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.packingChecklist.map((item: string, i: number) => (
              <div key={i} className="p-5 border border-border bg-card/30 flex items-start gap-3 hover:bg-card transition-colors group cursor-pointer print:border-black">
                <div className="w-4 h-4 border border-border group-hover:border-accent group-hover:bg-accent/10 transition-all shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium leading-tight text-foreground/70 group-hover:text-foreground">{item}</span>
              </div>
            ))}
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
          body {
            background: white !important;
            color: black !important;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          section {
            page-break-inside: avoid;
            margin-bottom: 2rem !important;
          }
          h2 {
            color: black !important;
            border-bottom: 2px solid #E10600;
            padding-bottom: 0.5rem;
          }
          .bg-card, .bg-card\/30, .bg-card\/50 {
            background: transparent !important;
            border: 1px solid #ddd !important;
          }
          .text-accent, .text-muted-foreground {
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
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
}
