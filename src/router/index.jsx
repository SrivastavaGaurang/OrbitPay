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
import Simulator from '../pages/Simulator';
import BillSplitter from '../pages/BillSplitter';
import ZombieRadar from '../pages/ZombieRadar';
import Achievements from '../pages/Achievements';
import Settings from '../pages/Settings';
import Pricing from '../pages/Pricing';
import NotFound from '../pages/NotFound';
import Presentation from '../pages/Presentation';
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
        path: 'budget',
        element: <BudgetManager />
      },
      {
        path: 'insights',
        element: <Insights />
      },
      {
        path: 'simulator',
        element: <Simulator />
      },
      {
        path: 'split',
        element: <BillSplitter />
      },
      {
        path: 'radar',
        element: <ZombieRadar />
      },
      {
        path: 'achievements',
        element: <Achievements />
      },
      {
        path: 'presentation',
        element: <Presentation />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'pricing',
        element: <Pricing />
      }
    ]
  },
  // Catch All 404
  {
    path: '*',
    element: <NotFound />
  }
]);
