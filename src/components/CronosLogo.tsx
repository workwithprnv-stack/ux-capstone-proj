import React from 'react';

const CronosLogo = ({ size = 32 }: { size?: number }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="planetGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35 35) rotate(45) scale(60)">
          <stop offset="0%" stopColor="#DC69A8" />
          <stop offset="100%" stopColor="#301852" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Glow effect for the planet */}
      <circle cx="50" cy="50" r="32" fill="#DC69A8" opacity="0.2" filter="url(#glow)" />
      
      {/* The Purple Planet */}
      <circle cx="50" cy="50" r="30" fill="url(#planetGradient)" />
      
      {/* The Ring */}
      <ellipse 
        cx="50" 
        cy="50" 
        rx="45" 
        ry="10" 
        fill="none" 
        stroke="#F2F2F3" 
        strokeWidth="1.5" 
        strokeOpacity="0.8"
        transform="rotate(-25 50 50)" 
      />
      
      {/* The Star Twinkle */}
      <g transform="translate(65, 25)">
        <line x1="0" y1="-8" x2="0" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="1" fill="white" />
      </g>
    </svg>
  );
};

export default CronosLogo;
