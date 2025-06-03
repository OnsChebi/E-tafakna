// components/MeetingsChart.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MeetingData = {
  label: string; // Can be day or month
  meetings: number;
};

interface MeetingsChartProps {
  data: MeetingData[];
  isLoading: boolean;
}

export const MeetingsChart: React.FC<MeetingsChartProps> = ({
  data,
  isLoading,
}) => {
  return (
    <div className="p-4 dark:bg-transparent">
      {isLoading ? (
        <div className="h-64 flex items-center justify-center animate-pulse">
          Loading chart...
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="meetings" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
