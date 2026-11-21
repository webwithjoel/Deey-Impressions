export function formatNaira(amount) {
  return `₦${Math.round(Number(amount) || 0).toLocaleString('en-NG')}`
}
