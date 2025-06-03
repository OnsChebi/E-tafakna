import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Download } from 'lucide-react';

export const RevenueChart = () => {
  const mockRevenueData = [
    { date: '2024-01-01', amount: 2500, meetings: 5 },
    { date: '2024-01-02', amount: 1200, meetings: 3 },
    { date: '2024-01-03', amount: 3200, meetings: 7 },
    { date: '2024-01-04', amount: 1800, meetings: 4 },
    { date: '2024-01-05', amount: 2900, meetings: 6 },
    { date: '2024-01-06', amount: 2100, meetings: 5 },
    { date: '2024-01-07', amount: 3500, meetings: 8 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenus des 30 derniers jours</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockRevenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            formatter={(value) => [`${value}DT`, 'Revenus']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};