"use client";

import { useState, useEffect } from "react";
import { Calendar, Folder, Notebook} from "lucide-react";
import { stat, CalendlyStats } from "../service/api";

import { MeetingTypesChart } from "../components/MeetingTypeChart";
import { WeeklyMeetingsChart } from "../components/WeeklyMeetings";
import { RecentActivity } from "../components/RecentCharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KeyMetricsGrid from "../components/KeyMetricGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const recentActivities = [
  { icon: <Notebook className="h-4 w-4" />, title: "New note added to Client XYZ", time: "2h ago" },
  { icon: <Folder className="h-4 w-4" />, title: "Case documents uploaded", time: "4h ago" },
  { icon: <Calendar className="h-4 w-4" />, title: "Meeting rescheduled with ABC Corp", time: "1d ago" },
];

// Converts full day names to short form
const convertToChartData = (apiData: { day: string; count: number }[]) => {
  const shortDayMap: { [key: string]: string } = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };

  const dayCounts: { [key: string]: number } = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  apiData.forEach(({ day, count }) => {
    const shortDay = shortDayMap[day];
    if (shortDay) {
      dayCounts[shortDay] = count;
    }
  });

  return Object.entries(dayCounts).map(([day, meetings]) => ({ day, meetings }));
};

export default function StatisticsDashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    meetings: 0,
    upcoming: 0,
    folders: 0,
  });

  const [weeklyMeetingsData, setWeeklyMeetingsData] = useState<
    { day: string; meetings: number }[]
  >([]);
  const [meetingTypesData, setMeetingTypesData] = useState<
    { type: string; count: number }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await stat.getStat();
      const data: CalendlyStats = res.data;

      setStats({
        clients: data.totalClients,
        meetings: data.todaysMeetings,
        upcoming: data.upcomingMeetings,
        folders: data.activeFolder,
      });

      setWeeklyMeetingsData(convertToChartData(data.weeklyMeetings || []));
      setMeetingTypesData(data.meetingTypes || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-muted/40 p-6 space-y-6 bg-white dark:bg-gray-900">
    {/* Header Section */}
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground dark:text-gray-100">Dashboard Analytics</h1>
      
    </div>
  
    {/* Key Metrics Grid */}
    <KeyMetricsGrid stats={stats} isLoading={isLoading}/>
  
    {/* Charts Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Meeting Types Chart */}
      <Card className="border-gray-300 hover:border-blue-800 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg dark:text-gray-100">Meeting Distribution</CardTitle>
          <CardDescription className="dark:text-gray-100">Breakdown by meeting type</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <MeetingTypesChart data={meetingTypesData} />
          )}
        </CardContent>
      </Card>
  
      {/* Recent Activity */}
      <Card className="border-gray-300 hover:border-blue-800">
        
          <RecentActivity activities={recentActivities} />
        
      </Card>
    </div>
  
    {/* Weekly Meetings Chart */}
    <Card className="border-gray-300 hover:border-blue-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg dark:text-gray-100">Weekly Meetings Trend</CardTitle>
            <CardDescription className="dark:text-gray-100">Daily meeting frequency</CardDescription>
          </div>
          
        </div>
      </CardHeader>
      <CardContent className="h-96">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : (
          <WeeklyMeetingsChart data={weeklyMeetingsData} isLoading={false}  />
        )}
      </CardContent>
    </Card>
  </div>
  );
}
