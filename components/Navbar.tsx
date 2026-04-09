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
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35 25V75M35 25H55C65 25 70 30 70 37.5C70 45 65 50 55 50C45 50 40 55 40 62.5C40 70 45 75 55 75" stroke="#E10600" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span className="font-bold text-xl uppercase tracking-[0.15em] text-foreground">
                Paddock<span className="font-extrabold text-accent">Plan</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-12">
              <Link href="#guides" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">GP Guides</Link>
              <Link href="#how-it-works" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">Tactics</Link>
              <Link href="#race-control" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">Race Control</Link>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-accent text-white px-8 py-3 font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(225,6,0,0.2)]"
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
