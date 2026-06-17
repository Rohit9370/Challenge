import React from 'react';

const Logo = ({ size = 48, showText = true }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Store building shape */}
        <rect x="15" y="35" width="70" height="50" fill="#0a0a0a" rx="2"/>
        <rect x="20" y="40" width="60" height="40" fill="white"/>
        
        {/* Door */}
        <rect x="42" y="55" width="16" height="25" fill="#0a0a0a"/>
        
        {/* Windows */}
        <rect x="25" y="45" width="12" height="10" fill="#0a0a0a"/>
        <rect x="63" y="45" width="12" height="10" fill="#0a0a0a"/>
        
        {/* Awning */}
        <path 
          d="M10 35 L50 25 L90 35 L85 40 L50 30 L15 40 Z" 
          fill="#0a0a0a"
        />
        
        {/* Star rating */}
        <g transform="translate(32, 12)">
          <path 
            d="M18 2 L22 14 L35 14 L24 22 L28 34 L18 26 L8 34 L12 22 L1 14 L14 14 Z" 
            fill="#fbbf24"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
        </g>
      </svg>
      
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontSize: size > 40 ? '24px' : '18px', 
            fontWeight: 700, 
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
            lineHeight: 1
          }}>
            Store Rating
          </span>
          <span style={{ 
            fontSize: size > 40 ? '12px' : '10px', 
            color: '#737373',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            System
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
