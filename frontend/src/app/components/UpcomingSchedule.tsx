"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ScheduleItem {
  time: string;
  client: string;
  type: string;
}

interface UpcomingScheduleProps {
  schedule: ScheduleItem[];
}

export const UpcomingSchedule = ({ schedule }: UpcomingScheduleProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div>
              <p className="font-medium">{item.time}</p>
              <p className="text-sm text-gray-500">{item.client}</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm rounded">
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);