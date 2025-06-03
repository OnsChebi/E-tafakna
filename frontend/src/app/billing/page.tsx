'use client';
import { useState } from "react";
import { MeetingsTable } from "../components/MeetingTables";
import { PaymentHistory } from "../components/PaymentHistory";
import { RevenueChart } from "../components/charts/RevenueChart";
import { SummaryCards } from "../components/charts/SymmaryCards";

const LawyerBillingDashboard = () => {
    const [dateFilter] = useState('month');
  
    return (
      <div className="min-h-screen bg-transparent p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Revenus</h1>
          </div>
  
         
          {/* Summary Cards */}
          <SummaryCards dateFilter={dateFilter} />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>
            <PaymentHistory />
          </div>
  
          {/* Meetings Table */}
          <div className="mb-8">
            <MeetingsTable />
          </div>
  
          
        </div>
      </div>
    );
  };
  
  export default LawyerBillingDashboard;