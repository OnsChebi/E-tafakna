"use client";

import { useState, useEffect } from "react";
import { Calendar, Folder, Notebook } from "lucide-react";
import { stat, CalendlyStats } from "../service/api";
import { MeetingTypesChart } from "../components/charts/MeetingTypeChart";
import { RecentActivity } from "../components/charts/RecentCharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KeyMetricsGrid from "../components/KeyMetricGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingsChart } from "../components/charts/MeetingsChart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const recentActivities = [
  {
    icon: <Notebook className="h-4 w-4" />,
    title: "New note added to Client XYZ",
    time: "2h ago",
  },
  {
    icon: <Folder className="h-4 w-4" />,
    title: "Case documents uploaded",
    time: "4h ago",
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    title: "Meeting rescheduled with ABC Corp",
    time: "1d ago",
  },
];

const shortDayMap: { [key: string]: string } = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

const shortMonthMap: { [key: string]: string } = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

function convertToWeeklyChartData(apiData: { day: string; count: number }[]) {
  const fullDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    if (shortDay) dayCounts[shortDay] = count;
  });

  return fullDays.map((day) => ({
    day,
    meetings: dayCounts[day],
    label: day,
  }));
}

function convertToMonthlyChartData(apiData: { month: string; count: number }[]) {
  const fullMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthCounts: { [key: string]: number } = Object.fromEntries(
    fullMonths.map((m) => [m, 0])
  );

  apiData.forEach(({ month, count }) => {
    const shortMonth = shortMonthMap[month] || month;
    if (shortMonth in monthCounts) {
      monthCounts[shortMonth] = count;
    }
  });

  return fullMonths.map((month) => ({
    day: month,
    meetings: monthCounts[month],
    label: month,
  }));
}

export default function StatisticsDashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    meetings: 0,
    upcoming: 0,
    folders: 0,
  });

  const [weeklyData, setWeeklyData] = useState<
    { day: string; meetings: number; label: string }[]
  >([]);

  const [monthlyData, setMonthlyData] = useState<
    { day: string; meetings: number; label: string }[]
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

      setWeeklyData(convertToWeeklyChartData(data.weeklyMeetings || []));
      setMonthlyData(convertToMonthlyChartData(data.monthlyMeetings || []));
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
    <div className="min-h-screen bg-muted/40 p-6 space-y-6 bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground dark:text-gray-100">
          Dashboard Analytics
        </h1>
      </div>

      {/* Key Stats */}
      <KeyMetricsGrid stats={stats} isLoading={isLoading} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-gray-300 hover:border-blue-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg dark:text-gray-100">
              Meeting Distribution
            </CardTitle>
            <CardDescription className="dark:text-gray-100">
              Breakdown by meeting type
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <MeetingTypesChart data={meetingTypesData} />
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-300 hover:border-blue-800">
          <RecentActivity activities={recentActivities} />
        </Card>
      </div>

      {/* Weekly / Monthly Chart Tabs */}
      <Card className="border-gray-300 hover:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg dark:text-gray-100">
                Meetings Over Time
              </CardTitle>
              <CardDescription className="dark:text-gray-100">
                Compare meeting trends weekly vs. monthly
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[28rem]">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <Tabs defaultValue="weekly" className="w-full h-full">
              <TabsList className="mb-4 dark:text-white ">
                <TabsTrigger className="hover:bg-slate-500" value="weekly">Weekly</TabsTrigger>
                <TabsTrigger className="hover:bg-slate-500" value="monthly">Monthly</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="h-full">
                <MeetingsChart data={weeklyData} isLoading={false} />
              </TabsContent>

              <TabsContent value="monthly" className="h-full">
                <MeetingsChart data={monthlyData} isLoading={false} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
