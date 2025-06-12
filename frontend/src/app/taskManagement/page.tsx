"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { taskApi } from "../service/api";
import { toast } from "@/hooks/use-toast";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  expert: { id: number; name?: string };
};

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const expertId = /* retrieve from auth context or API */ 1;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getByExpert(expertId);
      setTasks(res.data);
    } catch {
      toast({ title: "Error", description: "Couldn't fetch tasks." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await taskApi.create({
        ...form,
        expertId,
      });
      toast({ title: "Success", description: "Task created!" });
      fetchTasks();
      setIsDialogOpen(false);
      setForm({ title: "", description: "", dueDate: "" });
    } catch {
      toast({ title: "Error", description: "Failed to create task." });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskApi.delete(id);
      toast({ title: "Deleted", description: "Task removed." });
      fetchTasks();
    } catch {
      toast({ title: "Error", description: "Failed to delete task." });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Task</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Task Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Task Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[70vh] space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading…</div>
        ) : tasks.length ? (
          tasks.map((task) => (
            <Card
              key={task.id}
              className="border border-muted-foreground shadow-sm hover:shadow-md transition"
            >
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {task.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <p className="text-xs uppercase">{task.status}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No tasks yet.
          </div>
        )}
      </ScrollArea>
    </main>
  );
}
