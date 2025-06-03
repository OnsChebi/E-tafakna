"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "../ActivityItem";

interface ActivityItem {
  icon: React.ReactNode;
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => (
  <div className="p-6">
      <h2 className="text-lg dark:text-gray-100 font-semibold mb-7">Recent Activity</h2>
    
    <CardContent>
      <div className="space-y-4 dark:text-gray-100">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </CardContent>
  </div>
);