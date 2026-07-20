import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import Subscriptions from '../pages/Subscriptions';
import AddSubscription from '../pages/AddSubscription';
import Analytics from '../pages/Analytics';
import Calendar from '../pages/Calendar';
import BudgetManager from '../pages/BudgetManager';
import Insights from '../pages/Insights';
import Settings from '../pages/Settings';
import Pricing from '../pages/Pricing';
import NotFound from '../pages/NotFound';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  // Public Landing Page
  {
    path: '/',
    element: <Landing />
  },
  // Public Auth Pages
  {
    path: '/auth',
    element: <Auth />
  },
  // Protected Dashboard Area
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'subscriptions',
        element: <Subscriptions />
      },
      {
        path: 'subscriptions/add',
        element: <AddSubscription />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'calendar',
        element: <Calendar />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'pricing',
        element: <Pricing />
      },
      {
        path: 'budget',
        element: <BudgetManager />
      },
      {
        path: 'insights',
        element: <Insights />
      }
    ]
  },
  // Catch All 404
  {
    path: '*',
    element: <NotFound />
  }
]);
