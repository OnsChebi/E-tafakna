'use client';
import { useState, useEffect } from 'react';
import {
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isAfter,
  parseISO
} from 'date-fns';
import { Button } from '../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { busyDays } from '../service/api';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [busyDates, setBusyDates] = useState<string[]>([]);
  const [today] = useState(new Date());

  // Fetch busy dates from the API
  useEffect(() => {
    const fetchBusyDates = async () => {
      try {
        const response = await busyDays.getBusyDays();
        // Filter dates to include only today and future dates
        const filteredDates = response.data.busyDays.filter(dateString => {
          const date = parseISO(dateString);
          return isAfter(date, today) || isToday(date);
        });
        setBusyDates(filteredDates);
      } catch (error) {
        console.error('Error fetching busy dates:', error);
      }
    };

    fetchBusyDates();
  }, [today]);

  // Calendar calculation logic
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);
  const days = eachDayOfInterval({ start: startWeek, end: endWeek });

  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Check if a day is busy and in the future
  const isBusy = (day: Date) => {
    const dayString = format(day, 'yyyy-MM-dd');
    return busyDates.includes(dayString) && 
      (isAfter(day, today) || isToday(day));
  };

  return (
    <div className="p-2 bg-gray-200 dark:bg-gray-700 min-h-screen">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-1">
        <Button
          variant="ghost"
          className="p-2 hover:bg-blue-50 dark:hover:bg-gray-800"
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-7 w-7 text-blue-500" />
        </Button>
        <h1 className="text-2xl font-bold dark:text-gray-50">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <Button
          variant="ghost"
          className="p-2 hover:bg-blue-50 dark:hover:bg-gray-800"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-7 w-7 text-blue-500" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 rounded-lg overflow-hidden">
        {/* Weekday Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-white p-2 bg-[#1366e8] border-b border-gray-200"
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayFormatted = format(day, 'yyyy-MM-dd');

          return (
            <Link
              key={dayFormatted}
              href={`/calendar/${dayFormatted}`}
            >
              <div className={`relative p-2 border-b border-r border-gray-200 
                ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-600'} 
                h-[4.5rem] flex flex-col justify-center items-center`}>

                {/* Day Number */}
                <div className={`text-sm font-semibold 
                  ${isToday(day) ? 'bg-[#1366e8] text-white rounded-full w-8 h-8 flex items-center justify-center' : 'text-gray-800 dark:text-gray-200'} 
                  ${!isCurrentMonth && 'text-gray-400 dark:text-gray-500'}`}>
                  {format(day, 'd')}
                </div>

                {/* Blue Dot for Future Busy Days */}
                {isBusy(day) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 
                    w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}