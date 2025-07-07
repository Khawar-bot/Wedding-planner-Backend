import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertTaskSchema } from "@shared/schema";
import type { Task, InsertTask } from "@shared/schema";
import { z } from "zod";

const taskFormSchema = insertTaskSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isCompleted: z.boolean().default(false),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const { toast } = useToast();
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      isCompleted: task?.isCompleted || false,
      dueDate: task?.dueDate || "",
      priority: task?.priority || "medium",
      category: task?.category || "",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task created successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to create task", variant: "destructive" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (data: Partial<InsertTask>) => {
      const response = await fetch(`/api/tasks/${task?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update task", variant: "destructive" });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    const taskData = {
      ...data,
      description: data.description || null,
      dueDate: data.dueDate || null,
      category: data.category || null,
    };

    if (task) {
      updateTaskMutation.mutate(taskData);
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="e.g., Finalize menu selections"
          className="wedding-input"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Additional details about this task..."
          className="wedding-input"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={form.watch("priority")}
            onValueChange={(value) => form.setValue("priority", value as "low" | "medium" | "high")}
          >
            <SelectTrigger className="wedding-input">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            {...form.register("category")}
            placeholder="e.g., Catering, Decorations"
            className="wedding-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          {...form.register("dueDate")}
          className="wedding-input"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isCompleted"
          checked={form.watch("isCompleted")}
          onCheckedChange={(checked) => form.setValue("isCompleted", checked as boolean)}
        />
        <Label htmlFor="isCompleted">Mark as completed</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="wedding-btn"
          disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
        >
          {task ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </form>
  );
}
