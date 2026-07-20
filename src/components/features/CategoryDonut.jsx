import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import { CATEGORIES } from '../../utils/constants';

export const CategoryDonut = ({ categorySpend = {} }) => {
  // Transform categorySpend object into Recharts array data
  const data = Object.keys(categorySpend).map(key => {
    const categoryInfo = CATEGORIES.find(c => c.id === key) || { name: 'Other', color: '#6b7280' };
    return {
      name: categoryInfo.name,
      value: Math.round(categorySpend[key]),
      color: categoryInfo.color
    };
  }).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-premium p-3 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-white font-bold text-xs font-display">{payload[0].name}</p>
          <p className="text-brand-cyan font-bold text-sm mt-1">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col gap-2 text-xs text-gray-400">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium text-gray-300">{entry.value}:</span>
            <span>{formatCurrency(entry.payload.value)}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (data.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center text-gray-500 text-sm">
        No active subscription data.
      </div>
    );
  }

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="middle" 
            align="right" 
            layout="vertical"
            content={renderLegend}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
