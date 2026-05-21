"use client";

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AccessModal } from './AccessModal';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background md:bg-background/80 md:backdrop-blur-xl border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrandLogo showTagline={false} size="sm" className="items-start" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <Link href="#guides" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-white transition-colors">GP Guides</Link>
              <Link href="#how-it-works" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-white transition-colors">Tactics</Link>
              <Link href="#race-control" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-accent transition-colors">RACE CONTROL</Link>
            </div>

            <div className="flex items-center gap-4 md:gap-10">

              
              {/* Desktop Button */}
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="hidden md:block bg-accent text-white px-8 py-3.5 font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_24px_rgba(225,6,0,0.25)] border border-[#E10600]/30"
              >
                Access Premium
              </button>

              {/* Hamburger Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden absolute top-20 left-0 w-full bg-background border-b border-border px-4 py-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <div className="flex flex-col space-y-8 items-center text-center">
            <Link 
              href="#guides" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-white transition-colors"
            >
              GP Guides
            </Link>
            <Link 
              href="#how-it-works" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-white transition-colors"
            >
              Tactics
            </Link>
            <Link 
              href="#race-control" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] font-bold text-accent transition-colors"
            >
              RACE CONTROL
            </Link>
            <div className="pt-4 border-t border-border w-full flex flex-col items-center gap-6">

              <button 
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMenuOpen(false);
                }} 
                className="w-full max-w-[240px] bg-accent text-white px-8 py-4 font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_24px_rgba(225,6,0,0.25)] border border-[#E10600]/30"
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
