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
import { Card } from "@/components/ui/card";

type WeeklyMeeting = {
  day: string;
  meetings: number;
};

interface WeeklyMeetingsChartProps {
  data: WeeklyMeeting[];
  isLoading: boolean;
  
}

export const WeeklyMeetingsChart: React.FC<WeeklyMeetingsChartProps> = ({
  data,
  isLoading,
}) => {
  return (
    <div className="p-4  dark:bg-transparent">
      

      {isLoading ? (
        <div className="h-64 flex items-center justify-center animate-pulse">
          Loading chart...
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
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
