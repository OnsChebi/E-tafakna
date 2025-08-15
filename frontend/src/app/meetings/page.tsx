'use client';

import { useEffect, useState, useCallback } from "react";
import ClientList from "../components/ClientList";
import MeetingsCard from "../components/MeetingsCard";
import MeetingsToday from "../components/MeetingsToday";
import { Meeting,  calendlyApi} from "../service/calendly";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authApi} from "../service/auth";
import { RotateCw } from "lucide-react"; 

export default function MeetsDashboard() {
  const router = useRouter();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setAuthChecked(true);
      calendlyApi
        .getUpcomingMeetings()
        .then((res) => setUpcomingMeetings(res.data))
        .catch((err) => console.error("Error fetching meetings:", err));
    }
  }, [router]);

  const handleSync = useCallback(async () => {
    if (syncing) return; 
    setSyncing(true);
    try {
      const response = await calendlyApi.syncMeetings();
      setSyncMessage(response.data.message || "Synced successfully!");
    } catch (error) {
      console.error("Sync failed", error);
      setSyncMessage("Sync failed (check your connection)");
    } finally {
      setTimeout(() => {
        setSyncMessage(null);
      }, 3000);
      setSyncing(false); 
    }
  }, [syncing]);

  if (!authChecked) {
    return <div className="p-4 text-gray-500">Checking authentication...</div>;
  }

  if (!authApi.isAuthenticated()) {
    return <div className="p-4 text-red-500">Unauthorized</div>;
  }

  return (
    <main className="p-2 min-h-screen dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Meetings Tracking
        </h1>
        <Button
          variant="ghost"
          onClick={handleSync}
          disabled={syncing} // <-- disable while syncing
          className="text-white bg-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700 p-4"
        >
          <RotateCw className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {syncMessage && (
        <div className="text-sm text-green-600 dark:text-green-400 mb-4">
          {syncMessage}
        </div>
      )}

      {/* Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="sm:col-span-2 flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-full">
            <MeetingsToday />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-full">
            <ClientList />
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-full">
            <MeetingsCard />
          </div>
        </div>
      </div>
    </main>
  );
}
