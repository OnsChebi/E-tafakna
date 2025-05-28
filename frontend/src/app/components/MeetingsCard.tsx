"use client";

import { useEffect, useState } from "react";
import {
  upcomingMeeting,
  Meeting as ApiMeeting,
  recentMeeting,
  cancelMeeting,
} from "../service/api";
import CancelPopup from "./CancelPopup";

type Meeting = {
  id: string;
  client: string;
  date: string;
  time: string;
  type: "recent" | "upcoming";
  email?: string;
  meetingUrl?: string;
};

const MeetingsCard = () => {
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "upcoming">("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelMeetingId, setCancelMeetingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        const [responseUpcoming, responseRecent] = await Promise.all([
          upcomingMeeting.getUpcomingMeetings(),
          recentMeeting.getRecentMeetings(),
        ]);
         //console.log("Upcoming meetings daaataaaa:", responseUpcoming.data);
        // console.log("Upcoming meetings eveeeeeeent:", responseUpcoming.data.events);
        //console.log("Recent meetings daaaataaaa:", responseRecent.data);
        //console.log("Recent meetings eveeeeeent:", responseRecent.data);
        

        const processMeeting = (event: ApiMeeting, type: Meeting["type"]) => ({
          id: event.eventId,
          client: event.inviteeName,
          date: event.startTime,
          time: new Date(event.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          type,
          email: event.inviteeEmail,
        });

        setUpcomingMeetings(
          responseUpcoming.data.map((event: ApiMeeting) =>
            processMeeting(event, "upcoming")
          )
        );

        setRecentMeetings(
          responseRecent.data.map((event: ApiMeeting) =>
            processMeeting(event, "recent")
          )
        );
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleCancel = (meetingId: string) => {
    setCancelMeetingId(meetingId);
    setShowCancelPopup(true);
  };

  const confirmCancel = async (reason: string) => {
    if (!cancelMeetingId) return;
    try {
      await cancelMeeting.cancel(cancelMeetingId, reason);
      setUpcomingMeetings((prev) =>
        prev.filter((meeting) => meeting.id !== cancelMeetingId)
      );
    } catch (error) {
      console.error("Failed to cancel meeting:", error);
    } finally {
      setShowCancelPopup(false);
      setCancelMeetingId(null);
    }
  };

  const currentMeetings = activeTab === "recent" ? recentMeetings : upcomingMeetings;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-[265px] flex flex-col">
      {/* Tabs */}
      <div className="flex gap-4 border-b dark:border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab("recent")}
          className={`pb-2 px-4 text-sm font-medium transition-colors ${
            activeTab === "recent"
              ? "border-b-2 border-blue-500 text-blue-500 dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Recent Meetings
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-2 px-4 text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-500 dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Upcoming Meetings
        </button>
      </div>

      {/* Scrollable Meetings Table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : currentMeetings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            {activeTab === "recent" ? "No recent meetings" : "No upcoming meetings"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white dark:bg-gray-800">
              <tr className="text-left text-gray-500 dark:text-gray-300">
                <th className="pb-2">Client Name</th>
                <th className="pb-2">Date & Time</th>
                {activeTab === "upcoming" && <th className="pb-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentMeetings.map((meeting) => (
                <tr key={meeting.id} className="border-b dark:border-gray-700">
                  <td className="py-2 dark:text-white">{meeting.client}</td>
                  <td className="py-2">
                    <div className="flex flex-col">
                      <span className="dark:text-white">
                        {new Date(meeting.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {meeting.time}
                      </span>
                    </div>
                  </td>
                  {activeTab === "upcoming" && (
                    <td className="py-2">
                      <button
                        onClick={() => handleCancel(meeting.id)}
                        className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded-md text-xs shadow transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && cancelMeetingId && (
        <CancelPopup
          meetingId={cancelMeetingId}
          onClose={() => setShowCancelPopup(false)}
          onConfirm={confirmCancel}
        />
      )}
    </div>
  );
};

export default MeetingsCard;