"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Coffee, Utensils, Construction } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  tip: string;
  icon: any;
}

const MONZA_HOTSPOTS: Hotspot[] = [
  { id: 'gate4', x: 280, y: 320, label: 'Gate 4 (Vedano)', tip: 'Critical gate for the podium dash. Be here 5 laps early.', icon: Construction },
  { id: 'food', x: 180, y: 150, label: 'Local Panino Stand', tip: 'Legendary local food, much better than track catering.', icon: Utensils },
  { id: 'coffee', x: 350, y: 220, label: 'Pit Entrance Cafe', tip: 'Great spot for driver sightings during morning arrival.', icon: Coffee },
  { id: 'view', x: 80, y: 280, label: 'GA Sweet Spot', tip: 'Internal side of Serraglio. Best sightlines for non-grandstand.', icon: Info },
];

export function CircuitLayout({ gpKey }: { gpKey: string }) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  if (gpKey.toLowerCase() !== 'monza') {
    return (
      <div className="p-12 border border-border bg-card/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground">
          <Construction className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Layout Under Verification</h4>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2">Interactive layouts for Silverstone and Barcelona are being verified for 2026 gate changes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 border border-border bg-card/30 rounded-2xl space-y-8 relative overflow-hidden group hover:border-accent transition-colors print:border-black">
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Interactive Map</span>
          <h3 className="text-xl font-bold tracking-tight uppercase">Circuit Strategy</h3>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full max-w-xl mx-auto">
        {/* Monza Circuit SVG - Stylized Path */}
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_30px_rgba(225,6,0,0.1)]">
          <path
            d="M 300 100 L 350 150 L 370 250 L 250 350 L 150 370 L 50 350 L 30 250 L 50 150 L 150 50 Z" 
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted-foreground/20"
          />
          <path
            d="M 300 100 L 350 150 L 370 250 L 250 350 L 150 370 L 50 350 L 30 250 L 50 150 L 150 50 Z" 
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-accent/60"
            strokeDasharray="1000"
            strokeDashoffset="1000"
          >
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="2s" fill="freeze" />
          </path>

          {/* Hotspots */}
          {MONZA_HOTSPOTS.map((hs) => (
            <g 
              key={hs.id} 
              className="cursor-pointer"
              onMouseEnter={() => setActiveHotspot(hs)}
              onMouseLeave={() => setActiveHotspot(hs)}
              onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
            >
              <circle
                cx={hs.x}
                cy={hs.y}
                r="12"
                className={`transition-all duration-300 ${activeHotspot?.id === hs.id ? 'fill-accent' : 'fill-background stroke-accent'}`}
                strokeWidth="2"
              />
              <circle
                cx={hs.x}
                cy={hs.y}
                r="12"
                className="fill-accent animate-ping opacity-20"
              />
              <hs.icon 
                x={hs.x - 6}
                y={hs.y - 6}
                width="12"
                height="12"
                className={activeHotspot?.id === hs.id ? 'text-white' : 'text-accent'}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip Card */}
        <AnimatePresence>
          {activeHotspot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-4 inset-x-4 bg-background border border-accent/20 p-5 rounded-xl shadow-2xl z-20"
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <activeHotspot.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-accent">{activeHotspot.label}</h5>
                  <p className="text-xs font-medium leading-relaxed text-foreground/80">{activeHotspot.tip}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-6 border-t border-border">
        <p className="text-[10px] text-muted-foreground italic font-light leading-relaxed">
          Tap the pulsers on the circuit layout to unlock localized track-side secrets.
        </p>
      </div>
    </div>
  );
}
