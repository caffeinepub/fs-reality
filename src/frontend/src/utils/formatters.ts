/**
 * Format price in Indian numbering system (lakhs/crores)
 * ₹12,50,000 for lakhs, ₹1,25,00,000 for crores
 */
export function formatIndianPrice(priceInRupees: bigint | number): string {
  const price =
    typeof priceInRupees === "bigint" ? Number(priceInRupees) : priceInRupees;

  if (price >= 10_000_000) {
    const crores = price / 10_000_000;
    return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2)} Cr`;
  }
  if (price >= 100_000) {
    const lakhs = price / 100_000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)} L`;
  }
  return `₹${formatWithCommas(price)}`;
}

/**
 * Format number with Indian comma style (e.g., 12,50,000)
 */
export function formatWithCommas(num: number): string {
  const str = num.toString();
  const lastThree = str.substring(str.length - 3);
  const otherNums = str.substring(0, str.length - 3);
  const formatted =
    otherNums !== ""
      ? `${otherNums.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
      : lastThree;
  return formatted;
}

/**
 * Format full price for display (e.g., ₹12,50,000)
 */
export function formatFullPrice(priceInRupees: bigint | number): string {
  const price =
    typeof priceInRupees === "bigint" ? Number(priceInRupees) : priceInRupees;
  return `₹${formatWithCommas(price)}`;
}

/**
 * Format date from nanosecond timestamp
 */
export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format area
 */
export function formatArea(areaSqFt: bigint | number): string {
  const area = typeof areaSqFt === "bigint" ? Number(areaSqFt) : areaSqFt;
  return `${area.toLocaleString("en-IN")} sq.ft`;
}
