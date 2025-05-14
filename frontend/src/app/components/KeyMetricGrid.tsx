"use client";

import { Calendar, Folder, Users, Video } from "lucide-react";
import { StatCard } from "./statCard";


interface KeyMetricsGridProps {
  stats: {
    clients: number;
    meetings: number;
    folders: number;
    upcoming: number;
  };
  isLoading: boolean;
  onRefresh: () => void;
}

export const KeyMetricsGrid = ({ stats, isLoading, onRefresh }: KeyMetricsGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
    <StatCard
      title="Total Clients"
      value={stats.clients}
      icon={<Users />}
      trend={8.2}
      isLoading={isLoading}
      refresh={onRefresh}
    />
    <StatCard
      title="Today's Meetings"
      value={stats.meetings}
      icon={<Video />}
      trend={-2.1}
      isLoading={isLoading}
    />
    <StatCard
      title="Active Folders"
      value={stats.folders}
      icon={<Folder />}
      trend={12.5}
      isLoading={isLoading}
    />
    <StatCard
      title="Upcoming Meetings"
      value={stats.upcoming}
      icon={<Calendar />}
      trend={15.5}
      isLoading={isLoading}
    />
  </div>
);