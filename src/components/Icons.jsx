import React from 'react';

// Basic SVG Icon component wrapper
const Icon = ({ children, className = "", size = 18 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

export const LayoutGrid = (props) => (
  <Icon {...props}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </Icon>
);

export const Link2 = (props) => (
  <Icon {...props}>
    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
    <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
    <line x1="8" x2="16" y1="12" y2="12" />
  </Icon>
);

export const DollarSign = (props) => (
  <Icon {...props}>
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Icon>
);

export const Rainbow = (props) => (
  <Icon {...props}>
    <path d="M22 17a10 10 0 0 0-20 0" />
    <path d="M6 17a6 6 0 0 1 12 0" />
    <path d="M10 17a2 2 0 0 1 4 0" />
  </Icon>
);

export const RefreshCw = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </Icon>
);

export const Pickaxe = (props) => (
  <Icon {...props}>
    <path d="M14.5 5.5l5 5" />
    <path d="M3 21l9-9" />
    <path d="M11 7l9 9" />
    <path d="M4 11l9 9" />
  </Icon>
);

export const TrendingUp = (props) => (
  <Icon {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </Icon>
);

export const Zap = (props) => (
  <Icon {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
);

export const Cable = (props) => (
  <Icon {...props}>
    <path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z" />
    <path d="M9 13v6" />
    <path d="M15 13v6" />
    <path d="M7 19h10" />
  </Icon>
);

export const Menu = (props) => (
  <Icon {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </Icon>
);

export const Bitcoin = (props) => (
  <Icon {...props}>
    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-5.71m0 0c-4.925.313-4.925-5.712 0-5.712m0 5.712V19.09m0-11.424V19.09M8.332 7.665h5.168" />
  </Icon>
);

export const Activity = (props) => (
  <Icon {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Icon>
);
