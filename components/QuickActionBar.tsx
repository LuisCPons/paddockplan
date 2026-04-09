"use client";

import { motion, AnimatePresence } from 'motion/react';
import { Phone, Wifi, FileText, X } from 'lucide-react';
import { useState } from 'react';

interface QuickActionBarProps {
  emergencyInfo: {
    contact: string;
    wifi: string;
    guideUrl: string;
  };
}

export function QuickActionBar({ emergencyInfo }: QuickActionBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] md:hidden print:hidden">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-card border-t border-border p-6 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-3xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Emergency Info Bar</h4>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-6">
              <a 
                href={`tel:${emergencyInfo.contact}`}
                className="flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-2xl group active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Emergency Number</p>
                  <p className="text-lg font-bold">{emergencyInfo.contact}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-foreground">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Circuit Wi-Fi</p>
                  <p className="text-lg font-bold">{emergencyInfo.wifi}</p>
                </div>
              </div>

              <a 
                href={emergencyInfo.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-foreground text-background rounded-2xl group active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Official Race Guide</p>
                  <p className="text-lg font-bold">Download 128-Page PDF</p>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-border flex items-center justify-between gap-4">
        {!isExpanded ? (
          <>
            <button 
              onClick={() => setIsExpanded(true)}
              className="flex-1 bg-accent text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(225,6,0,0.3)]"
            >
              Open Track-Side Toolkit
            </button>
            <a 
              href={`tel:${emergencyInfo.contact}`}
              className="w-14 h-14 bg-card border border-border rounded-xl flex items-center justify-center"
            >
              <Phone className="w-6 h-6 text-accent" />
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
