import { format } from 'date-fns';
import Link from 'next/link';

export default function DayDetailsPage({ params }: { params: { day: string } }) {
  const date = new Date(params.day);
  const hours = Array.from({ length: 24 }, (_, i) => i); // Generate hours from 0 to 23

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Hours for {format(date, 'MMMM d, yyyy')}
      </h1>

      {/* Hourly Slots */}
      <div className="grid grid-cols-1 gap-2">
        {hours.map((hour) => (
          <Link
            key={hour}
            href={`/calendar/${params.day}/${hour}`}
          >
            <div className="p-4 border rounded-lg bg-white hover:bg-gray-100 cursor-pointer">
              {`${hour}:00 - ${hour + 1}:00`}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}