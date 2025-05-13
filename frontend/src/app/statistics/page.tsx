"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Video, TrendingUp, RefreshCw, Folder, Notebook, Calendar, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, BarChart, Bar } from "recharts";
import { MeetingToday, clientApi, folderApi, noteApi, upcomingMeeting } from "../service/api";

export default function StatisticsDashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    meetings: 0,
    upcoming: 0,
    folders: 0,
   
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [
        clientsRes, 
        todayMeetingsRes, 
        upcomingRes,
        foldersRes,
        
      ] = await Promise.all([
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

  const formatNumber = (num: number) => num.toLocaleString("en-US");

  const meetingTypes = [
    { name: "Online", value: 65, fill: "#3B72F6" },
    { name: "In Person", value: 35, fill: "#10B981" }
  ];

  const upcomingSchedule = [
    { time: "9:00 AM", client: "John Doe", type: "Consultation" },
    { time: "2:30 PM", client: "Acme Corp", type: "Contract Review" },
    { time: "4:00 PM", client: "Jane Smith", type: "Follow-up" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 pt-1">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
        <StatCard
          title="Total Clients"
          value={stats.clients}
          icon={<Users />}
          trend={8.2}
          isLoading={isLoading}
          refresh={fetchStats}
        />
        <StatCard
          title="Today's Meetings"
          value={stats.meetings}
          icon={<Video />}
          trend={-2.1}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Folders"
          value={stats.folders}
          icon={<Folder />}
          trend={12.5}
          isLoading={isLoading}
        />
        
      </div>

      {/* Main Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Meeting Type Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Meeting Types
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <PieChart width={300} height={200}>
              <Pie
                data={meetingTypes}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedule.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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

        {/* Task Completion */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Task Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressBar label="Client Documentation" value={75} />
              <ProgressBar label="Case Research" value={45} />
              <ProgressBar label="Billing Reports" value={90} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Frequency Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                Weekly Appointments
              </CardTitle>
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              width={500}
              height={300}
              data={[
                { day: "Mon", meetings: 12 },
                { day: "Tue", meetings: 15 },
                { day: "Wed", meetings: 8 },
                { day: "Thu", meetings: 20 },
                { day: "Fri", meetings: 18 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="meetings" fill="#3B72F6" />
            </BarChart>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem 
                icon={<Notebook className="h-4 w-4" />}
                title="New note added to Client XYZ"
                time="2h ago"
              />
              <ActivityItem
                icon={<Folder className="h-4 w-4" />}
                title="Case documents uploaded"
                time="4h ago"
              />
              <ActivityItem
                icon={<Calendar className="h-4 w-4" />}
                title="Meeting rescheduled with ABC Corp"
                time="1d ago"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, trend, isLoading, refresh }: any) => (
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
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {typeof value === 'number' ? value.toLocaleString() : value}
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

const ProgressBar = ({ label, value }: any) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-gray-500">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, time }: any) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
      {icon}
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  </div>
);