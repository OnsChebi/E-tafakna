"use client";

import { TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  isLoading: boolean;
  refresh?: () => void;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  isLoading,
  refresh
}: StatCardProps) => (
  <Card className="hover:shadow-lg transition-shadow group">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            {refresh && (
              <button
                onClick={refresh}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {value.toLocaleString()}
              </span>
              <span
                className={`flex items-center text-sm ${
                  trend > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend > 0 ? '+' : ''}
                {trend}%
                <TrendingUp className={`h-4 w-4 ml-1 ${trend > 0 ? '' : 'rotate-180'}`} />
              </span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);