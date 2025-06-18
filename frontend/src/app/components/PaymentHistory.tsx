'use client';

import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

type Payment = {
  id: number;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending';
  reference: string;
};

export const PaymentHistory: React.FC = () => {
  const mockPayments: Payment[] = [
    { id: 1, date: '2024-01-10', amount: 2500, method: 'Virement', status: 'completed', reference: 'VIR-001' },
    { id: 2, date: '2024-01-05', amount: 1800, method: 'Carte', status: 'completed', reference: 'CB-002' },
    { id: 3, date: '2024-01-01', amount: 3200, method: 'Virement', status: 'pending', reference: 'VIR-003' }
  ];

  // Format number with fr-FR locale and append " DT"
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' DT';

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(dateStr));

  return (
    <div className="bg-white  dark:bg-gray-800 p-6 rounded-xl  border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Historique des Paiements</h3>
        <button className="text-blue-500 text-sm hover:text-blue-600">Voir tout</button>
      </div>

      <div className="space-y-4">
        {mockPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  payment.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                }`}
              >
                {payment.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                <p className="text-sm text-gray-500">
                  {payment.method} • {payment.reference}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {payment.status === 'completed' ? 'Reçu' : 'En attente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
