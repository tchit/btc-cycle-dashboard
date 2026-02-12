import { useState, useEffect } from 'react';

export function useScreen() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 960);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return { w, mob: w < 640, tab: w >= 640 && w < 1024 };
}
