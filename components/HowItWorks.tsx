"use client";

import { motion } from 'motion/react';

const STEPS = [
  {
    num: '01',
    title: 'Select GP & Style',
    description: "Use the interactive planner to define your trip's DNA."
  },
  {
    num: '02',
    title: 'Generate Blueprint',
    description: 'Our engine processes local data, transport timelines, and stay zones.'
  },
  {
    num: '03',
    title: 'Unlock Premium Access',
    description: 'Get your 12-page custom PDF with precise logistics and maps.'
  },
  {
    num: '04',
    title: 'Race Weekend',
    description: 'Navigate the circuit like a local with your mobile-ready guide.'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Process</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-6">Designed for Discerning Travelers.</h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {}
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8"
        >
          {STEPS.map((step, i) => (
            <motion.div 
              key={i} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="relative flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="absolute top-0 md:-top-8 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-zinc-100 font-serif italic text-8xl md:text-9xl font-bold -z-10 leading-none select-none">
                {step.num}
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 mt-8 md:mt-12">{step.title}</h3>
              <p className="text-foreground/60 text-sm font-light leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
