'use client';
import { useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

export default function HourDetailsPage({
  params,
}: {
  params: { day: string; hour: string };
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [clientName, setClientName] = useState('');

  const handleSearch = () => {
    // Simulate searching for a client
    alert(`Searching for client: ${searchQuery}`);
  };

  const handleCreateClient = () => {
    // Simulate creating a new client
    alert(`Creating new client: ${clientName}`);
  };

  const handleScheduleAppointment = () => {
    // Simulate scheduling an appointment
    alert(`Scheduling appointment for ${params.day} at ${params.hour}:00`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Schedule Appointment for {params.day} at {params.hour}:00
      </h1>

      {/* Search for Existing Client */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Search for Existing Client</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter client name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* Create New Client */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Create New Client</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <Button onClick={handleCreateClient}>Create Client</Button>
        </div>
      </div>

      {/* Schedule Appointment */}
      <div className="mt-6">
        <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
      </div>
    </div>
  );
}