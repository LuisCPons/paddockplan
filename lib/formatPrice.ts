import { CurrencyCode } from './CurrencyContext';

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
};

export function formatPrice(
  amount: number, 
  toCurrency: CurrencyCode, 
  originalAmount?: number, 
  originalCurrency?: CurrencyCode
) {
  const symbol = CURRENCY_SYMBOLS[toCurrency];
  
  // Format the main converted price
  const formattedConverted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: toCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, '');

  if (originalAmount && originalCurrency && toCurrency !== originalCurrency) {
    const originalSymbol = CURRENCY_SYMBOLS[originalCurrency];
    const formattedOriginal = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: originalCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(originalAmount).replace(/\s/g, '');
    
    return `${formattedConverted} (~${formattedOriginal})`;
  }

  return formattedConverted;
}

export function getCurrencySymbol(code: CurrencyCode): string {
  return CURRENCY_SYMBOLS[code] || '$';
}
