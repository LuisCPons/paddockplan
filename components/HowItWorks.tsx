"use client";

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Define Your Setup',
    description: "Initialize your profile by defining hardware constraints: total budget, accommodation tier, and weekend trajectory goals."
  },
  {
    num: '02',
    title: 'Engine Analysis',
    description: "Our deterministic engine processes 2026 track data and local logistics nodes to calculate your optimal weekend path."
  },
  {
    num: '03',
    title: 'INITIALIZE THE HUB',
    description: "Instantly deploy your interactive dashboard. Access live telemetry sync, tactical heatmaps, and a mission-critical 12-page PDF Dossier for offline redundancy."
  },
  {
    num: '04',
    title: 'LEAD THE WEEKEND',
    description: "Command the Paddock with surgical precision. Use your mobile-synced hub to navigate logistics and track hospitality like a pro-team strategist."
  }
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24 md:mb-32"
        >
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent mb-6 block">The Logic</span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-6 leading-none font-manrope">
            From Data Points <br className="hidden md:block" /> to the <span className="italic font-light text-accent">Paddock</span>.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Progress Line - Desktop (Horizontal) */}
          <div className="hidden lg:block absolute top-[14px] left-0 w-full h-[1px] bg-white/5 z-0">
            <motion.div 
              style={{ scaleX }}
              className="h-full bg-accent origin-left"
            />
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
              hidden: {}
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-8 relative z-10"
          >
            {STEPS.map((step, i) => (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="group relative flex flex-col items-start"
              >
                {/* Mobile Progress Line (Vertical) */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden absolute left-3 top-8 w-[1px] h-full bg-white/5 -z-10">
                    <motion.div 
                      style={{ scaleY: scrollYProgress }}
                      className="w-full bg-accent origin-top"
                    />
                  </div>
                )}

                <div className="flex flex-col items-start gap-8 w-full">
                  <span className="font-mono text-[10px] md:text-sm font-black text-accent tracking-tighter bg-background pr-4 z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(225,6,0,0.6)]">
                    {step.num}
                  </span>
                  
                  <div className="flex flex-col gap-4 border border-white/5 p-6 md:p-0 md:border-none rounded-xl md:rounded-none bg-white/[0.02] md:bg-transparent transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent/[0.03]">
                    <h3 className="text-xl md:text-lg font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-white">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
