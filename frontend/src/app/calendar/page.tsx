'use client';
import { useState } from 'react';
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
} from 'date-fns';
import { Button } from '../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate the start and end of the current month and week
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const startWeek = startOfWeek(start);
  const endWeek = endOfWeek(end);

  // Return the array of dates within the specified time interval.
  const days = eachDayOfInterval({ start: startWeek, end: endWeek });

  // Handler to navigate to the previous month
  const handlePrevMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  // Handler to navigate to the next month
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-700 min-h-screen">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          className="p-2 hover:bg-blue-50  dark:hover:bg-gray-800"
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-5 w-5 text-blue-500" />
        </Button>
        <h1 className="text-2xl font-bold dark:text-gray-50">{format(currentDate, 'MMMM yyyy')}</h1>
        <Button
          variant="ghost"
          className="p-2 hover:bg-blue-50 dark:hover:bg-gray-800"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-5 w-5 text-blue-[#1366e8]" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7   rounded-lg overflow-hidden">
        {/* Weekday Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-white p-2 bg-[#f82991] border-b border-gray-200"
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <Link
              key={day.toISOString()}
              href={`/calendar/${format(day, 'yyyy-MM-dd')}`}
            >
              <div
                className={`p-2 border-b border-r border-gray-200 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Day Number */}
                <div
                  className={`text-sm font-semibold ${
                    isToday(day) ? 'text-blue-500' : 'text-gray-800'
                  } ${!isCurrentMonth && 'text-gray-400'}`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}