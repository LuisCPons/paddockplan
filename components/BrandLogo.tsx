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
        style={{ 
          height: '45px', 
          width: 'auto', 
          objectFit: 'contain' 
        }}
        className="block"
      />
    </div>
  );
}
