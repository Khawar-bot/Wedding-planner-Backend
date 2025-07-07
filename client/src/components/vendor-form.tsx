import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertVendorSchema } from "@shared/schema";
import type { Vendor, InsertVendor } from "@shared/schema";
import { z } from "zod";

const vendorFormSchema = insertVendorSchema.extend({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  contractAmount: z.string().optional(),
  isBooked: z.boolean().default(false),
  notes: z.string().optional(),
});

type VendorFormData = z.infer<typeof vendorFormSchema>;

interface VendorFormProps {
  vendor?: Vendor | null;
  onClose: () => void;
}

export default function VendorForm({ vendor, onClose }: VendorFormProps) {
  const { toast } = useToast();
  
  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: vendor?.name || "",
      category: vendor?.category || "",
      contactName: vendor?.contactName || "",
      phone: vendor?.phone || "",
      email: vendor?.email || "",
      website: vendor?.website || "",
      address: vendor?.address || "",
      contractAmount: vendor?.contractAmount || "",
      isBooked: vendor?.isBooked || false,
      notes: vendor?.notes || "",
    },
  });

  const createVendorMutation = useMutation({
    mutationFn: async (data: InsertVendor) => {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create vendor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({ title: "Vendor created successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to create vendor", variant: "destructive" });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: async (data: Partial<InsertVendor>) => {
      const response = await fetch(`/api/vendors/${vendor?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update vendor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({ title: "Vendor updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update vendor", variant: "destructive" });
    },
  });

  const onSubmit = (data: VendorFormData) => {
    const vendorData = {
      ...data,
      contactName: data.contactName || null,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      address: data.address || null,
      contractAmount: data.contractAmount || null,
      notes: data.notes || null,
    };

    if (vendor) {
      updateVendorMutation.mutate(vendorData);
    } else {
      createVendorMutation.mutate(vendorData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Vendor Name *</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="e.g., Elegant Catering Co."
          className="wedding-input"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          {...form.register("category")}
          placeholder="e.g., Catering, Photography, Florist"
          className="wedding-input"
        />
        {form.formState.errors.category && (
          <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactName">Contact Name</Label>
        <Input
          id="contactName"
          {...form.register("contactName")}
          placeholder="e.g., Sarah Miller"
          className="wedding-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...form.register("phone")}
            placeholder="(555) 123-4567"
            className="wedding-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="contact@vendor.com"
            className="wedding-input"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          {...form.register("website")}
          placeholder="https://www.vendor.com"
          className="wedding-input"
        />
        {form.formState.errors.website && (
          <p className="text-sm text-red-600">{form.formState.errors.website.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...form.register("address")}
          placeholder="123 Main St, City, State 12345"
          className="wedding-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractAmount">Contract Amount</Label>
        <Input
          id="contractAmount"
          type="number"
          step="0.01"
          {...form.register("contractAmount")}
          placeholder="0.00"
          className="wedding-input"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isBooked"
          checked={form.watch("isBooked")}
          onCheckedChange={(checked) => form.setValue("isBooked", checked as boolean)}
        />
        <Label htmlFor="isBooked">Booked</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...form.register("notes")}
          className="wedding-input"
          rows={3}
          placeholder="Additional notes about this vendor..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="wedding-btn"
          disabled={createVendorMutation.isPending || updateVendorMutation.isPending}
        >
          {vendor ? "Update Vendor" : "Add Vendor"}
        </Button>
      </div>
    </form>
  );
}
