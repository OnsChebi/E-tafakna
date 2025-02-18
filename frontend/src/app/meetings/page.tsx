"use client";
import ClientList from "../components/ClientList";
import MeetingsCard from "../components/MeetingsCard";
import MeetingsToday from "../components/MeetingsToday";
import ReminderCard from "../components/ReminderCard";

export default function MeetsDashboard() {
  return (
    <main className="p-4 min-h-screen bg-gray-200 dark:bg-gray-100">
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
          <button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors">
            Create Meet
          </button>
        </div>
      </div>

      {/* Second Row - Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {/* Meetings Card - Takes 3/4 on larger screens */}
        <div className="md:col-span-3 flex flex-col h-full min-h-[200px]">
          <MeetingsCard
            recentMeetings={[
              { id: "1", client: "Client A", date: "2024-03-20", time: "10:00 AM", type: "recent" },
              { id: "2", client: "Client B", date: "2024-03-21", time: "11:00 AM", type: "recent" },
            ]}
            upcomingMeetings={[
              { id: "3", client: "Client C", date: "2024-03-25", time: "12:00 PM", type: "upcoming" },
              { id: "4", client: "Client D", date: "2024-03-26", time: "1:00 PM", type: "upcoming" },
            ]}
          />
        </div>

        {/* Reminders - Takes 1/4 on larger screens */}
        <div className="md:col-span-1 flex flex-col h-full min-h-[200px]">
          <ReminderCard />
        </div>
      </div>
    </main>
  );
}