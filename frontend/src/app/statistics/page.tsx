"use client";

import { useState, useEffect } from "react";

import { MeetingToday, clientApi, folderApi} from "../service/api";
import { Calendar, Folder, Notebook } from "lucide-react";
import { KeyMetricsGrid } from "../components/KeyMetricGrid";
import { MeetingTypesChart } from "../components/MeetingTypeChart";
import { UpcomingSchedule } from "../components/UpcomingSchedule";
import { TaskProgress } from "../components/TaskProgress";
import { WeeklyMeetingsChart } from "../components/WeeklyMeetings";
import { RecentActivity } from "../components/RecentCharts";

const meetingTypesData = [
  { name: "Online", value: 65, fill: "#3B72F6" },
  { name: "In Person", value: 35, fill: "#10B981" }
];

const upcomingScheduleData = [
  { time: "9:00 AM", client: "John Doe", type: "Consultation" },
  { time: "2:30 PM", client: "Acme Corp", type: "Contract Review" },
  { time: "4:00 PM", client: "Jane Smith", type: "Follow-up" }
];

const tasksData = [
  { label: "Client Documentation", value: 75 },
  { label: "Case Research", value: 45 },
  { label: "Billing Reports", value: 90 }
];

const weeklyMeetingsData = [
  { day: "Mon", meetings: 12 },
  { day: "Tue", meetings: 15 },
  { day: "Wed", meetings: 8 },
  { day: "Thu", meetings: 20 },
  { day: "Fri", meetings: 18 }
];

const recentActivities = [
  { 
    icon: <Notebook className="h-4 w-4" />,
    title: "New note added to Client XYZ",
    time: "2h ago"
  },
  {
    icon: <Folder className="h-4 w-4" />,
    title: "Case documents uploaded",
    time: "4h ago"
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    title: "Meeting rescheduled with ABC Corp",
    time: "1d ago"
  }
];

export default function StatisticsDashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    meetings: 0,
    upcoming: 0,
    folders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [clientsRes, todayMeetingsRes, upcomingRes, foldersRes] = await Promise.all([
        clientApi.getClientListe(),
        MeetingToday.getTodaysMeetings(),
        upcomingMeeting.getUpcomingMeetings(),
        folderApi.getAll(),
      ]);

      setStats({
        clients: clientsRes.data.clients?.length || 0,
        meetings: todayMeetingsRes.data.events?.length || 0,
        upcoming: upcomingRes.data.events?.length || 0,
        folders: foldersRes.data?.length || 0
      });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 pt-1">
      <KeyMetricsGrid 
        stats={stats} 
        isLoading={isLoading} 
        onRefresh={fetchStats} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MeetingTypesChart data={meetingTypesData} />
        <UpcomingSchedule schedule={upcomingScheduleData} />
        <TaskProgress tasks={tasksData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyMeetingsChart 
          data={weeklyMeetingsData} 
          onRefresh={fetchStats}
          isLoading={isLoading}
        />
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
}