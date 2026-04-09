import Link from 'next/link';
import { Flag, MessageCircle, Camera, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2 mb-6">
              <Flag className="w-5 h-5 text-accent" strokeWidth={2.5} />
              <span className="uppercase tracking-widest text-lg">Paddock<span className="text-accent">Plan</span></span>
            </Link>
            <p className="text-sm font-light text-foreground/60 leading-relaxed mb-8 max-w-xs">
              The premier independent digital travel planner for the global motorsport community.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-zinc-200 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"><MessageCircle className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 border border-zinc-200 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"><Camera className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 border border-zinc-200 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-light text-foreground/60">
              <li><Link href="#guides" className="hover:text-accent transition-colors">Race Guides</Link></li>
              <li><Link href="#pricing" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="#plan" className="hover:text-accent transition-colors">Trip Calculator</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Track Maps</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-light text-foreground/60">
              <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-6">Edition</h4>
            <p className="text-sm font-light text-foreground/60 leading-relaxed mb-6">Receive curated track updates and early access credentials straight to your inbox.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-b border-zinc-300 px-0 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/30 font-medium"
              />
              <button className="bg-transparent text-xs font-bold uppercase tracking-widest text-foreground text-left py-2 hover:text-accent transition-colors mt-2">
                Subscribe &rarr;
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/40 font-light text-center md:text-left">
          <p>© 2026 PaddockPlan. All rights reserved.</p>
          <p>An independent platform not affiliated with the FIA, Formula 1, or associated companies.</p>
        </div>
      </div>
    </footer>
  );
}
