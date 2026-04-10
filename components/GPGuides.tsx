"use client";

import { motion } from 'motion/react';
import { ArrowRight, Gauge, Sparkles, Settings } from 'lucide-react';
import Link from 'next/link';

const GUIDES = [
  {
    id: 'monza',
    title: 'The Italian GP',
    location: 'MONZA, ITALY',
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1542382103-6058e5ec2ad0?q=80&w=800&auto=format&fit=crop',
    tag: 'HIGH SPEED',
    tagIcon: Gauge,
    path: "M419.3,301.7c-22,0-193.8,0-199,0c-5.3,0-4.4-3.3-4.4-5s0.5-5.8-1.9-5.8s-4.8,0.7-7.9,2c-3.1,1.3-16.5,7.8-38.3,9.1c-11.5,0.7-31.2,0.9-47.2-7.2c-22.4-11.4-38.2-36.5-41.6-59.3c-1.6-10.4-13-81.5-13.6-84c-0.6-2.5-1.8-3.7-4.5-3.8c-2.8-0.1-6.1-0.7-6.9-6.4s-2-10.7-5.1-16.7c-3.1-6-15.2-35.9-17.3-40.2s-4.2-19.6,10-22.5c14.2-2.9,46.5-8.8,50.8-9.4c4.2-0.6,8.3-0.6,12,5.1s27.5,41.1,31.6,48c4.1,6.9,16.7,22.4,31.3,37.2c14.6,14.8,81.5,78.9,83.9,81.2s3.8,5.7,10.8,3.7c7-2,11.3-2.8,18.3,0.1c7,2.9,9.4,7,11.1,8.8c1.8,1.8,3.7,3.5,7,3.5s202.8,4.1,210.1,4.2c7.3,0.1,16.7,6.9,16.7,17.3c0,10.4-6.4,22-17.1,27.8c-18.7,10.2-47.4,12.4-71.1,12.4C424.7,301.7,419.3,301.7,419.3,301.7z",
    viewBox: "0 0 550 443.7"
  },
  {
    id: 'silverstone',
    title: 'The British GP',
    location: 'SILVERSTONE, UK',
    flag: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1610884447640-ee73111f17dc?q=80&w=800&auto=format&fit=crop',
    tag: 'LEGENDARY',
    tagIcon: Sparkles,
    path: "M387.7,272.6c0,0-89.9-52.7-96.9-57.7c-7-5-7.8-15.7-7.6-25.8c0.1-10.1,3.7-30-7-41.4c-10.7-11.4-32.3-32.8-35.1-36.1c-2.8-3.4-4.2-7.9,0.4-10.2c4.7-2.3,16.7-7.2,20.5-9.2c3.8-2,6.9-4.5,6.6-6.7c-0.3-2.2-3.8-6.6-10.2-8c-6.4-1.5-29.4-2.6-33.1-2.3c-3.7,0.3-6.7,3.1-7.9,4.8c-1.2,1.8-87.5,123.5-91.5,128.8c-4,5.3-4.7,16.1-1.2,21.4c3.5,5.3,8.2,6,14.3,5.4c6.1-0.6,11.7-0.7,15.4,0.4c3.7,1.2,9.2,3.1,9.5,13.9c0.3,10.8-11.4,13.9-18.1,12c-6.7-1.9-28.5-10-35.6-13.2c-7-3.2-18.1-14.2-20.9-17.7c-2.8-3.5-7.9-12.4-10-22.2c-2-9.8-19.2-90-20-96.9c-0.9-6.9,1.3-18.3,15.1-24.9c13.8-6.6,41.1-16.5,52.5-18.9c11.4-2.3,41.6-6.4,48.1-7.5c6.6-1,15.7-5.3,20.3-9.8s9.2-9.1,19.6-6.3c10.4,2.8,15.1,4,19.3,5.1c5.6,1.5,17.1-0.2,20.9-4.2c5.1-5.4,11.3-13.5,19.9-13.5c8.6,0,15.1,5.6,19,12.3c4,6.7,9.7,12.9,12.1,14.8s6.4,4.1,10.5,5.6c4.1,1.5,115.2,45.4,121.6,48c6.4,2.6,31.9,13.9,38,17.3c6.1,3.4,19.9,8.2,20.9,23.7c1,15.5-11,22-15.7,24.7c-4.7,2.8-20,13.9-27.5,22.7c-7.5,8.8-27.4,30.3-29.9,33.4s-2.5,6.7,2,10.1c4.5,3.4,6.9,4.8,6.7,9.4c-0.1,4.5-4.2,7.6-6.9,10.5s-11.6,10.8-19.3,12.6c-7.8,1.8-9.5,1.3-12.7-0.4C391.1,274.6,387.7,272.6,387.7,272.6z",
    viewBox: "0 0 525.2 331.8"
  },
  {
    id: 'barcelona',
    title: 'The Spanish GP',
    location: 'BARCELONA, SPAIN',
    flag: '🇪🇸',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7a55?q=80&w=800&auto=format&fit=crop',
    tag: 'TECHNICAL',
    tagIcon: Settings,
    path: "M727.9,128.8c-7-2.4-64.1-22-72.9-24.6c-8.8-2.6-22.8,0-30.3,8.3c-7.5,8.3-10.1,23.3-4.8,36c5.3,12.7,24.6,16.2,33.4,19.3c8.8,3.1,25.5,9.2,32.9,27.7c7.5,18.4,7.5,34.2,0.9,41.3c-6.6,7-15.8,6.6-25,1.8S460,117.2,436.4,104.3c-19.3-10.5-47.9,1.8-54,11c-4.5,6.8-48.3,68.5-56.2,79.9c-7.9,11.4-9.2,24.6-9.2,29c0,4.4,0,10.1,0,15.4c0,15.8-14.9,19.8-23.7,19.8c-8.8,0-16.7,0-47.9,0S186.1,239,180,235.1c-6.1-4-42.1-28.5-47.4-31.6c-5.3-3.1-12.3-6.1-12.3-18.9c0-13.6,11-18,19.8-18c8.8,0,63.7,0,91.8,0c25.9,0,55.8-18.9,55.8-50c0-16.7-16.7-26.8-29.4-26.8c-10.1,0-96.1,0-127.3,0c-22.4,0-52.9,10.9-70.7,27.7c-14.9,14-22.8,32.9-22.8,46.1c0,29,15.4,45.7,25,51.4c9.7,5.7,33.8,14.5,52.7,22.4c18.9,7.9,18,26.8,18,42.1c0,16.2,11.4,22.4,28.1,22.4c14,0,540,0,540,0c45.2,0,55.8-29.4,55.8-44.3c0-14.9,0-37.3,0-42.6c0,0,0-33.1,0-44.1S751.3,136.7,727.9,128.8z",
    viewBox: "0 0 791.4 426.5"
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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
};

export function GPGuides() {
  return (
    <section id="guides" className="py-24 md:py-32 bg-background border-t border-border overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground leading-[1.1]">Iconic Locations.<br />Curated Secrets.</h2>
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
  const TagIcon = guide.tagIcon;
  
  return (
    <motion.div 
      variants={cardVariants}
      className="group relative flex flex-col bg-[#111] border border-border/50 hover:border-accent transition-all duration-500 cursor-pointer rounded-xl overflow-hidden shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Background Image with Zoom */}
        <img 
          src={guide.image} 
          alt={guide.title} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" 
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Top-Left Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 border border-accent/50 bg-black/40 backdrop-blur-md rounded-lg">
          <TagIcon className="w-3 h-3 text-accent" />
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-white">{guide.tag}</span>
        </div>

        {/* Top-Right Track Silhouette */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg">
           <svg viewBox={guide.viewBox} className="w-full h-full">
             <path 
               d={guide.path} 
               fill="none" 
               stroke="white" 
               strokeWidth="6" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
             />
           </svg>
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">{guide.location} {guide.flag}</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{guide.title}</h3>
          
          {/* Red Line Accent */}
          <div className="w-8 h-0.5 bg-accent mb-4 transition-all duration-500 group-hover:w-16" />
          
          <p className="text-foreground/60 text-xs font-light leading-relaxed max-w-[90%] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            Master the weekend with our comprehensive editorial guide to {guide.location.split(',')[0].toLowerCase()}.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
