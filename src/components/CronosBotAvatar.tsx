import React from 'react';

const CronosBotAvatar = ({ size = 60 }: { size?: number }) => {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <radialGradient id="botHeadGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35 35) rotate(45) scale(60)">
            <stop offset="0%" stopColor="#DC69A8" />
            <stop offset="100%" stopColor="#301852" />
          </radialGradient>
          <filter id="botGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* The Head (Planet) */}
        <circle cx="50" cy="50" r="35" fill="url(#botHeadGradient)" />
        
        {/* The Eyes */}
        <circle cx="38" cy="45" r="3" fill="#fff" filter="url(#botGlow)" />
        <circle cx="62" cy="45" r="3" fill="#fff" filter="url(#botGlow)" />
        
        {/* The Ring */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="55" 
          ry="12" 
          fill="none" 
          stroke="#DC69A8" 
          strokeWidth="2" 
          strokeOpacity="0.6"
          transform="rotate(-20 50 50)" 
        />
        
        {/* Signal Star */}
        <circle cx="85" cy="15" r="2" fill="#fff">
          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default CronosBotAvatar;
