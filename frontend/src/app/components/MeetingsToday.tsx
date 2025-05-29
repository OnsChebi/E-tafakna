"use client";

import { useEffect, useState } from 'react';
import { Video, Users, ArrowRight } from 'lucide-react';
import { MeetingToday } from '../service/api';

// Define the allowed tab types
type MeetingTab = 'all' | 'Online' | 'In person';

const MeetingsToday = () => {
  const [activeTab, setActiveTab] = useState<MeetingTab>('all');
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await MeetingToday.getTodaysMeetings();
        //console.log('today Response:', res.data);
        setMeetings(res.data || []);
      } catch (error: any) {
        console.error('Failed to fetch meetings:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });
      }
    };

    fetchMeetings();
    const interval = setInterval(fetchMeetings, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();

  const filteredMeetings = meetings
    .filter((meeting) => {
      const startTime = new Date(meeting.startTime);
      const endTime = meeting.endTime
        ? new Date(meeting.endTime)
        : new Date(startTime.getTime() + 30 * 60000); // Default to 30 mins
      return endTime > now;
    })
    .filter((meeting) => activeTab === 'all' || meeting.type === activeTab);

  const tabs = ['all', 'Online', 'In person'] as const;

  return (
    <div className=" dark:bg-gray-800 rounded-xl  p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Meetings Today
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 border-b dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 dark:border-white dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600"
              }`}
            >
              <Users className="w-4 h-4" />
              {tab === "all" ? "All" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Meeting List */}
      <div className="space-y-4 max-h-[600px] min-h-[176px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-300">
            No meetings scheduled for today
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting.eventId}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {/* Client Info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {meeting.inviteeName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {meeting.inviteeName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(meeting.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Join Button */}
              {meeting.type === "Online" && (
                <button
                  onClick={() => window.open(meeting.meetingUrl, "_blank")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Join</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsToday;
