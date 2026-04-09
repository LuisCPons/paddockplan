"use client";
import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
};

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Text Block */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 max-w-2xl text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-px bg-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent">The 2026 Collection</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.05] text-foreground font-manrope"
            >
              The Definitive <br className="hidden md:block" />
              Digital <span className="italic font-light text-accent">Blueprint</span> for Grand Prix Fans.
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl font-light leading-relaxed font-inter"
            >
              Move from scattered tabs to a professional 12-page weekend plan in minutes. Independent, expert-backed, and mobile-ready.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 items-start mb-8"
            >
              <Link href="#plan" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-accent text-white px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(225,6,0,0.3)]">
                Generate Blueprint
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#guides" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-transparent border border-border text-foreground px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] hover:border-accent transition-all duration-300">
                View Details
              </Link>
            </motion.div>

            {/* Trust Bar */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60"
            >
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-background bg-zinc-800" />)}
              </div>
              <span>24 Circuits Covered • 2026 Verified Data • Professional Logistics</span>
            </motion.div>
          </motion.div>

          {/* Right Schematic Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full lg:w-auto relative group"
          >
            <div className="relative aspect-square w-full max-w-xl mx-auto lg:ml-auto overflow-hidden bg-[#0A0A0A] border border-border/50 rounded-2xl shadow-2xl">
              {/* Grid Overlay */}
              <div className="absolute inset-0 z-0 opacity-20" style={{ 
                backgroundImage: `linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
              <div className="absolute inset-0 z-0 opacity-10" style={{ 
                backgroundImage: `linear-gradient(#2A2A2A 1px, transparent 1px), linear-gradient(90deg, #2A2A2A 1px, transparent 1px)`,
                backgroundSize: '10px 10px'
              }} />
              
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <CircuitSchematicEngine />
              </div>

              {/* Technical Labels */}
              <div className="absolute top-6 left-6 font-mono text-[8px] uppercase tracking-widest text-accent/40">
                Schematic: Type-26-R <br /> Scale: 1:25000
              </div>
              <div className="absolute bottom-6 right-6 font-mono text-[8px] uppercase tracking-widest text-accent/40">
                Data: Verified 2026 <br /> Status: Ready
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// High-Fidelity Lapping Engine Component
function CircuitSchematicEngine() {
  const [index, setIndex] = useState(0);
  
  // High-Precision Coordinates optimized for provided PNG overlays
  const circuits = [
    { 
      name: 'Monza', 
      image: '/assets/track-monza.png',
      path: "M 10,65 L 85,65 C 95,65 100,60 100,50 L 100,35 C 100,20 90,15 80,15 L 20,15 C 10,15 5,20 5,30 L 5,50 C 5,60 10,65 20,65" 
    },
    { 
      name: 'Silverstone', 
      image: '/assets/track-silverstone.png',
      path: "M 15,45 L 30,15 L 60,15 L 95,45 L 95,75 L 75,95 L 30,95 L 10,75 L 10,60 L 30,45 L 55,45 L 55,60 L 30,60" 
    },
    { 
      name: 'Barcelona', 
      image: '/assets/track-barcelona.png',
      path: "M 20,25 L 85,25 C 95,25 100,35 100,50 L 100,65 C 100,80 90,90 75,90 L 30,90 C 15,90 10,80 10,65 L 10,45 C 10,30 20,20 35,20 L 55,45 L 75,45 L 55,70" 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % circuits.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 1 }}
        className="w-full h-full flex flex-col items-center justify-center gap-12"
      >
        <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
          {/* High-Fidelity Circuit PNG */}
          <motion.img 
            src={circuits[index].image}
            alt={circuits[index].name}
            className="w-full h-full object-contain filter brightness-[1.2] drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          <svg viewBox="0 0 110 110" className="absolute inset-0 w-full h-full pointer-events-none">
             {/* Invisible Motion Guide */}
            <path
              id="f1-track-guide"
              d={circuits[index].path}
              fill="none"
              stroke="none"
            />
            
            {/* The F1 Car Silhouette */}
            <motion.g
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ 
                duration: 2.5, 
                ease: "linear",
                repeat: 0
              }}
              style={{
                offsetPath: `path("${circuits[index].path}")`,
                offsetRotate: "auto 0deg"
              }}
            >
              <image
                href="/assets/f1-car.png"
                width="14"
                height="14"
                x="-7"
                y="-7"
                className="drop-shadow-[0_0_8px_rgba(225,6,0,0.6)]"
              />
            </motion.g>
          </svg>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent font-bold"
          >
            Processing high-fidelity telemetry...
          </motion.div>
          <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
            Circuit: <span className="text-white">{circuits[index].name}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
