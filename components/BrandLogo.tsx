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
          width={scale === 1 ? '100%' : 240 * scale} 
          height={scale === 1 ? 'auto' : 60 * scale} 
          viewBox="0 0 500 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="max-w-[280px] w-full"
        >
          {/* Speed Mark (The 3 red blocks on the left of the P) */}
          <g transform="translate(10, 20)">
            <path d="M0 45 L25 45 L35 20 L10 20 Z" fill="#CC0000" />
            <path d="M32 45 L57 45 L67 20 L42 20 Z" fill="#CC0000" />
            <path d="M15 20 L45 20 L55 -5 L25 -5 Z" fill="#CC0000" />
            
            {/* The Stylized P (Filled and recalibrated for high-fidelity geometry) */}
            <path 
              d="M75 0 L130 0 C155 0 175 20 175 45 C175 70 155 90 130 90 L100 90 L100 120 L75 120 L75 0 Z M100 25 L100 65 L130 65 C142 65 150 56 150 45 C150 34 142 25 130 25 L100 25 Z" 
              fill="white" 
            />
          </g>

          {/* Text: PADDOCKPLAN - Repositioned for wide aspect ratio stability */}
          <text 
            x="200" 
            y="95" 
            className="font-manrope font-black italic uppercase tracking-[-0.05em]"
            style={{ fontSize: '64px' }}
          >
            <tspan fill="white">PADDOCK</tspan>
            <tspan fill="#CC0000">PLAN</tspan>
          </text>
        </svg>
      </div>

      {showTagline && (
        <div 
          className="mt-1 flex justify-between w-full max-w-[280px] text-[7px] uppercase tracking-[0.45em] font-bold text-muted-foreground/60"
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
