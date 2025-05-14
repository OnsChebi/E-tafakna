"use client";

interface ProgressBarProps {
  label: string;
  value: number;
}

export const ProgressBar = ({ label, value }: ProgressBarProps) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-gray-500">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);