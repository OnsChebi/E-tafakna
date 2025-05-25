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

  useEffect(() => {
    const fetchBusyDays = async () => {
      try {
        const response = await busyDays.getBusyDays();
        const busyDates: string[] = response?.data?? [];

        console.log('Raw busyDays from API:', busyDates);

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
              title: '', // No text, just the dot
            };
          });

        console.log('Filtered and formatted busy dates:', filteredAndFormatted);
        setEvents(filteredAndFormatted);
      } catch (error) {
        console.error('Failed to fetch busy days:', error);
      }
    };

    fetchBusyDays();
  }, []);

  // Custom dot style
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
    <div style={{ height: '80vh', padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Busy Dates Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarPage;
