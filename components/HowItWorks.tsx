"use client";

import { motion } from 'motion/react';

const STEPS = [
  {
    num: '01',
    title: 'Select Destination',
    description: 'Explore our catalog of 24 international circuits, from historic street tracks to modern super-speedways.'
  },
  {
    num: '02',
    title: 'Curate Access',
    description: 'Secure premium grandstand seating, paddock club access, or private hospitality.'
  },
  {
    num: '03',
    title: 'Refine Logistics',
    description: 'Our concierge finalizes your bespoke itinerary—flights, luxury transfers, and fine dining.'
  },
  {
    num: '04',
    title: 'The Weekend',
    description: 'Arrive stress-free and experience the pinnacle of motorsport travel.'
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
