'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { CalendlyEvent, upcomingMeeting } from '../service/api';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState<{ start: Date; end: Date; title: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        const response = await upcomingMeeting.getUpcomingMeetings();
        const meetingData = response?.data ?? [];
  
        if (!Array.isArray(meetingData)) {
          console.warn('upcomingMeetings is not an array:', meetingData);
          return;
        }
  
        const formattedEvents = meetingData.map((meeting: CalendlyEvent) => {
          return {
            title: meeting.inviteeName || 'Meeting',
            start: new Date(meeting.startTime),
            end: new Date(meeting.endTime),
          };
        });
  
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch upcoming meetings:', error);
      }
    };
  
    fetchUpcomingMeetings();
  }, []);
  
  const handleEventSelect = (event: { start: Date; end: Date; title: string }) => {
    setSelectedEvent(event);
    setTimeout(() => setSelectedEvent(null), 4000);
  };
  

  const eventPropGetter = () => {
    return {
      style: {
        backgroundColor: 'blue',
        width: '8px',
        height: '8px',
        border: 'none',
      },
    };
  };

  return (
    <div style={{ height: '85vh', padding: '2rem' }} className='dark:bg-gray-800'>
      <h2 className="text-xl font-bold mb-4 dark:text-gray-300">Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        onSelectEvent={handleEventSelect}
        style={{ height: '75%' }}
        className='dark:text-gray-300'
      />

      {selectedEvent && (
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p className="text-blue-800 dark:text-blue-500 font-medium">
            Meeting Date: {selectedEvent.start.toLocaleDateString()} <br />
            Time: {selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
