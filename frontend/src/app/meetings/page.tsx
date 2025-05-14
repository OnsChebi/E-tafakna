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

  //const [recentMeetings,setRecentMeetings]=useState<Meeting[]>([]);
  const [upcomingMeetings,setUpcomingMeetings]=useState<Meeting[]>([]);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }else{
      upcomingMeeting.getUpcomingMeetings().then(res => {
        //console.log("Upcoming Meetings API response:", res.data);
        setUpcomingMeetings(res.data.events);
      });
      
    }
  }, [router]);

  if(!isAuthenticated()){
    return <div>Unauthorized</div>;
  }
  return (
    <main className="p-4 min-h-screen bg-gray-200 dark:bg-gray-700">
      {/* First Row - Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Meetings Today - Takes 2/4 on medium screens */}
        <div className="md:col-span-2 flex flex-col h-full min-h-[200px]">
          <MeetingsToday />
        </div>

        {/* Client List - Takes 1/4 on medium screens */}
        <div className="md:col-span-1 flex flex-col h-full min-h-[200px]">
          <ClientList />
        </div>

        {/* Calendar Section + Button */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Calendar</h2>
            <div className="h-[calc(100%-2.5rem)] grid place-items-center text-gray-400">
              Calendar Content
            </div>
          </div>
          <button className="w-full h-12 bg-[#1366e8] text-white hover:bg-gray-300 dark:hover:bg-[#1158c7] rounded-lg shadow-md transition-colors">
            Create Meet
          </button>
        </div>
      </div>

      {/* Second Row - Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {/* Meetings Card - Takes 3/4 on larger screens */}
        <div className="md:col-span-3 flex flex-col h-full min-h-[200px]">
          {/* <MeetingsCard/> */}
        </div>

        {/* Reminders - Takes 1/4 on larger screens */}
        <div className="md:col-span-1 flex flex-col h-full min-h-[200px]">
          {/* <ReminderCard /> */}
        </div>
      </div>
    </main>
  );
}