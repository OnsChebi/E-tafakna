"use client";

import { useState, useEffect } from "react";
import { CalendlyEvent, MeetingToday, clientApi, folderApi, recentMeeting, upcomingMeeting } from "../service/api";
import { Calendar, Folder, Notebook } from "lucide-react";
import { KeyMetricsGrid } from "../components/KeyMetricGrid";
import { MeetingTypesChart } from "../components/MeetingTypeChart";
import { UpcomingSchedule } from "../components/UpcomingSchedule";
//import { TaskProgress } from "../components/TaskProgress";
import { WeeklyMeetingsChart } from "../components/WeeklyMeetings";
import { RecentActivity } from "../components/RecentCharts";
import { Card } from "@/components/ui/card";

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

  const [weeklyMeetingsData, setWeeklyMeetingsData] = useState([
    { day: "Mon", meetings: 0 },
    { day: "Tue", meetings: 0 },
    { day: "Wed", meetings: 0 },
    { day: "Thu", meetings: 0 },
    { day: "Fri", meetings: 0 },
    { day: "Sat", meetings: 0 },
    { day: "Sun", meetings: 0 }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [meetingTypesData, setMeetingTypesData] = useState([
    { name: "Online", value: 0, fill: "#3B72F6" },
    { name: "In Person", value: 0, fill: "#10B981" }
  ]);

  const getWeeklyMeetings = (events: CalendlyEvent[]) => {
    const dayCounts: { [key: string]: number } = {
      "Mon": 0, "Tue": 0, "Wed": 0, 
      "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
    };

    events.forEach(event => {
      const date = new Date(event.startTime);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (dayCounts[day]) {
        dayCounts[day]++;
      }
    });

    return Object.entries(dayCounts).map(([day, meetings]) => ({
      day,
      meetings
    }));
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        clientsRes,
        todayMeetingsRes,
        upcomingRes,
        foldersRes,
        recentMeetingsRes
      ] = await Promise.all([
        clientApi.getClientListe(),
        MeetingToday.getTodaysMeetings(),
        upcomingMeeting.getUpcomingMeetings(),
        folderApi.getAll(),
        recentMeeting.getRecentMeetings()
      ]);

      const todayMeetings = todayMeetingsRes.data || [];
      const allMeetings = [
        ...(todayMeetingsRes.data || []),
        ...(recentMeetingsRes.data || [])
      ];

      setWeeklyMeetingsData(getWeeklyMeetings(allMeetings));

      // Safe type checking and counting meeting types
      const counts = todayMeetings.reduce((acc, meeting) => {
        const type = meeting.meetingType?.toLowerCase(); // Safely handle undefined
        if (type?.includes("online")) acc.online++;
        if (type?.includes("in person") || type?.includes("in-person")) acc.inPerson++;
        return acc;
      }, { online: 0, inPerson: 0 });

      setMeetingTypesData([
        { name: "Online", value: counts.online, fill: "#3B72F6" },
        { name: "In Person", value: counts.inPerson, fill: "#10B981" }
      ]);

      setStats({
        clients: clientsRes.data?.length || 0,
        meetings: todayMeetings.length,
        upcoming: upcomingRes.data?.length || 0,
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
        {isLoading ? (
          <Card className="h-64 flex items-center justify-center">
            <div className="animate-pulse">Loading meeting data...</div>
          </Card>
        ) : (
          <MeetingTypesChart data={meetingTypesData} />
        )}
        <UpcomingSchedule schedule={upcomingScheduleData} />
        {/* <TaskProgress tasks={tasksData} /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyMeetingsChart data={[]}          // data={weeklyMeetingsData} 
          // onRefresh={fetchStats}
          // isLoading={isLoading}
        />
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
}
