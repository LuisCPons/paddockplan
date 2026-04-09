"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from './Modal';
import { Check, Mail, UserIcon, ArrowRight, ShieldCheck, CheckCircle2, Clock, Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGP?: string;
}

type CheckoutStage = 'form' | 'transition' | 'checkout' | 'success';

function SuccessDetector({ onSetStage }: { onSetStage: (stage: CheckoutStage) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      onSetStage('success');
    }
  }, [searchParams, onSetStage]);

  return null;
}

export function AccessModal({ isOpen, onClose, defaultGP = '' }: AccessModalProps) {
  const [stage, setStage] = useState<CheckoutStage>('form');

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage('transition');
    
    // 1.5s Transition to buildup anticipation
    setTimeout(() => {
      setStage('checkout');
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // Reset stage after modal is closed
    setTimeout(() => {
      if (stage !== 'success') {
        setStage('form');
      }
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Suspense fallback={null}>
        <SuccessDetector onSetStage={setStage} />
      </Suspense>
      <AnimatePresence mode="wait">
        {stage === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">Premium Access</span>
              <h2 className="text-3xl font-extrabold tracking-tighter mb-4 text-foreground">Get Your Blueprint</h2>
              <p className="text-foreground/60 text-sm font-light leading-relaxed max-w-sm">
                Secure your 12-page editorial guide and logistics blueprint for the {defaultGP || 'race'} weekend.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-6">
              <div className="relative border-b border-border">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 absolute top-2 left-0">Full Name</label>
                <div className="flex items-center pt-6 pb-2">
                  <UserIcon className="w-4 h-4 text-foreground/20 mr-3" />
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full bg-transparent focus:outline-none text-foreground font-medium placeholder-foreground/20 text-sm"
                  />
                </div>
              </div>

              <div className="relative border-b border-border">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 absolute top-2 left-0">Email Address</label>
                <div className="flex items-center pt-6 pb-2">
                  <Mail className="w-4 h-4 text-foreground/20 mr-3" />
                  <input 
                    required 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full bg-transparent focus:outline-none text-foreground font-medium placeholder-foreground/20 text-sm"
                  />
                </div>
              </div>

              {/* FOMO Elements */}
              <div className="py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/70">Instant PDF & Digital Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/70">Updated for the 2026 Season</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/70">Verified by local travel experts</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-foreground text-background font-bold text-xs uppercase tracking-widest py-5 mt-4 hover:bg-accent transition-colors flex justify-center items-center gap-3"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {stage === 'transition' && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="w-16 h-16 border-2 border-accent border-t-transparent rounded-full animate-spin mb-8" />
            <h3 className="text-xl font-bold tracking-tight mb-2">Preparing your custom link...</h3>
            <p className="text-sm text-foreground/60">Securing your {defaultGP} logistics data.</p>
          </motion.div>
        )}

        {stage === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center py-12 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-8">
              <ShieldCheck className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tighter mb-4">Complete Your Order</h2>
            <p className="text-foreground/60 mb-10 max-w-sm mx-auto font-light text-sm leading-relaxed">
              Your custom {defaultGP} blueprint is ready. Click below to proceed to our secure checkout partner.
            </p>
            <a 
              href="https://checkout.paddockplan.com/buy/premium" // Placeholder URL
              className="w-full bg-[#E10600] text-white font-bold text-xs uppercase tracking-[0.2em] py-6 shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:scale-[1.02] transition-all flex justify-center items-center gap-3"
            >
              Proceed to Secure Payment (€19) <ArrowRight className="w-4 h-4" />
            </a>
            <p className="mt-6 text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3" /> Limited time price for the 2026 season
            </p>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mb-8"
            >
              <Download className="w-10 h-10 text-accent" />
            </motion.div>
            <h2 className="text-3xl font-extrabold tracking-tighter mb-4">Your Blueprint is Ready</h2>
            <p className="text-foreground/60 mb-10 max-w-xs mx-auto font-light text-sm leading-relaxed">
              Your custom 12-page logistics guide has been generated and is ready for download.
            </p>
            <div className="w-full space-y-4">
              <button 
                className="w-full bg-foreground text-background font-bold text-xs uppercase tracking-widest py-5 hover:bg-black transition-colors flex justify-center items-center gap-3"
              >
                Download Digital Blueprint <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={handleClose}
                className="w-full bg-transparent border border-border text-foreground/60 font-bold text-[10px] uppercase tracking-widest py-3 hover:text-foreground transition-colors"
              >
                Enter Member Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
