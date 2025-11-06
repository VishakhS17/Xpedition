/**
 * Formats a price string with the rupee symbol (₹)
 * Removes any existing rupee symbol to avoid duplication
 * @param price - The price string (e.g., "6,25,000" or "₹6,25,000")
 * @returns Formatted price with rupee symbol (e.g., "₹6,25,000")
 */
export function formatPrice(price: string | null | undefined): string {
  if (!price) return '';
  
  // Remove any existing rupee symbol or currency symbols
  const cleanedPrice = price.replace(/[₹₹Rs\.]/g, '').trim();
  
  // Add rupee symbol at the beginning
  return `₹${cleanedPrice}`;
}

