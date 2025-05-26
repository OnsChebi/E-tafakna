'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import { parseISO } from 'date-fns';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { busyDays } from '../service/api';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState<{ start: Date; end: Date; title: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    const fetchBusyDays = async () => {
      try {
        const response = await busyDays.getBusyDays();
        const busyDates = response?.data ?? [];

        if (!Array.isArray(busyDates)) {
          console.warn('busyDays is not an array:', busyDates);
          return;
        }

        const filteredAndFormatted = busyDates
          .filter(dateStr => {
            try {
              return !!parseISO(dateStr);
            } catch {
              return false;
            }
          })
          .map(dateStr => {
            const parsedDate = parseISO(dateStr);
            return {
              start: parsedDate,
              end: parsedDate,
              title: '', 
            };
          });

        setEvents(filteredAndFormatted);
      } catch (error) {
        console.error('Failed to fetch busy days:', error);
      }
    };

    fetchBusyDays();
  }, []);

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
      <h2 className="text-xl font-bold mb-4 dark:text-gray-300">Busy Dates Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        onSelectEvent={(event) => setSelectedEvent(event)}
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
