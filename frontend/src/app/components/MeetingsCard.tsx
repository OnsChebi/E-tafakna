"use client";

import { useEffect, useState } from "react";
import { upcomingMeeting, Meeting as ApiMeeting, recentMeeting } from "../service/api";
import ReschedulePopup from "./ReschedulePopup";

type Meeting = {
  id: string;
  client: string;
  date: string;
  time: string;
  type: "recent" | "upcoming";
};

const MeetingsCard = () => {
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "upcoming">("recent");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        const [responseUpcoming, responseRecent] = await Promise.all([
          upcomingMeeting.getUpcomingMeetings(),
          recentMeeting.getRecentMeetings()
        ]);

        const processMeeting = (event: ApiMeeting, type: Meeting["type"]) => ({
          id: event.eventId,
          client: event.clientName,
          date: event.startTime,
          time: new Date(event.startTime).toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true
          }),
          type,
        });

        setUpcomingMeetings(
          responseUpcoming.data.events.map((event: ApiMeeting) => 
            processMeeting(event, "upcoming"))
        );

        setRecentMeetings(
          responseRecent.data.events.map((event: ApiMeeting) => 
            processMeeting(event, "recent"))
        );
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleReschedule = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowReschedule(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 h-[265px] flex flex-col">
      {/* Tabs */}
      <div className="flex gap-4 border-b dark:border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab("recent")}
          className={`pb-2 px-4 ${
            activeTab === "recent"
              ? "border-b-2 border-blue-500 text-blue-500 dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Recent Meetings
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-2 px-4 ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-500 dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Upcoming Meetings
        </button>
      </div>

      {/* Scrollable Meetings Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === "recent" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                <tr className="text-left text-gray-500 dark:text-gray-200">
                  <th className="pb-3">Client Name</th>
                  <th className="pb-3">Meeting Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recentMeetings.map((meeting) => (
                  <tr key={meeting.id} className="border-b dark:border-gray-700">
                    <td className="py-3 dark:text-white">{meeting.client}</td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="dark:text-white">
                          {new Date(meeting.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {meeting.time}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                <tr className="text-left text-gray-500 dark:text-gray-200">
                  <th className="pb-3">Client Name</th>
                  <th className="pb-3">Meeting Date & Time</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingMeetings.map((meeting) => (
                  <tr key={meeting.id} className="border-b dark:border-gray-700">
                    <td className="py-3 dark:text-white">{meeting.client}</td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="dark:text-white">
                          {new Date(meeting.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {meeting.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleReschedule(meeting)}
                        className="px-3 py-1 bg-[#1366e8] text-white hover:bg-gray-300 dark:hover:bg-[#1158c7] rounded-lg shadow-md transition-colors"
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Popup */}
      {showReschedule && selectedMeeting && (
        <ReschedulePopup
          meeting={selectedMeeting}
          onClose={() => setShowReschedule(false)}
          onConfirm={(newDate) => {
            console.log("Rescheduled to:", newDate);
            setShowReschedule(false);
          }}
        />
      )}
    </div>
  );
};

export default MeetingsCard;