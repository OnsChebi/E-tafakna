'use client';

import { useEffect, useState } from "react";
import ClientList from "../components/ClientList";
import MeetingsCard from "../components/MeetingsCard";
import MeetingsToday from "../components/MeetingsToday";
import { Meeting, isAuthenticated, upcomingMeeting } from "../service/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";

export default function MeetsDashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setAuthChecked(true);
      upcomingMeeting
        .getUpcomingMeetings()
        .then((res) => setUpcomingMeetings(res.data))
        .catch((err) => console.error("Error fetching meetings:", err));
    }
  }, [router]);

  if (!authChecked) {
    return <div className="p-4 text-gray-500">Checking authentication...</div>;
  }

  if (!isAuthenticated()) {
    return <div className="p-4 text-red-500">Unauthorized</div>;
  }

  return (
    <main className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Meetings Today */}
        <div className="sm:col-span-2 flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full">
            <MeetingsToday />
          </div>
        </div>

        {/* Client List */}
        <div className="flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full">
            <ClientList />
          </div>
        </div>

        {/* Calendar + Button */}
        {/* <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Calendar</h2>
            <div className="flex justify-center">
              <ShadCalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow-sm"
              />
            </div>
          </div>
          <Button
  onClick={() => router.push("/calendar")}
  className="h-12 w-full bg-[#1366e8] hover:bg-[#1158c7] text-white rounded-lg shadow-md transition-colors"
>
  Create Meet
</Button>

        </div> */}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Meeting Cards */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full">
            <MeetingsCard />
          </div>
        </div>
      </div>
    </main>
  );
}
