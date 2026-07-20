import { differenceInDays, parseISO, isValid } from 'date-fns';
import { CURRENCIES, CATEGORIES } from './constants';

export const formatCurrency = (amount, currencyCode = 'INR') => {
  const currencyObj = CURRENCIES.find(c => c.code === currencyCode) || { symbol: '₹' };
  const value = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  
  // Format with standard locale format
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

export const daysUntilRenewal = (nextDateStr) => {
  if (!nextDateStr) return 0;
  try {
    const today = new Date();
    // set to midnight for date-only comparison
    today.setHours(0, 0, 0, 0);
    
    const renewal = new Date(nextDateStr);
    renewal.setHours(0, 0, 0, 0);
    
    return differenceInDays(renewal, today);
  } catch (error) {
    console.error("Error calculating renewal days: ", error);
    return 0;
  }
};

export const calculateMonthlyCost = (amount, cycle) => {
  const value = parseFloat(amount) || 0;
  switch (cycle) {
    case 'weekly':
      return value * 4.33;
    case 'yearly':
      return value / 12;
    case 'monthly':
    default:
      return value;
  }
};

export const getCategoryColor = (categoryId) => {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat ? cat.color : '#6b7280'; // default gray
};

export const getCategoryName = (categoryId) => {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat ? cat.name : 'Other';
};
