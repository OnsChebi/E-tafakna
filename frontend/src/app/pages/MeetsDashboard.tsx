"use client";
import ClientList from "../components/ClientList";
import MeetingsCard from "../components/MeetingsCard";
import MeetingsToday from "../components/MeetingsToday";

export default function MeetsDashboard() {
  return (
    <main className="p-4 min-h-screen">
      {/* First Row - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MeetingsToday - Full width on mobile, half on medium, 2/4 on large */}
        <div className="md:col-span-2">
          <MeetingsToday />
        </div>

        {/* ClientList - Full width on mobile, 1/4 on large */}
        <div className="lg:col-span-1">
          <ClientList />
        </div>

        {/* Calendar - Placeholder */}
        <div className="lg:col-span-1 bg-gray-200 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
          Calendar (Placeholder)
        </div>
      </div>

      {/* Second Row - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
        {/* MeetingsCard - Full width on mobile, 3/4 on larger screens */}
        <div className="md:col-span-2 lg:col-span-3">
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

        {/* Reminder - Placeholder */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
          Reminder (Placeholder)
        </div>
      </div>
    </main>
  );
}
