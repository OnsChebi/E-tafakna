"use client";
import { useState } from "react";
import ReschedulePopup from "./ReschedulePopup";


type Meeting = {
  id: number;
  client: string;
  date: string;
  time: string;
  type: "recent" | "upcoming";
};

//  props 
type MeetingsCardProps = {
  recentMeetings: Meeting[];
  upcomingMeetings: Meeting[];
};

const MeetingsCard = ({ recentMeetings, upcomingMeetings }: MeetingsCardProps) => {
  
  const [activeTab, setActiveTab] = useState<"recent" | "upcoming">("recent");

  //  selected meeting to reschedule
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // bch n7lou popup
  const [showReschedule, setShowReschedule] = useState(false);

  // Function for the reschedule button 
  const handleReschedule = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowReschedule(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      {/* Tabs for Recent and Upcoming Meetings */}
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

      {/* Tables for Recent and Upcoming Meetings */}
      {activeTab === "recent" ? (
        // Recent Meetings Table
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
        // Upcoming Meetings Table
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
            //  reschedule logic 
            //console.log("Rescheduled to:", newDate);
            setShowReschedule(false);
          }}
        />
      )}
    </div>
  );
};

export default MeetingsCard;