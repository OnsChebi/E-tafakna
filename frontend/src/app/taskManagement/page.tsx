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
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, SquarePen, Trash2 } from "lucide-react";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
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
    status: "pending",
  });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const expertId = 1;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getByExpert();
      setTasks(res.data);
    } catch {
      toast({ title: "Error", description: "Couldn't fetch tasks." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingTaskId) {
        await taskApi.update(editingTaskId, {
          ...form,
          status: form.status as Task["status"],
        });
        toast({ title: "Updated", description: "Task updated!" });
      } else {
        await taskApi.create({
          ...form,
          expertId,
        });
        toast({ title: "Success", description: "Task created!" });
      }
      fetchTasks();
      setIsDialogOpen(false);
      setForm({ title: "", description: "", dueDate: "", status: "pending" });
      setEditingTaskId(null);
    } catch {
      toast({ title: "Error", description: "Failed to save task." });
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

  const handleEdit = (task: Task) => {
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
      status: task.status,
    });
    setEditingTaskId(task.id);
    setIsDialogOpen(true);
  };

  const filteredTasks = filterStatus === "all" ? tasks : tasks.filter(task => task.status === filterStatus);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white ">Task Management</h1>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] ">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:opacity-90"> <Plus /></Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-white">
              <DialogHeader>
                <DialogTitle>{editingTaskId ? "Update Task" : "New Task"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Task Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Task Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:opacity-90">
                  {editingTaskId ? "Update" : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="h-[70vh] ">
        {loading ? (
          <div className="text-center text-gray-500">Loading…</div>
        ) : filteredTasks.length ? (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`border relative p-1 mb-4 bg-white border-muted-foreground  hover:shadow-md transition ${task.status === "completed" ? "opacity-50" : ""}`}
            >
              <CardHeader>
                <CardTitle className={`text-xl ${task.status === "completed" ? "line-through" : ""}`}>{task.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className={`text-sm ${task.status === "completed" ? "line-through text-muted-foreground" : "text-gray-700 dark:text-gray-300"}`}>
                  {task.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${task.status === "pending" ? "bg-yellow-200 text-yellow-800" : task.status === "in-progress" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"}`}>
                    {task.status.replace("-", " ")}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(task)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:opacity-90"
                    >
                      <SquarePen />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:opacity-90"
                    >
                      <Trash2 />
                      
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No tasks match this filter.
          </div>
        )}
      </ScrollArea>
    </main>
  );
}
