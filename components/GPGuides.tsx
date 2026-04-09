"use client";

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const GUIDES = [
  {
    id: 'monza',
    title: 'The Italian GP',
    location: 'Monza, Italy',
    image: 'https://images.unsplash.com/photo-1542382103-6058e5ec2ad0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'silverstone',
    title: 'The British GP',
    location: 'Silverstone, UK',
    image: 'https://images.unsplash.com/photo-1610884447640-ee73111f17dc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'suzuka',
    title: 'The Japanese GP',
    location: 'Suzuka, Japan',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export function GPGuides() {
  return (
    <section id="guides" className="py-24 md:py-32 bg-[#F9F9F9] border-t border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-end mb-16"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Destinations</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground leading-[1.1]">Iconic Locations.<br />Curated Secrets.</h2>
          </div>
          <Link href="/guides" className="hidden md:flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent transition-colors">
            View Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {GUIDES.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </motion.div>
        
        <Link href="/guides" className="md:hidden mt-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent transition-colors">
            View Directory <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function GuideCard({ guide }: { guide: any }) {
  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col bg-card border border-zinc-200 hover:border-foreground transition-colors cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img 
          src={guide.image} 
          alt={guide.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[15%]" 
        />
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">{guide.location}</span>
          <ArrowRight className="w-4 h-4 text-transparent group-hover:text-accent transition-colors duration-300" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight mb-3 text-foreground">{guide.title}</h3>
        <p className="text-foreground/60 text-sm font-light leading-relaxed">Master the weekend with our comprehensive editorial guide to {guide.location.split(',')[0]}.</p>
      </div>
    </motion.div>
  );
}
