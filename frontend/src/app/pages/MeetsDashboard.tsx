"use client"
import ClientList from "../components/ClientList";
import MeetingsToday from "../components/MeetingsToday";


export default function MeetsDashboard() {
  return (
    <main className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* First Row */}
      <div className="md:col-span-1">
        <MeetingsToday />
      </div>
      <div className="md:col-span-1">
        <ClientList />
      </div>
      
      
    </main>
  );
}