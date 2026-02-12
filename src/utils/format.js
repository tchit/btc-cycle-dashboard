export const fP = (v) => Math.round(v).toLocaleString('en-US');
export const fK = (v) => (v / 1000).toFixed(1) + 'K';
export const fB = (v) => v >= 1e12 ? (v / 1e12).toFixed(2) + 'T' : (v / 1e9).toFixed(1) + 'B';
export const fPct = (v) => (v > 0 ? '+' : '') + v.toFixed(1) + '%';
export const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
export const isFake = (fakes, ...fields) => fakes && fields.some(f => fakes.has(f));
