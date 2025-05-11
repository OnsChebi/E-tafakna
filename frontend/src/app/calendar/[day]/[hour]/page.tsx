'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { ArrowLeftIcon, MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';



export default function HourDetailsPage() {
  const router = useRouter();
  const params = useParams<{
    day: string;
    hour: string; // Should match your folder structure [day]/[hour]
  }>();
  
  if (!params?.day || !params?.hour) {
    return <div>Invalid parameters</div>;
  }
  const [hours, minutes] = params.hour.split(':');
  const { day } = params;

  const [searchQuery, setSearchQuery] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'new'>('search');

  const handleSchedule = async () => {
    if (!selectedClient) {
      alert('Please select or create a client');
      return;
    }

    //console.log('Scheduling for:', selectedClient);
    router.push(`/calendar/${day}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {hours}:{minutes} - {day}
          </h1>
        </div>
          

        {/* Client Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 mb-4">
            <button
              className={`flex-1 py-2 text-sm ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('search')}
            >
              Existing Client
            </button>
            <button
              className={`flex-1 py-2 text-sm ${activeTab === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('new')}
            >
              New Client
            </button>
          </div>

          {activeTab === 'search' ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button className="px-4" onClick={() => setSelectedClient(searchQuery)}>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              {/* Search results would go here */}
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedClient(clientName);
                  setClientName('');
                }}
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Create Client
              </Button>
            </div>
          )}
        </div>

        {/* Selected Client */}
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 rounded-lg p-4 mb-6"
          >
            <p className="text-sm text-gray-600">Selected Client</p>
            <p className="font-medium text-blue-600">{selectedClient}</p>
          </motion.div>
        )}

        {/* Confirm Button */}
        <Button
          onClick={handleSchedule}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!selectedClient}
        >
          Confirm Appointment
        </Button>
      </div>
    </div>
  );
}