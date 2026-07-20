import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { router } from './router';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <RouterProvider router={router} />
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--theme-bg-card)',
                  color: 'var(--theme-text-primary)',
                  border: '1px solid var(--theme-border-primary)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '13px',
                  borderRadius: '12px'
                },
              }}
            />
          </SubscriptionProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
