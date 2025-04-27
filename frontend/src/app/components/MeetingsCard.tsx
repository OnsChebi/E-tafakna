"use client";

import { useEffect, useState } from "react";
import { MeetingToday, upcomingMeeting,CalendlyEvent, Meeting as ApiMeeting } from "../service/api";
import ReschedulePopup from "./ReschedulePopup";

// Internal Meeting type for the card
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

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const responseUpcoming = await upcomingMeeting.getUpcomingMeetings();
        

        const upcomingMeetingsList: Meeting[] = responseUpcoming.data.events.map((event: ApiMeeting) => ({
          id: event.eventId,
          client: event.clientName,
          date: event.startTime,
          time: new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "upcoming",
        }));

        setUpcomingMeetings(upcomingMeetingsList);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const handleReschedule = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowReschedule(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg  p-6">
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

      {/* Meetings Table */}
      {activeTab === "recent" ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-200">
                <th className="pb-3 ">Client Name</th>
                <th className="pb-3">Meeting Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {recentMeetings.map((meeting) => (
                <tr key={meeting.id} className="border-b dark:border-gray-700">
                  <td className="py-3 dark:text-white ">{meeting.client}</td>
                  <td className="py-3">
                    <div className="flex flex-col ">
                      <span className="dark:text-white">{new Date(meeting.date).toLocaleDateString()}</span>
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
            <thead>
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
                      <span className="dark:text-white">{new Date(meeting.date).toLocaleDateString()}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {meeting.time}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleReschedule(meeting)}
                      className="px-3 py-1  bg-[#1366e8] text-white hover:bg-gray-300 dark:hover:bg-[#1158c7] rounded-lg shadow-md transition-colors "
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
