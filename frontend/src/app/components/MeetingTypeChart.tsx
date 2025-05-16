"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface MeetingTypesChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export const MeetingTypesChart = ({ data }: MeetingTypesChartProps) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Meeting Types</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No meetings today
          </div>
        )}
      </CardContent>
    </Card>
  );
};