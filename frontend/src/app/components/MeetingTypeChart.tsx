"use client";

import { PieChart, Pie, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface MeetingTypesChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export const MeetingTypesChart = ({ data }: MeetingTypesChartProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Meeting Types</CardTitle>
    </CardHeader>
    <CardContent className="h-64">
      <PieChart width={300} height={200}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </CardContent>
  </Card>
);