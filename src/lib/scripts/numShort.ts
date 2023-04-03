export function numShort(num: number) {

  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(2)}m`;
  return `${(num / 1000000000).toFixed(3)}b`;
}