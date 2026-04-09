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
  
  // Authentic Track Geometry (Verification Level: High)
  const circuits = [
    { 
      name: 'Monza', 
      path: "M419.3,301.7c-22,0-193.8,0-199,0c-5.3,0-4.4-3.3-4.4-5s0.5-5.8-1.9-5.8s-4.8,0.7-7.9,2c-3.1,1.3-16.5,7.8-38.3,9.1c-11.5,0.7-31.2,0.9-47.2-7.2c-22.4-11.4-38.2-36.5-41.6-59.3c-1.6-10.4-13-81.5-13.6-84c-0.6-2.5-1.8-3.7-4.5-3.8c-2.8-0.1-6.1-0.7-6.9-6.4s-2-10.7-5.1-16.7c-3.1-6-15.2-35.9-17.3-40.2s-4.2-19.6,10-22.5c14.2-2.9,46.5-8.8,50.8-9.4c4.2-0.6,8.3-0.6,12,5.1s27.5,41.1,31.6,48c4.1,6.9,16.7,22.4,31.3,37.2c14.6,14.8,81.5,78.9,83.9,81.2s3.8,5.7,10.8,3.7c7-2,11.3-2.8,18.3,0.1c7,2.9,9.4,7,11.1,8.8c1.8,1.8,3.7,3.5,7,3.5s202.8,4.1,210.1,4.2c7.3,0.1,16.7,6.9,16.7,17.3c0,10.4-6.4,22-17.1,27.8c-18.7,10.2-47.4,12.4-71.1,12.4C424.7,301.7,419.3,301.7,419.3,301.7z" 
    },
    { 
      name: 'Silverstone', 
      path: "M 140,180 L 170,175 L 185,190 L 175,150 L 195,110 L 170,70 L 140,50 L 100,20 L 60,30 L 20,70 L 30,120 L 10,160 L 60,170 Z" 
    },
    { 
      name: 'Barcelona', 
      path: "M 40,180 L 160,180 L 185,150 C 195,130 185,90 160,70 L 100,50 L 80,15 L 40,40 L 20,90 L 25,140 Z" 
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
        <div className="relative w-full aspect-[550/443.7] max-w-[500px]">
          <svg viewBox="0 0 550 443.7" className="w-full h-full drop-shadow-[0_0_40px_rgba(225,6,0,0.2)]">
            {/* The Authentic Path Layer */}
            <motion.path
              d={circuits[index].path}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Pulsing Tactical Layer */}
            <motion.path
              d={circuits[index].path}
              fill="none"
              stroke="#E10600"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="opacity-40"
            />
            
            {/* Telemetry Pointer (Red Dot) */}
            <motion.circle
              r="6"
              fill="#E10600"
              className="shadow-[0_0_15px_#E10600]"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              onAnimationComplete={handleLapComplete}
              transition={{ 
                duration: 2.5, 
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
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#E10600]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.6em] text-accent font-bold">Telemetry Live</span>
          </motion.div>
          <motion.div 
            key={`name-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="font-mono text-[12px] uppercase tracking-[0.7em] text-white"
          >
            Data: <span className="text-white font-black">{circuits[index].name} Verified 2026</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
