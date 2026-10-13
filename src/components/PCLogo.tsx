import React from 'react';

interface PCLogoProps {
  size?: number | string;
  className?: string;
  showGlow?: boolean;
}

export const PCLogo: React.FC<PCLogoProps> = ({
  size = 40,
  className = '',
  showGlow = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className} ${
        showGlow ? 'drop-shadow-[0_0_12px_rgba(0,255,102,0.6)]' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer stylized "P" and "C" track */}
        {/* Upper & left P arc flowing into C */}
        <path
          d="M 23 80
             L 23 50
             A 27 27 0 0 1 50 23
             A 27 27 0 0 1 77 38
             L 88 27
             A 42 42 0 0 0 50 8
             C 26.8 8 8 26.8 8 50
             L 8 80
             Z"
          fill="currentColor"
        />

        {/* Lower C arc */}
        <path
          d="M 35 73
             L 35 88
             A 42 42 0 0 0 88 73
             L 77 62
             A 27 27 0 0 1 45 73
             Z"
          fill="currentColor"
        />

        {/* Center Disc: Green Fluo */}
        <circle cx="50" cy="50" r="17" fill="#00FF66" />

        {/* Center Play Button: White triangle */}
        <path
          d="M 46 41.5
             L 58 50
             L 46 58.5
             Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
