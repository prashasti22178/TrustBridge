/** Python round uses nearest-even at exact half points, unlike Math.round. */
export function roundHalfEven(value: number): number {
  const lower = Math.floor(value);
  if (value - lower === 0.5) return lower % 2 === 0 ? lower : lower + 1;
  return Math.round(value);
}
