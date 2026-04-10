"use client";

import Link from 'next/link';
import { Flag } from 'lucide-react';
import { useState } from 'react';
import { AccessModal } from './AccessModal';
import { BrandLogo } from './BrandLogo';
import { CurrencySelector } from './CurrencySelector';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrandLogo showTagline={false} size="sm" className="items-start" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-12">
              <Link href="#guides" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-white transition-colors">GP Guides</Link>
              <Link href="#how-it-works" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-white transition-colors">Tactics</Link>
              <Link href="#race-control" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">RACE CONTROL</Link>
            </div>

            <div className="flex items-center gap-10">
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-accent text-white px-8 py-3.5 font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_24px_rgba(225,6,0,0.25)] border border-[#E10600]/30"
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
