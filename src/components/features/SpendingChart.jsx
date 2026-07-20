import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';

export const SpendingChart = ({ subscriptions = [] }) => {
  const activeSubs = subscriptions.filter(s => s.status === 'active');

  // Generate 6 months historical spending trend
  const generateTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const data = [];

    // Calculate sum of active subscriptions today
    const currentTotal = activeSubs.reduce((acc, sub) => {
      let monthly = sub.cost;
      if (sub.billingCycle === 'yearly') monthly = sub.cost / 12;
      else if (sub.billingCycle === 'weekly') monthly = sub.cost * 4.33;
      return acc + monthly;
    }, 0);

    // Build historical points by introducing mock variance
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonthIdx - i + 12) % 12;
      
      // Calculate a value with slight variance to simulate growth/change
      const multiplier = 1 - (i * 0.08) + (Math.sin(monthIdx) * 0.03);
      const monthlySpend = Math.round(currentTotal * multiplier);

      data.push({
        month: months[monthIdx],
        Spend: monthlySpend
      });
    }

    return data;
  };

  const data = generateTrendData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-premium p-3 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-gray-400 text-xs font-medium">{payload[0].payload.month}</p>
          <p className="text-brand-purple font-bold text-sm mt-1">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.03)" 
            vertical={false} 
          />
          
          <XAxis 
            dataKey="month" 
            stroke="#64748b" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          
          <YAxis 
            stroke="#64748b" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `₹${value}`} 
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="Spend" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSpend)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
