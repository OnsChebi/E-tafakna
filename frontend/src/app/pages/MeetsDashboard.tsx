"use client"
// import ClientList from "../components/ClientList";
import MeetingsToday from "../components/MeetingsToday";


export default function MeetsDashboard() {
  return (
    <main className="p-2 grid grid-cols-1 md:grid-rows-3 md:grid-cols-2 gap-3">
      {/* First Row */}
      <div className="md:col-span-1">
        <MeetingsToday />
      </div>
      {/* <div className="md:col-span-1">
        <ClientList />
      </div> */}
      
      {/* Second Row - Calendar */}
      <div className="md:col-span-2">
        <div className="h-96 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Calendar</h2>
          <div className="border rounded-lg p-4 h-[calc(100%-48px)] dark:border-gray-700">
            {/* Calendar component */}
          </div>
        </div>
      </div>
    </main>
  );
}