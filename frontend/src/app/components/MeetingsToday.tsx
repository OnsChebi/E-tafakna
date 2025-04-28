'use client';

import { useEffect, useState } from 'react';
import { Video, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MeetingToday, CalendlyEvent } from '../service/api';

const MeetingsToday = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'Online' | 'In person'>('all');
  const [meetings, setMeetings] = useState<CalendlyEvent[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await MeetingToday.getTodaysMeetings();
        setMeetings(res.data.events);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      }
    };
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(
    (meeting) => activeTab === 'all' || meeting.meetingType === activeTab
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold dark:text-white">Meetings Today</h2>

        {/* Tabs */}
        <div className="flex gap-2 border-b dark:border-gray-700">
          {['all', 'Online', 'In person'].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              onClick={() => setActiveTab(tab as any)}
              className={`rounded-none px-4 py-2 ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              {tab === 'all' ? 'All' : tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Meeting List */}
      <div className="space-y-4 max-h-[600px] min-h-[176px] overflow-y-auto md:max-h-44">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-300">
            No meetings scheduled for today
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting.eventId}
              className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {/* Client Initial */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {meeting.clientName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">{meeting.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {meeting.clientName} • {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Join Button */}
              {meeting.meetingType === 'Online' && (
                <Button
                  variant="outline"
                  className="gap-2 bg-[#1366e8] hover:bg-gray-400"
                  onClick={() => window.open(meeting.eventId, '_blank')}
                >
                  <Video className="w-4 h-4 text-white" />
                  <span className="text-white">Join</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsToday;
