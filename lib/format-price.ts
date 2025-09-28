/**
 * Formats a price number to Persian currency format
 * @param price - The price number to format
 * @param divideByTen - Whether to divide the price by 10 (default: true)
 * @returns Formatted price string with Persian number format and "تومان" suffix
 */
export const formatPrice = (
  price: number,
  divideByTen: boolean = true
): string => {
  const formattedPrice = divideByTen
    ? new Intl.NumberFormat("fa-IR").format(price / 10)
    : new Intl.NumberFormat("fa-IR").format(price);

  return formattedPrice + " تومان";
};

/**
 * Formats a price number to Persian currency format without division
 * @param price - The price number to format
 * @returns Formatted price string with Persian number format and "تومان" suffix
 */
export const formatPriceRaw = (price: number): string => {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};

/**
 * Formats a price number to Persian currency format with division by 10
 * @param price - The price number to format
 * @returns Formatted price string with Persian number format and "تومان" suffix
 */
export const formatPriceDivided = (price: number): string => {
  return new Intl.NumberFormat("fa-IR").format(price / 10) + " تومان";
};



