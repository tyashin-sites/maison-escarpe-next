/**
 * Prices on the Tyashin API are stored in the smallest currency unit (cents
 * for CAD/USD). Canadian-English formatting: "C$495" reads as "$495" for a
 * Canadian visitor; we render the currency code explicitly on the PDP because
 * the house sells into the US too.
 */
export function formatPrice(amountInSmallestUnit: number, currency = 'CAD'): string {
  try {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency,
      minimumFractionDigits: amountInSmallestUnit % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amountInSmallestUnit / 100);
  } catch {
    return `${currency} ${(amountInSmallestUnit / 100).toFixed(2)}`;
  }
}

/** "C$495" — explicit currency letter for cross-border clarity. */
export function formatPriceExplicit(amountInSmallestUnit: number, currency = 'CAD'): string {
  const base = formatPrice(amountInSmallestUnit, currency);
  if (currency === 'CAD' && base.startsWith('$')) return `C${base}`;
  if (currency === 'USD' && base.startsWith('$')) return `US${base}`;
  return base;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
