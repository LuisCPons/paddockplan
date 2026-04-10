import React from 'react';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', showTagline = true, size = 'md' }: BrandLogoProps) {
  const scales = {
    sm: 0.6,
    md: 1,
    lg: 1.5
  };
  const scale = scales[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Speed Mark + PADDOCKPLAN */}
      <div className="flex flex-col items-center">
        <svg 
          width={240 * scale} 
          height={70 * scale} 
          viewBox="0 0 240 70" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speed Mark (The 3 red blocks on the left of the P) */}
          <g transform="translate(0, 5)">
            <path d="M0 22 L12 22 L16 10 L4 10 Z" fill="#CC0000" />
            <path d="M15 22 L27 22 L31 10 L19 10 Z" fill="#CC0000" />
            <path d="M7 10 L21 10 L25 -2 L11 -2 Z" fill="#CC0000" />
            
            {/* The Stylized P (Filled for better brand accuracy) */}
            <path 
              d="M35 0 L65 0 C78 0 88 10 88 23 C88 36 78 46 65 46 L50 46 L50 60 L38 60 L38 0 Z M50 12 L50 34 L65 34 C71 34 76 29 76 23 C76 17 71 12 65 12 L50 12 Z" 
              fill="white" 
            />
          </g>

          {/* Text: PADDOCKPLAN */}
          <text 
            x="0" 
            y="65" 
            className="font-manrope font-black italic uppercase tracking-[-0.05em]"
            fontSize="34"
          >
            <tspan fill="white">PADDOCK</tspan>
            <tspan fill="#CC0000">PLAN</tspan>
          </text>
        </svg>
      </div>

      {showTagline && (
        <div 
          className="mt-1 flex justify-between w-full text-[6px] uppercase tracking-[0.4em] font-bold text-muted-foreground/60"
          style={{ width: 240 * scale }}
        >
          <span>PLAN</span>
          <span className="text-accent/40">•</span>
          <span>STRATEGIZE</span>
          <span className="text-accent/40">•</span>
          <span>STAY AHEAD</span>
        </div>
      )}
    </div>
  );
}
