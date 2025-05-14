"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "./ActivityItem";

interface ActivityItem {
  icon: React.ReactNode;
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </CardContent>
  </Card>
);