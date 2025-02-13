import { useState } from 'react';
import Image from 'next/image';
import { Video, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

type Meeting = {
  id: string;
  title: string;
  client: {
    name: string;
    image?: string;
  };
  time: string;
  type: 'Online' | 'In person';
  link?: string;
};

const MeetingsToday = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'Online' | 'In person'>('all');
  
  
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Case 1',
      client: {
        name: 'Nour masmoudi',
        image: '/clients/client1.jpg',
      },
      time: '09:30 AM',
      type: 'Online',
      link: 'https://meet.example.com/123'
    },
    {
      id: '2',
      title: 'Case 2',
      client: {
        name: 'Saleh ben ali',
        image: '/clients/client2.jpg',
      },
      time: '11:00 AM',
      type: 'In person'
    },
    {
      id: '3',
      title: 'Case 1',
      client: {
        name: 'Nour masmoudi',
        image: '',
      },
      time: '11:30 AM',
      type: 'Online',
      link: 'https://meet.example.com/123'
    },
    
  ];

  const filteredMeetings = meetings.filter(meeting => 
    activeTab === 'all' ? true : meeting.type === activeTab
  );

  return (
    <div className="bg-white  dark:bg-gray-900 rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold dark:text-white">Meetings Today</h2>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b dark:border-gray-700">
          
          {/* button all meetings*/}
          <Button
            variant="ghost"
            onClick={() => setActiveTab('all')}
            className={`rounded-none px-4 py-2 ${
              activeTab === 'all' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            All
          </Button>

            {/* button online meetings*/}
          <Button
            variant="ghost"
            onClick={() => setActiveTab('Online')}
            className={`rounded-none px-4 py-2 ${
              activeTab === 'Online' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Video className="w-4 h-4 mr-2" />
            Online
          </Button>
          
          {/* button in person meetings*/}
          <Button
            variant="ghost"
            onClick={() => setActiveTab('In person')}
            className={`rounded-none px-4 py-2 ${
              activeTab === 'In person' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            In-Person
          </Button>
        </div>
      </div>

      {/* Meeting List */}
      <div className="space-y-4 max-h-[600px] min-h-[176px] overflow-y-auto md:max-h-44">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-300">
            No meetings scheduled for today
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {/* Client Info */}
              <div className="flex items-center gap-4">
              {meeting.client.image ? (
                <Image
                  src={meeting.client.image}
                  alt={meeting.client.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {meeting.client.name[0]}
                  </span>
                </div>
              )}
                <div>
                  <h3 className="font-medium dark:text-white">{meeting.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {meeting.client.name} • {meeting.time}
                  </p>
                </div>
              </div>

              {/* Join Button */}
              {meeting.type === 'Online' && (
                <Button
                  variant="outline"
                  className="gap-2 bg-[#1366e8] hover:bg-gray-400"
                  onClick={() => window.open(meeting.link, '_blank')}
                >
                  <Video className="w-4 h-4 text-white "/>
                  <span className="text-white">Join</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsToday;