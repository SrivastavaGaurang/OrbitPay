import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
};

// Exchange rates relative to INR (1 INR = X currency)
const RATES_FROM_INR = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.81
};

const SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

const NAMES = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen'
};

export const CurrencyProvider = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem('orbitpay_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('orbitpay_currency', activeCurrency);
  }, [activeCurrency]);

  // Convert amount from one currency to active currency
  const convertAmount = (amount, fromCurrency = 'INR') => {
    const val = parseFloat(amount) || 0;
    if (fromCurrency === activeCurrency) return val;

    // Convert to INR first
    const inrVal = fromCurrency === 'INR' ? val : val / (RATES_FROM_INR[fromCurrency] || 1);
    
    // Convert INR to active currency
    const targetVal = inrVal * (RATES_FROM_INR[activeCurrency] || 1);
    return Math.round(targetVal * 100) / 100;
  };

  // Format currency with symbol & locale for active currency
  const formatVal = (amount, fromCurrency = 'INR') => {
    const converted = convertAmount(amount, fromCurrency);
    const symbol = SYMBOLS[activeCurrency] || '₹';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: activeCurrency,
      minimumFractionDigits: activeCurrency === 'JPY' ? 0 : 0,
      maximumFractionDigits: activeCurrency === 'JPY' ? 0 : 2
    }).format(converted);
  };

  const value = {
    activeCurrency,
    setActiveCurrency,
    convertAmount,
    formatVal,
    symbol: SYMBOLS[activeCurrency] || '₹',
    currencyName: NAMES[activeCurrency] || 'INR',
    availableCurrencies: Object.keys(RATES_FROM_INR).map(code => ({
      code,
      symbol: SYMBOLS[code],
      name: NAMES[code]
    }))
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
