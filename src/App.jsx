import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ThemeProvider } from './context/ThemeContext';
import { router } from './router';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <RouterProvider router={router} />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(18, 18, 43, 0.9)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                fontSize: '13px',
                borderRadius: '12px'
              },
            }}
          />
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
