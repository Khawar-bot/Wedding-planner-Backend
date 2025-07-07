import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertSeatingTableSchema } from "@shared/schema";
import type { SeatingTable, InsertSeatingTable, Guest } from "@shared/schema";

interface SeatingChartProps {
  tables: SeatingTable[];
}

export default function SeatingChart({ tables }: SeatingChartProps) {
  const [selectedTable, setSelectedTable] = useState<SeatingTable | null>(null);
  const [draggedTable, setDraggedTable] = useState<SeatingTable | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const updateTableMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSeatingTable> }) => {
      const response = await fetch(`/api/seating/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update table");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seating"] });
    },
  });

  const createTableMutation = useMutation({
    mutationFn: async (data: InsertSeatingTable) => {
      const response = await fetch("/api/seating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create table");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seating"] });
      toast({ title: "Table created successfully" });
      setIsFormOpen(false);
    },
  });

  const handleDragStart = (e: React.DragEvent, table: SeatingTable) => {
    setDraggedTable(table);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTable || !chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateTableMutation.mutate({
      id: draggedTable.id,
      data: {
        positionX: Math.max(0, Math.min(x - 50, rect.width - 100)),
        positionY: Math.max(0, Math.min(y - 50, rect.height - 100)),
      },
    });

    setDraggedTable(null);
  };

  const getTableShape = (shape: string) => {
    return shape === "rectangular" ? "rounded-lg" : "rounded-full";
  };

  const getTableColor = (tableNumber: number) => {
    const colors = [
      "border-rose-gold bg-rose-gold",
      "border-dusty-blue bg-dusty-blue",
      "border-sage-green bg-sage-green",
      "border-champagne-gold bg-yellow-400",
    ];
    return colors[tableNumber % colors.length];
  };

  const getAssignedGuests = (tableNumber: number) => {
    return guests.filter(guest => guest.tableAssignment === tableNumber);
  };

  const handleAddTable = (data: any) => {
    const tableData = {
      tableNumber: data.tableNumber,
      capacity: parseInt(data.capacity),
      positionX: 100,
      positionY: 100,
      shape: data.shape,
    };
    createTableMutation.mutate(tableData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-playfair font-semibold text-gray-800">Reception Layout</h4>
        <div className="flex space-x-2">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="wedding-btn">
                <Plus className="w-4 h-4 mr-1" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
              </DialogHeader>
              <AddTableForm onSubmit={handleAddTable} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            <Save className="w-4 h-4 mr-1" />
            Save Layout
          </Button>
        </div>
      </div>

      {/* Drag and Drop Area */}
      <div
        ref={chartRef}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[400px] relative wedding-gradient bg-opacity-20"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Stage indicator */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-700">Stage</span>
        </div>

        {/* Tables */}
        {tables.map((table) => {
          const assignedGuests = getAssignedGuests(table.tableNumber);
          return (
            <div
              key={table.id}
              className={`absolute cursor-move hover:shadow-xl transition-shadow ${
                table.shape === "rectangular" ? "w-32 h-16" : "w-24 h-24"
              } bg-white shadow-lg border-2 flex items-center justify-center ${getTableShape(table.shape)} ${getTableColor(table.tableNumber)}`}
              style={{
                left: `${table.positionX}px`,
                top: `${table.positionY}px`,
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, table)}
              onClick={() => setSelectedTable(table)}
            >
              <div className="text-center">
                <div className="text-sm font-bold text-white">Table {table.tableNumber}</div>
                <div className="text-xs text-white">{assignedGuests.length}/{table.capacity} seats</div>
              </div>
            </div>
          );
        })}

        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>Drag and drop tables here to arrange your seating layout</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Table Info */}
      {selectedTable && (
        <div className="bg-white rounded-lg p-4 border border-soft-blush">
          <h5 className="font-medium text-gray-800 mb-2">Table {selectedTable.tableNumber}</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Capacity:</span> {selectedTable.capacity} seats
            </div>
            <div>
              <span className="text-gray-600">Shape:</span> {selectedTable.shape}
            </div>
          </div>
          <div className="mt-3">
            <span className="text-gray-600 text-sm">Assigned Guests:</span>
            <div className="mt-1 space-y-1">
              {getAssignedGuests(selectedTable.tableNumber).map((guest) => (
                <div key={guest.id} className="text-sm text-gray-700">
                  {guest.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddTableForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: "",
    shape: "round",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tableNumber">Table Number</Label>
        <Input
          id="tableNumber"
          type="number"
          value={formData.tableNumber}
          onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
          className="wedding-input"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          className="wedding-input"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shape">Shape</Label>
        <Select
          value={formData.shape}
          onValueChange={(value) => setFormData({ ...formData, shape: value })}
        >
          <SelectTrigger className="wedding-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="rectangular">Rectangular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" className="wedding-btn">
          Add Table
        </Button>
      </div>
    </form>
  );
}
