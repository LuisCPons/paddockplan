"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from './Modal';
import { Check, Mail, MapPin, UserIcon } from 'lucide-react';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGP?: string;
}

export function AccessModal({ isOpen, onClose, defaultGP = '' }: AccessModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setIsSuccess(false), 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">Application</span>
              <h2 className="text-3xl font-extrabold tracking-tighter mb-4 text-foreground">Request Access</h2>
              <p className="text-foreground/60 text-sm font-light leading-relaxed max-w-sm">
                Gain priority booking, exclusive paddock insights, and bespoke concierge support for your next race weekend.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="relative border-b border-border">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 absolute top-2 left-0">Preferred Destination</label>
                <div className="flex items-center pt-6 pb-2">
                  <MapPin className="w-4 h-4 text-foreground/20 mr-3" />
                  <select 
                    required
                    defaultValue={defaultGP}
                    className="w-full bg-transparent focus:outline-none text-foreground font-medium text-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a Destination</option>
                    <option value="Monza">The Italian GP (Monza)</option>
                    <option value="Silverstone">The British GP (Silverstone)</option>
                    <option value="Monaco">The Monaco GP</option>
                    <option value="Austin">The US GP (Austin)</option>
                    <option value="Other">Other / Undecided</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-foreground text-background font-bold text-xs uppercase tracking-widest py-4 mt-8 hover:bg-accent transition-colors flex justify-center items-center"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="text-center py-12"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
              className="w-16 h-16 bg-[#F9F9F9] border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-6 h-6 text-foreground" />
            </motion.div>
            <h2 className="text-2xl font-extrabold tracking-tighter mb-4">Request Received</h2>
            <p className="text-foreground/60 mb-8 max-w-xs mx-auto font-light text-sm leading-relaxed">
              Our concierge team will review your preferences and contact you shortly to begin crafting your itinerary.
            </p>
            <button 
              onClick={handleClose}
              className="bg-transparent border border-foreground text-foreground font-bold text-xs uppercase tracking-widest px-8 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Close Window
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
