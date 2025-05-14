"use client";
import { useEffect, useState } from "react";
import ClientList from "../components/ClientList";
import MeetingsCard from "../components/MeetingsCard";
import MeetingsToday from "../components/MeetingsToday";
import ReminderCard from "../components/ReminderCard";
import { Meeting, isAuthenticated, upcomingMeeting } from "../service/api";
import { useRouter } from "next/navigation";

export default function MeetsDashboard() {
  const router = useRouter();
    const [recentMeetings,setRecentMeetings]=useState<Meeting[]>([]);

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
        .then((res) => {
          setUpcomingMeetings(res.data.events);
        })
        .catch((err) => {
          console.error("Error fetching meetings:", err);
        });
    }
  }, [router]);

  if (!authChecked) {
    return <div className="p-4 text-gray-500">Checking authentication...</div>;
  }

  if (!isAuthenticated()) {
    return <div className="p-4 text-red-500">Unauthorized</div>;
  }

  return (
    <main className="p-4 min-h-screen bg-gray-200 dark:bg-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 flex flex-col h-full min-h-[200px]">
          <MeetingsToday />
        </div>

        <div className="md:col-span-1 flex flex-col h-full min-h-[200px]">
          <ClientList />
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
          {/* <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Calendar</h2>
            <div className="h-[calc(100%-2.5rem)] grid place-items-center text-gray-400">
              Calendar Content
            </div>
          </div>
          <button className="w-full h-12 bg-[#1366e8] text-white hover:bg-gray-300 dark:hover:bg-[#1158c7] rounded-lg shadow-md transition-colors">
            Create Meet
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="md:col-span-3 flex flex-col h-full min-h-[200px]">
          {/* <MeetingsCard /> */}
        </div>
        <div className="md:col-span-1 flex flex-col h-full min-h-[200px]">
          {/* <ReminderCard /> */}
        </div>
      </div>
    </main>
  );
}
