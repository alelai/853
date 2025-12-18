
import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", light = false }) => {
  const color = light ? "#FFFFFF" : "#C1A376";
  const bgColor = light ? "rgba(255,255,255,0.1)" : "transparent";

  return (
    <div className={`${className} flex items-center justify-center`} style={{ backgroundColor: bgColor, borderRadius: '8px' }}>
      <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shield Outer Border */}
        <path d="M10 10 H90 V80 C90 95 50 110 50 110 C50 110 10 95 10 80 V10Z" stroke={color} strokeWidth="2" />
        {/* Shield Inner Border */}
        <path d="M15 15 H85 V78 C85 90 50 103 50 103 C50 103 15 90 15 78 V15Z" stroke={color} strokeWidth="1" />
        
        {/* Upper Section Divider */}
        <line x1="17" y1="45" x2="83" y2="45" stroke={color} strokeWidth="1" strokeDasharray="4 2" />
        
        {/* 853 Text */}
        <text x="50" y="38" fill={color} fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">853</text>
        
        {/* Cross Symbols */}
        <path d="M22 30 H32 M27 25 V35" stroke={color} strokeWidth="1.5" />
        <path d="M68 30 H78 M73 25 V35" stroke={color} strokeWidth="1.5" />
        
        {/* Stylized Caduceus (Simplified) */}
        <line x1="50" y1="55" x2="50" y2="95" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="53" r="3" fill={color} />
        {/* Wings */}
        <path d="M35 60 C40 55 48 55 50 60 C52 55 60 55 65 60" stroke={color} strokeWidth="1.5" fill="none" />
        {/* Snakes */}
        <path d="M44 65 Q50 75 56 65 Q50 55 44 65 Z" stroke={color} strokeWidth="1" fill="none" />
        <path d="M44 80 Q50 90 56 80 Q50 70 44 80 Z" stroke={color} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

export default Logo;
