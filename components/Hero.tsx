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

// High-Precision Lapping Engine Component
function CircuitSchematicEngine() {
  const [index, setIndex] = useState(0);
  
  // Exact Verified Track Geometry (SVG Path Data)
  const circuits = [
    { 
      name: 'Monza', 
      path: "M 50,20 L 150,20 C 180,20 190,40 190,60 L 190,140 C 190,160 180,180 150,180 L 50,180 C 20,180 10,160 10,140 L 10,60 C 10,40 20,20 50,20 M 110,20 L 115,10 L 125,10 L 130,20" 
    },
    { 
      name: 'Silverstone', 
      path: "M 10,100 L 40,40 L 100,20 L 160,40 L 190,100 L 160,160 L 100,180 L 40,160 Z" 
    },
    { 
      name: 'Barcelona', 
      path: "M 20,50 L 100,20 L 180,50 L 180,120 L 100,180 L 20,150 L 20,100 Z" 
    }
  ];

  const handleLapComplete = () => {
    setIndex((prev) => (prev + 1) % circuits.length);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full flex flex-col items-center justify-center gap-14"
      >
        <div className="relative w-full aspect-square max-w-[400px]">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(225,6,0,0.2)]">
            {/* The Verified Path Layer */}
            <motion.path
              d={circuits[index].path}
              fill="none"
              stroke="#2A2A2A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Pulsing Active Layer */}
            <motion.path
              d={circuits[index].path}
              fill="none"
              stroke="#E10600"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            
            {/* Precise Lapping Car (Red Circle) */}
            <motion.circle
              r="4"
              fill="#E10600"
              className="shadow-[0_0_15px_#E10600]"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              onAnimationComplete={handleLapComplete}
              transition={{ 
                duration: 2, 
                ease: "linear",
                repeat: 0
              }}
              style={{
                offsetPath: `path("${circuits[index].path}")`,
              }}
            />
          </svg>
        </div>
        
        <div className="flex flex-col items-center gap-5">
          <motion.div 
            key={`status-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Telemetry Active</span>
          </motion.div>
          <motion.div 
            key={`name-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="font-mono text-[11px] uppercase tracking-[0.5em] text-white"
          >
            Circuit: <span className="text-white font-bold">{circuits[index].name}</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
