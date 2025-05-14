"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";

interface TaskProgressProps {
  tasks: Array<{
    label: string;
    value: number;
  }>;
}

export const TaskProgress = ({ tasks }: TaskProgressProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Task Progress</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <ProgressBar key={index} label={task.label} value={task.value} />
        ))}
      </div>
    </CardContent>
  </Card>
);