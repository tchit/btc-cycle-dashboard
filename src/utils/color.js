const RAINBOW = ['#2563eb', '#3b82f6', '#06b6d4', '#10b981', '#eab308', '#f97316', '#ef4444', '#dc2626', '#991b1b'];

export const rainbowAt = (v) => RAINBOW[Math.min(8, Math.max(0, Math.floor(v / 12.5)))];
