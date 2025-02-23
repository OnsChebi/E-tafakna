"use client";
//import { useState } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
//import { Button } from "@/components/ui/button";

type Meeting = {
  id: string;
  client: {
    name: string;
    image?: string;
  };
  time: string;
};

const ReminderCard = () => {
  const meetings: Meeting[] = [
    {
      id: "1",
      client: {
        name: "Nour masmoudi",
        image: "/clients/client1.jpg",
      },
      time: "09:30 AM",
    },
    {
      id: "2",
      client: {
        name: "Saleh ben ali",
        image: "/clients/client2.jpg",
      },
      time: "11:00 AM",
    },
    {
      id: "3",
      client: {
        name: "Nour masmoudi",
        image: "",
      },
      time: "11:30 AM",
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-center gap-2 ">
      <h2 className="text-xl font-semibold dark:text-white mb-2">Reminders</h2>
      <Bell className="h-8 w-5 dark:text-white"></Bell> 
      </div>

      {/* List of Meetings */}
      <div className="space-y-4 bg-white dark:bg-gray-900 rounded-xl shadow-md p-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {/* Client Image */}
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

            {/* Client Info */}
            <div className="flex-1">
              <h3 className="font-medium dark:text-white">{meeting.client.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {meeting.time}
              </p>
            </div>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderCard;