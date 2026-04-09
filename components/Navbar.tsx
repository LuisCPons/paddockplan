"use client";

import Link from 'next/link';
import { Flag } from 'lucide-react';
import { useState } from 'react';
import { AccessModal } from './AccessModal';
import { CurrencySelector } from './CurrencySelector';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-foreground flex items-center gap-2 group font-manrope">
              <Flag className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
              <span className="uppercase tracking-[0.2em] text-sm">Paddock<span className="text-accent">Plan</span></span>
            </Link>
            
            <div className="hidden md:flex space-x-12">
              <Link href="#guides" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">GP Guides</Link>
              <Link href="#how-it-works" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">How it Works</Link>
              <Link href="#pricing" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center gap-6">
              <CurrencySelector />
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-accent text-white px-8 py-3 font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
              >
                Access Premium
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
