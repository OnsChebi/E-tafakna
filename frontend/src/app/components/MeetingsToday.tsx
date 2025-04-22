'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Meeting {
  id: string;
  title: string;
  client: {
    name: string;
    image: string;
  };
  time: string;
  type: string;
  link: string;
}

const TodayMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [activeType, setActiveType] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        const response = await axios.get('http://localhost:5000/api/calendly/today', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMeetings(response.data);
        setFilteredMeetings(response.data);
      } catch (err) {
        setError('Failed to load meetings');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleTabClick = (type: string) => {
    setActiveType(type);
    if (type === 'All') {
      setFilteredMeetings(meetings);
    } else {
      setFilteredMeetings(meetings.filter((meeting) => meeting.type === type));
    }
  };

  const meetingTypes = Array.from(new Set(meetings.map((m) => m.type)));
  const tabs = ['All', ...meetingTypes];

  if (loading) return <div className="text-center mt-10">Loading meetings...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Today's Meetings</h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {tabs.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleTabClick(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Meeting Cards */}
      {filteredMeetings.length === 0 ? (
        <div className="text-center">No meetings found for this type.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-white shadow-md rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <img
                  src={meeting.client.image || 'https://via.placeholder.com/40'}
                  alt={meeting.client.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{meeting.client.name}</p>
                  <p className="text-sm text-gray-500">{meeting.type}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">{meeting.time}</span>
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayMeetings;
