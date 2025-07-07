import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertGuestSchema } from "@shared/schema";
import type { Guest, InsertGuest } from "@shared/schema";
import { z } from "zod";

const guestFormSchema = insertGuestSchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  rsvpStatus: z.enum(["pending", "confirmed", "declined"]),
  plusOne: z.boolean().default(false),
  dietaryRestrictions: z.string().optional(),
  notes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

interface GuestFormProps {
  guest?: Guest | null;
  onClose: () => void;
}

export default function GuestForm({ guest, onClose }: GuestFormProps) {
  const { toast } = useToast();
  
  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: guest?.name || "",
      email: guest?.email || "",
      phone: guest?.phone || "",
      rsvpStatus: guest?.rsvpStatus || "pending",
      plusOne: guest?.plusOne || false,
      dietaryRestrictions: guest?.dietaryRestrictions || "",
      notes: guest?.notes || "",
    },
  });

  const createGuestMutation = useMutation({
    mutationFn: async (data: InsertGuest) => {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create guest");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({ title: "Guest created successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to create guest", variant: "destructive" });
    },
  });

  const updateGuestMutation = useMutation({
    mutationFn: async (data: Partial<InsertGuest>) => {
      const response = await fetch(`/api/guests/${guest?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update guest");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({ title: "Guest updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update guest", variant: "destructive" });
    },
  });

  const onSubmit = (data: GuestFormData) => {
    const guestData = {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      dietaryRestrictions: data.dietaryRestrictions || null,
      notes: data.notes || null,
    };

    if (guest) {
      updateGuestMutation.mutate(guestData);
    } else {
      createGuestMutation.mutate(guestData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...form.register("name")}
          className="wedding-input"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          className="wedding-input"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          {...form.register("phone")}
          className="wedding-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rsvpStatus">RSVP Status</Label>
        <Select
          value={form.watch("rsvpStatus")}
          onValueChange={(value) => form.setValue("rsvpStatus", value as "pending" | "confirmed" | "declined")}
        >
          <SelectTrigger className="wedding-input">
            <SelectValue placeholder="Select RSVP status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="plusOne"
          checked={form.watch("plusOne")}
          onCheckedChange={(checked) => form.setValue("plusOne", checked as boolean)}
        />
        <Label htmlFor="plusOne">Plus One</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
        <Textarea
          id="dietaryRestrictions"
          {...form.register("dietaryRestrictions")}
          className="wedding-input"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...form.register("notes")}
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
          disabled={createGuestMutation.isPending || updateGuestMutation.isPending}
        >
          {guest ? "Update Guest" : "Add Guest"}
        </Button>
      </div>
    </form>
  );
}
