function boxMullerRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function generateMonteCarlo(startPrice, days, nSims) {
  const mu = -0.3 / 365, sigma = 0.65 / Math.sqrt(365);
  const paths = [];
  const percentiles = { p5: [], p25: [], p50: [], p75: [], p95: [] };

  for (let s = 0; s < nSims; s++) {
    const path = [startPrice];
    for (let d = 1; d <= days; d++) {
      const z = boxMullerRandom();
      path.push(path[d - 1] * Math.exp(mu - sigma * sigma / 2 + sigma * z));
    }
    paths.push(path);
  }

  for (let d = 0; d <= days; d += 7) {
    const vals = paths.map(p => p[d]).sort((a, b) => a - b);
    percentiles.p5.push(vals[Math.floor(nSims * 0.05)]);
    percentiles.p25.push(vals[Math.floor(nSims * 0.25)]);
    percentiles.p50.push(vals[Math.floor(nSims * 0.50)]);
    percentiles.p75.push(vals[Math.floor(nSims * 0.75)]);
    percentiles.p95.push(vals[Math.floor(nSims * 0.95)]);
  }

  return percentiles;
}
