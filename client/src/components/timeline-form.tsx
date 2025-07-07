import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertTimelineEventSchema } from "@shared/schema";
import type { TimelineEvent, InsertTimelineEvent } from "@shared/schema";
import { z } from "zod";

const timelineFormSchema = insertTimelineEventSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  eventType: z.string().min(1, "Event type is required"),
});

type TimelineFormData = z.infer<typeof timelineFormSchema>;

interface TimelineFormProps {
  event?: TimelineEvent | null;
  onClose: () => void;
}

export default function TimelineForm({ event, onClose }: TimelineFormProps) {
  const { toast } = useToast();
  
  const form = useForm<TimelineFormData>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      startTime: event?.startTime || "",
      endTime: event?.endTime || "",
      location: event?.location || "",
      eventType: event?.eventType || "",
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: InsertTimelineEvent) => {
      const response = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create timeline event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timeline"] });
      toast({ title: "Timeline event created successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to create timeline event", variant: "destructive" });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: Partial<InsertTimelineEvent>) => {
      const response = await fetch(`/api/timeline/${event?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update timeline event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timeline"] });
      toast({ title: "Timeline event updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update timeline event", variant: "destructive" });
    },
  });

  const onSubmit = (data: TimelineFormData) => {
    const eventData = {
      ...data,
      description: data.description || null,
      location: data.location || null,
    };

    if (event) {
      updateEventMutation.mutate(eventData);
    } else {
      createEventMutation.mutate(eventData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="e.g., Wedding Ceremony"
          className="wedding-input"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventType">Event Type *</Label>
        <Select
          value={form.watch("eventType")}
          onValueChange={(value) => form.setValue("eventType", value)}
        >
          <SelectTrigger className="wedding-input">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ceremony">Ceremony</SelectItem>
            <SelectItem value="reception">Reception</SelectItem>
            <SelectItem value="cocktail">Cocktail Hour</SelectItem>
            <SelectItem value="photo">Photo Session</SelectItem>
            <SelectItem value="getting-ready">Getting Ready</SelectItem>
            <SelectItem value="rehearsal">Rehearsal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.eventType && (
          <p className="text-sm text-red-600">{form.formState.errors.eventType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            {...form.register("startTime")}
            className="wedding-input"
          />
          {form.formState.errors.startTime && (
            <p className="text-sm text-red-600">{form.formState.errors.startTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            {...form.register("endTime")}
            className="wedding-input"
          />
          {form.formState.errors.endTime && (
            <p className="text-sm text-red-600">{form.formState.errors.endTime.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...form.register("location")}
          placeholder="e.g., Main Chapel, Garden Terrace"
          className="wedding-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Additional details about this event..."
          className="wedding-input"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="wedding-btn"
          disabled={createEventMutation.isPending || updateEventMutation.isPending}
        >
          {event ? "Update Event" : "Add Event"}
        </Button>
      </div>
    </form>
  );
}
