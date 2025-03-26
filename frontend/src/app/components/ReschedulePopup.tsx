"use client";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type ReschedulePopupProps = {
  meeting: {
    id: number;
    date: string;
  };
  onClose: () => void;
  onConfirm: (newDate: Date) => void;
};

const ReschedulePopup = ({ meeting, onClose, onConfirm }: ReschedulePopupProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date(meeting.date));

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Reschedule Meeting</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Select New Date & Time
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange} 
            showTimeSelect
            dateFormat="Pp"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedDate)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReschedulePopup;