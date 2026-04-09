"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'EUR' | 'GBP' | 'USD';

interface CurrencyContextType {
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (curr: CurrencyCode) => void;
  exchangeRates: Record<string, number>;
  convert: (amount: number, from: CurrencyCode) => number;
  isLoaded: boolean;
}

const FALLBACK_RATES: Record<string, number> = {
  EUR: 1,
  GBP: 0.85,
  USD: 1.08,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('EUR');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('paddock_currency') as CurrencyCode;
    if (saved && ['EUR', 'GBP', 'USD'].includes(saved)) {
      setSelectedCurrency(saved);
    }

    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await res.json();
        if (data.rates) {
          setExchangeRates(data.rates);
        }
      } catch (error) {
        console.warn('Currency API failed, using fallback rates:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchRates();
  }, []);

  useEffect(() => {
    localStorage.setItem('paddock_currency', selectedCurrency);
  }, [selectedCurrency]);

  const convert = (amount: number, from: CurrencyCode) => {
    // 1. Convert from source to EUR (base)
    // baseAmount = amount / rate[from]
    const baseAmount = amount / (exchangeRates[from] || FALLBACK_RATES[from]);
    // 2. Convert from EUR to target
    return baseAmount * (exchangeRates[selectedCurrency] || FALLBACK_RATES[selectedCurrency]);
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, exchangeRates, convert, isLoaded }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
