"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

const FAQS = [
  {
    q: 'Do you sell race tickets directly?',
    a: 'We act as a premium concierge. While we do not hold inventory directly, our VIP and Grandstand packages include sourcing tickets through our network of trusted official vendors.'
  },
  {
    q: 'Can you help with flights and accommodation?',
    a: 'Absolutely. Our Paddock Club VIP tier includes full itinerary management, including hotel sourcing and booking.'
  },
  {
    q: 'Which races do you cover?',
    a: 'We currently have in-depth guides and planning services for all 24 races on the modern premier motorsport calendar, from Albert Park to Yas Marina.'
  },
  {
    q: 'Are you affiliated with the official racing series?',
    a: 'No. PaddockPlan is an independent premium travel platform built by fans, for fans. We provide unbiased, independent advice and services.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-background border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Inquiries</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-foreground">Questions?</h2>
        </div>

        <div className="border-t border-zinc-200">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-zinc-200">
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-8 text-left focus:outline-none group"
                >
                  <span className="font-bold text-xl tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{faq.q}</span>
                  <Plus className={`w-5 h-5 text-foreground transition-transform duration-500 ease-out ${isOpen ? 'rotate-45 text-accent' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="pb-8 text-foreground/60 leading-relaxed font-light max-w-3xl">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
