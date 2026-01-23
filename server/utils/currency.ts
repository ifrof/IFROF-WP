// Currency conversion utility
// Supports USD (primary), SAR, CNY

export const EXCHANGE_RATES = {
  USD: 1,
  SAR: 3.75, // 1 USD = 3.75 SAR
  CNY: 7.24, // 1 USD = 7.24 CNY
};

export type Currency = keyof typeof EXCHANGE_RATES;

/**
 * Convert amount from one currency to another
 * @param amount Amount in cents
 * @param from Source currency
 * @param to Target currency
 * @returns Converted amount in cents
 */
export function convertCurrency(
  amount: number,
  from: Currency = "USD",
  to: Currency = "USD"
): number {
  if (from === to) return amount;
  
  // Convert to USD first
  const amountInUSD = amount / EXCHANGE_RATES[from];
  
  // Convert to target currency
  const convertedAmount = amountInUSD * EXCHANGE_RATES[to];
  
  return Math.round(convertedAmount);
}

/**
 * Format amount with currency symbol
 * @param amount Amount in cents
 * @param currency Currency code
 * @returns Formatted string
 */
export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  const value = amount / 100;
  
  switch (currency) {
    case "USD":
      return `$${value.toFixed(2)}`;
    case "SAR":
      return `${value.toFixed(2)} ر.س`;
    case "CNY":
      return `¥${value.toFixed(2)}`;
    default:
      return `${value.toFixed(2)} ${currency}`;
  }
}

/**
 * Get currency symbol
 * @param currency Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency = "USD"): string {
  switch (currency) {
    case "USD":
      return "$";
    case "SAR":
      return "ر.س";
    case "CNY":
      return "¥";
    default:
      return currency;
  }
}
