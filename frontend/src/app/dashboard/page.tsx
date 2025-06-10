"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  ClockIcon,
  MailIcon,
  UserIcon,
  VideoIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { adminOverview, calendlySync } from "../service/api";

type Meeting = {
  id: number;
  //eventId: string;
  startTime: string;
  endTime: string;
  inviteeName: string;
  inviteeEmail: string;
  type: "Online" | "In person";
  meetingUrl?: string;
  created_at: string;
  expert: {
    name: string;
    //email: string;
  };
};

export default function AdminDashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await adminOverview.getAdminOverview();
        console.log("Meetings fetched:", res.data);
        setMeetings(res.data);
      } catch (err: any) {
        console.error("Error loading meetings:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Meetings Overview
        </h1>
        

      {meetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {meeting.inviteeName}
                </h2>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-1 rounded-full ${
                    meeting.type === "Online"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {meeting.type}
                </Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                  <UserIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Expert: </span>
                    {meeting.expert.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                  <MailIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Client's Email: </span>
                    {meeting.inviteeEmail}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                  <CalendarIcon className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Date: </span>
                    {format(new Date(meeting.startTime), "PPP")}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                  <ClockIcon className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Time: </span>
                    {format(new Date(meeting.startTime), "p")} -{" "}
                    {format(new Date(meeting.endTime), "p")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                

                {meeting.type === "Online" && meeting.meetingUrl && (
                  <a
                    href={meeting.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full transition"
                  >
                    <VideoIcon className="w-4 h-4" />
                    Join Meeting
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
          No upcoming meetings found.
        </div>
      )}
    </div>
  );
}
