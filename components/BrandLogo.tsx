import React from 'react';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean; // Kept for compatibility, but logic removed per request
  size?: 'sm' | 'md' | 'lg'; // Kept for compatibility
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  // Using the provided brand-logo.png with strict sizing requirements (45px height)
  // Tagline removed per specification
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <img 
        src="/brand-logo.png" 
        alt="PaddockPlan Logo" 
        className="block h-8 md:h-[45px] w-auto object-contain"
      />
    </div>
  );
}
