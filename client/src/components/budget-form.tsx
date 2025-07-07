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
import { insertBudgetItemSchema } from "@shared/schema";
import type { BudgetItem, InsertBudgetItem } from "@shared/schema";
import { z } from "zod";

const budgetFormSchema = insertBudgetItemSchema.extend({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  budgetAmount: z.string().min(1, "Budget amount is required"),
  actualAmount: z.string().default("0"),
  isPaid: z.boolean().default(false),
  notes: z.string().optional(),
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  item?: BudgetItem | null;
  onClose: () => void;
}

export default function BudgetForm({ item, onClose }: BudgetFormProps) {
  const { toast } = useToast();
  
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: item?.category || "",
      description: item?.description || "",
      budgetAmount: item?.budgetAmount || "",
      actualAmount: item?.actualAmount || "0",
      isPaid: item?.isPaid || false,
      notes: item?.notes || "",
    },
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (data: InsertBudgetItem) => {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create budget item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget"] });
      toast({ title: "Budget item created successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to create budget item", variant: "destructive" });
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: async (data: Partial<InsertBudgetItem>) => {
      const response = await fetch(`/api/budget/${item?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update budget item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget"] });
      toast({ title: "Budget item updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update budget item", variant: "destructive" });
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    const budgetData = {
      ...data,
      notes: data.notes || null,
    };

    if (item) {
      updateBudgetMutation.mutate(budgetData);
    } else {
      createBudgetMutation.mutate(budgetData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          {...form.register("category")}
          placeholder="e.g., Catering, Photography, Venue"
          className="wedding-input"
        />
        {form.formState.errors.category && (
          <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Input
          id="description"
          {...form.register("description")}
          placeholder="e.g., Wedding dinner for 150 guests"
          className="wedding-input"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budgetAmount">Budget Amount *</Label>
          <Input
            id="budgetAmount"
            type="number"
            step="0.01"
            {...form.register("budgetAmount")}
            className="wedding-input"
          />
          {form.formState.errors.budgetAmount && (
            <p className="text-sm text-red-600">{form.formState.errors.budgetAmount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="actualAmount">Actual Amount</Label>
          <Input
            id="actualAmount"
            type="number"
            step="0.01"
            {...form.register("actualAmount")}
            className="wedding-input"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPaid"
          checked={form.watch("isPaid")}
          onCheckedChange={(checked) => form.setValue("isPaid", checked as boolean)}
        />
        <Label htmlFor="isPaid">Paid</Label>
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
          disabled={createBudgetMutation.isPending || updateBudgetMutation.isPending}
        >
          {item ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
