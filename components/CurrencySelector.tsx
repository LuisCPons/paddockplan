"use client";

import { useCurrency, CurrencyCode } from '@/lib/CurrencyContext';
import { ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-accent transition-all bg-card/50 backdrop-blur-sm"
      >
        <Globe className="w-3.5 h-3.5 text-accent" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest">
          {selectedCurrency} ({options.find(o => o.code === selectedCurrency)?.symbol})
        </span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 bg-card border border-border shadow-xl z-[100] overflow-hidden rounded-lg"
          >
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => {
                  setSelectedCurrency(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors ${selectedCurrency === opt.code ? 'text-accent' : 'text-foreground'}`}
              >
                <span>{opt.label}</span>
                <span className="opacity-60">{opt.symbol}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
