/**
 * Shorten address for display. Use the same pattern across the app.
 * @param address - Full address (EVM hex, SOL base58, TRON base58, etc.)
 * @param startChars - Characters to show at start (default 8)
 * @param endChars - Characters to show at end (default 6)
 */
export function truncateAddress(
  address: string,
  startChars = 8,
  endChars = 6,
): string {
  if (!address) return ''
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}…${address.slice(-endChars)}`
}
