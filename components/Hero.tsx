"use client";

import { motion } from 'motion/react';
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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
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
              className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.05] text-foreground"
            >
              Redefining <br className="hidden md:block" />
              The <span className="font-serif italic font-light text-foreground/80">Race</span> Weekend.
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-foreground/60 mb-10 max-w-xl font-light leading-relaxed"
            >
              Curated itineraries, paddock access, and local secrets for the modern motorsport enthusiast. Elevate your Grand Prix experience.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 items-start"
            >
              <Link href="#plan" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-accent transition-colors duration-300">
                Plan Your Trip
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#guides" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-transparent border border-zinc-300 text-foreground px-8 py-4 font-bold text-sm uppercase tracking-widest hover:border-foreground transition-colors duration-300">
                GP Guides
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full lg:w-auto"
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-lg mx-auto lg:ml-auto group">
              <div className="absolute inset-0 bg-accent/10 translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1542382103-6058e5ec2ad0?q=80&w=1200&auto=format&fit=crop" 
                alt="Motorsport luxury travel"
                className="relative z-10 w-full h-full object-cover filter contrast-[1.05] grayscale-[20%]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
