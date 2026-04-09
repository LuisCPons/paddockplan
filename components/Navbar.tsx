"use client";

import Link from 'next/link';
import { Flag } from 'lucide-react';
import { useState } from 'react';
import { AccessModal } from './AccessModal';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-zinc-200 transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2 group">
              <Flag className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
              <span className="uppercase tracking-widest text-lg">Paddock<span className="text-accent">Plan</span></span>
            </Link>
            
            <div className="hidden md:flex space-x-10">
              <Link href="#guides" className="text-xs uppercase tracking-widest font-bold text-foreground/70 hover:text-accent transition-colors">GP Guides</Link>
              <Link href="#how-it-works" className="text-xs uppercase tracking-widest font-bold text-foreground/70 hover:text-accent transition-colors">How it Works</Link>
              <Link href="#pricing" className="text-xs uppercase tracking-widest font-bold text-foreground/70 hover:text-accent transition-colors">Pricing</Link>
            </div>

            <div>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-accent text-background px-6 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer"
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
