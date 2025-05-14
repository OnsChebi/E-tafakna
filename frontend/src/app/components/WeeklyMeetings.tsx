"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface WeeklyMeetingsChartProps {
  data: Array<{ day: string; meetings: number }>;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const WeeklyMeetingsChart = ({ 
  data, 
  onRefresh, 
  isLoading 
}: WeeklyMeetingsChartProps) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">Weekly Appointments</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="h-80">
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="meetings" fill="#3B72F6" />
      </BarChart>
    </CardContent>
  </Card>
);