'use client';

import React from 'react';
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  CheckCircle,
  Wallet
} from 'lucide-react';

type SummaryCardsProps = {
  dateFilter: string;
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({ dateFilter }) => {
  const totalRevenue = 4525;
  const totalPayments = 3890;
  const balance = totalRevenue - totalPayments;
  const growth = 12.5;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' DT';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Revenus Totaux */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Revenus Totaux</p>
            <p className="text-3xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+{growth}%</span>
            </div>
          </div>
          <div className="bg-blue-500 p-3 rounded-lg">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Paiements Reçus */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Paiements Reçus</p>
            <p className="text-3xl font-bold text-green-900">{formatCurrency(totalPayments)}</p>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">À jour</span>
            </div>
          </div>
          <div className="bg-green-500 p-3 rounded-lg">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Solde Disponible */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Solde Disponible</p>
            <p className="text-3xl font-bold text-purple-900">{formatCurrency(balance)}</p>
            <div className="flex items-center mt-2">
              <Wallet className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-600 ml-1">Disponible</span>
            </div>
          </div>
          <div className="bg-purple-500 p-3 rounded-lg">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
