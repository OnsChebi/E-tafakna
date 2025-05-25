"use client";

import { Users, CalendarCheck, FolderOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  stats: {
    clients: number;
    meetings: number;
    folders: number;
    upcoming: number;
  };
  isLoading: boolean;
  
};

const statsConfig = [
  {
    label: "Total Clients",
    icon: Users,
    key: "clients",
    color: "text-blue-600",
  },
  {
    label: "Today’s Meetings",
    icon: CalendarCheck,
    key: "meetings",
    color: "text-green-600",
  },
  {
    label: "Active Folders",
    icon: FolderOpen,
    key: "folders",
    color: "text-yellow-600",
  },
  {
    label: "Upcoming Meetings",
    icon: Clock,
    key: "upcoming",
    color: "text-purple-600",
  },
];

export default function KeyMetricsGrid({ stats, isLoading}: Props) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Key Metrics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map(({ label, icon: Icon, key, color }) => (
          <Card key={key} className="border-gray-300 hover:border-blue-800">
            <CardContent className="flex items-center p-4 space-x-4">
              <div className={`p-2 rounded-full bg-opacity-10 ${color}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <span className="block w-10 h-6bg-gray-100 dark:bg-gray-700 animate-pulse rounded" />
                  ) : (
                    stats[key as keyof typeof stats]
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
