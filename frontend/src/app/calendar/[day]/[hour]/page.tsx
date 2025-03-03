'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function HourDetailsPage({
  params,
}: {
  params: { day: string; hour: string; minutes: string };
}) {
  const router = useRouter();
  const { day, hour, minutes } = params;

  const [searchQuery, setSearchQuery] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a client name or email to search.');
      return;
    }

    setIsSearching(true);
    // Simulate a search API call
    setTimeout(() => {
      alert(`Searching for client: ${searchQuery}`);
      setIsSearching(false);
    }, 1000);
  };

  const handleCreateClient = async () => {
    if (!clientName.trim()) {
      alert('Please enter a client name.');
      return;
    }

    setIsCreating(true);
    // Simulate a create client API call
    setTimeout(() => {
      alert(`Created new client: ${clientName}`);
      setIsCreating(false);
      setClientName(''); // Clear the input after creation
    }, 1000);
  };

  const handleScheduleAppointment = () => {
    if (!clientName.trim()) {
      alert('Please enter a client name to schedule an appointment.');
      return;
    }

    // Save the appointment (e.g., to a global state or API)
    const appointment = {
      date: day,
      time: `${hour}:${minutes}`,
      clientName,
    };
    console.log('Scheduled Appointment:', appointment);

    // Show success feedback
    alert('Appointment scheduled successfully!');

    // Redirect back to the calendar
    router.push(`/calendar/${day}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.div whileHover={{ scale: 1.05 }} className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#1366e8] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            <span className="font-medium">Back to Schedule</span>
          </button>
        </motion.div>

        {/* Hour Slot Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 hover:shadow-xl transition-shadow"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Appointment Details
              </h2>
              <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
                {day}
              </p>
            </div>
            <div className="flex items-center text-[#1366e8] dark:text-blue-400">
              <CalendarIcon className="h-6 w-6 mr-2" />
              {/* <span className="text-xl font-medium">
                {hour}:{minutes}
              </span> */}
            </div>
          </div>
        </motion.div>

        {/* Interactive Sections */}
        <motion.div className="space-y-6">
          {/* Find Client Section */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center mb-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-[#1366e8] dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Find Client
              </h2>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Client name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1366e8] dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-[#1366e8] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 px-6 rounded-lg transition-transform hover:scale-105"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </motion.div>

          {/* New Client Section */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center mb-4">
              <UserPlusIcon className="h-6 w-6 text-[#1366e8] dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                New Client
              </h2>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter client name..."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1366e8] dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
              />
              <Button
                onClick={handleCreateClient}
                disabled={isCreating}
                className="bg-[#1366e8] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 px-6 rounded-lg transition-transform hover:scale-105"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Confirm Appointment Button */}
        <motion.div className="pt-6">
          <Button
            onClick={handleScheduleAppointment}
            className="w-full bg-gradient-to-r from-[#1366e8] to-blue-500 hover:from-blue-600 hover:to-blue-400 dark:from-blue-600 dark:to-blue-500 dark:hover:from-blue-700 dark:hover:to-blue-600 text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Confirm Appointment
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}