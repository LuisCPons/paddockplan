"use client";

import { motion } from 'motion/react';
import { ShieldCheck, MessageSquareQuote } from 'lucide-react';

const testimonials = [
  {
    quote: "The Monza gate tip alone saved my weekend. I was the first one at the podium run!",
    author: "Mark S.",
    role: "Verified Beta User"
  },
  {
    quote: "Finally, a logistics guide that actually understands how the trains work in Barcelona. Flawless.",
    author: "Elena R.",
    role: "Verified Beta User"
  },
  {
    quote: "I used to spend weeks on different tabs. PaddockPlan did it all in 10 minutes.",
    author: "James D.",
    role: "Verified Beta User"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-card/30 border-t border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-accent/10 px-4 py-1 rounded-full flex items-center gap-2 border border-accent/20">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Social Proof</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase mb-4">Join 250+ fans planning their 2026 season</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed">
            PaddockPlan is currently in closed beta. Here is what our first users are saying about their new race-weekend companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-border bg-card/50 rounded-2xl relative group hover:border-accent transition-all"
            >
              <MessageSquareQuote className="w-8 h-8 text-accent/20 mb-6 group-hover:text-accent/40 transition-colors" />
              <p className="text-lg font-light leading-relaxed mb-8 italic">"{t.quote}"</p>
              <div className="flex items-center gap-4 border-t border-border pt-6">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs uppercase">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">{t.author}</p>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest opacity-80">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
