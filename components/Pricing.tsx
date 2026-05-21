"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { AccessModal } from './AccessModal';
import { useCurrency } from '@/lib/CurrencyContext';
import { formatPrice } from '@/lib/formatPrice';

const TIERS = [
  {
    key: 'free',
    name: 'Quick GP Plan',
    price: { amount: 0, currency: 'EUR' },
    description: 'Essential teaser data to start your weekend planning.',
    features: [
      'Basic Budget Range',
      'General Ticket Advice',
      '3 Surface-level Tips'
    ],
    cta: 'ACCESS TACTICAL HUB',
    popular: false
  },
  {
    key: 'premium',
    name: 'Full Tactical Hub',
    price: { amount: 19, currency: 'EUR' },
    period: 'one-time',
    description: 'The definitive race control platform for your entire trip.',
    features: [
      'Professional Dossier (Offline Export)',
      'Precise Expense Breakdown',
      'Stay Area Heatmaps',
      'Transport Timelines',
      '2026 Season Checklist'
    ],
    cta: 'ACCESS TACTICAL HUB',
    popular: true
  }
];

export function Pricing() {
  const { selectedCurrency, convert } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderPrice = (tier: any) => {
    if (tier.key === 'free') return 'Free';
    
    const convertedAmount = convert(tier.price.amount, tier.price.currency);
    return formatPrice(convertedAmount, selectedCurrency);
  };

  return (
    <>
      <section id="pricing" className="py-24 md:py-32 bg-background border-t border-border overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Execution is Everything.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-light">Choose the depth of planning that fits your journey. Simple data or a professional tactical hub.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {TIERS.map((tier) => (
              <motion.div 
                key={tier.name} 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                whileHover={{ y: -8 }}
                className={`relative flex flex-col p-10 border rounded-2xl transition-all duration-500 bg-card ${tier.popular ? 'border-accent shadow-[0_0_40px_rgba(204,0,0,0.1)] md:scale-105 z-10' : 'border-border hover:border-muted-foreground'}`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-accent text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] rounded-full">
                    Highly Popular for Monza
                  </div>
                )}
                
                <div className="mb-10">
                  <h3 className="text-lg font-bold uppercase tracking-widest mb-4">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-light tracking-tighter text-foreground">{renderPrice(tier)}</span>
                    {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light h-12">{tier.description}</p>
                </div>

                <div className="flex-1 space-y-4 mb-10 border-t border-border pt-8">
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-4">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-accent' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-light text-foreground/80">{feat}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${tier.popular ? 'bg-accent text-white hover:bg-white hover:text-black' : 'bg-transparent text-foreground border border-border hover:border-accent/50 hover:bg-white/5'}`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
