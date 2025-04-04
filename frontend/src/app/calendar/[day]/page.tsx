'use client';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function DayDetailsPage({ params }: { params: { day: string } }) {
  const date = new Date(params.day);
  const formattedDate = format(date, "dd MMMM yyyy");

  // Generate quarter-hour time slots from 6:00 AM to 10:00 PM
  const timeSlots = Array.from({ length: (22 - 6) * 4 }, (_, i) => {
    const hour = 6 + Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return { time: `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`, hour, minutes };
  });

  return (
    <div className="h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header with Back Button */}
      <div className="items-center mb-2">
        <Link href="/calendar">
          <button className="p-1 ml-5 rounded-full bg-[#1366e8] hover:bg-blue-700 text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </Link>
        <h1 className="text-2xl flex justify-center font-bold">{formattedDate}</h1>
      </div>

      {/* Time Slots with Dashed Lines */}
      <div className="flex-1 overflow-y-auto pr-4">
        {timeSlots.map(({ time, hour, minutes }) => (
          <Link
            key={time}
            href={`/calendar/${params.day}/${hour}`} // Link to the hour details page
            className="group relative"
          >
            <div className="flex items-center h-16">
              {/* Time Label */}
              <span className="w-20 text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-[#1366e8] transition-colors">
                {time}
              </span>
              
              {/* Dashed Line */}
              <div className="flex-1 border-b border-dashed border-gray-300 dark:border-gray-700 group-hover:border-[#1366e8] transition-colors" />
              
              {/* Hover Indicator */}
              <div className="absolute left-20 right-0 h-16 -z-10 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}