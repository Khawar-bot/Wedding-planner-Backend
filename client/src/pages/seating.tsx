import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Users, MapPin } from "lucide-react";
import SeatingChart from "@/components/seating-chart";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SeatingTable, Guest } from "@shared/schema";

export default function Seating() {
  const { toast } = useToast();
  const [selectedTableForAssignment, setSelectedTableForAssignment] = useState<number | null>(null);

  const { data: tables = [], isLoading: tablesLoading } = useQuery<SeatingTable[]>({
    queryKey: ["/api/seating"],
  });

  const { data: guests = [], isLoading: guestsLoading } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const updateGuestMutation = useMutation({
    mutationFn: async ({ id, tableAssignment }: { id: number; tableAssignment: number | null }) => {
      const response = await fetch(`/api/guests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableAssignment }),
      });
      if (!response.ok) throw new Error("Failed to update guest");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({ title: "Guest table assignment updated" });
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/seating/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete table");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seating"] });
      toast({ title: "Table deleted successfully" });
    },
  });

  const sortedTables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);
  const unassignedGuests = guests.filter(guest => !guest.tableAssignment);
  const confirmedGuests = guests.filter(guest => guest.rsvpStatus === "confirmed");

  const getTableAssignments = () => {
    return sortedTables.map(table => {
      const assignedGuests = guests.filter(guest => guest.tableAssignment === table.tableNumber);
      return {
        table,
        guests: assignedGuests,
        available: table.capacity - assignedGuests.length,
      };
    });
  };

  const handleGuestAssignment = (guestId: number, tableNumber: number | null) => {
    updateGuestMutation.mutate({ id: guestId, tableAssignment: tableNumber });
  };

  const handleDeleteTable = (tableId: number) => {
    if (confirm("Are you sure you want to delete this table? Guests assigned to this table will be unassigned.")) {
      deleteTableMutation.mutate(tableId);
    }
  };

  if (tablesLoading || guestsLoading) {
    return (
      <div className="min-h-screen bg-cream-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Loading seating arrangement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-semibold text-gray-800 mb-2">Seating Arrangement</h1>
          <p className="text-gray-600">Plan your reception seating with drag-and-drop table arrangement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seating Chart */}
          <div className="lg:col-span-2">
            <Card className="wedding-card">
              <CardContent className="p-6">
                <SeatingChart tables={tables} />
              </CardContent>
            </Card>
          </div>

          {/* Table Assignments */}
          <div className="space-y-6">
            {/* Unassigned Guests */}
            <Card className="wedding-card">
              <CardHeader>
                <CardTitle className="text-lg font-playfair font-semibold text-gray-800">
                  Unassigned Guests ({unassignedGuests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unassignedGuests.length === 0 ? (
                  <p className="text-sm text-gray-600">All guests have been assigned to tables</p>
                ) : (
                  <div className="space-y-2">
                    {unassignedGuests.map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-2 bg-warm-gray rounded">
                        <div>
                          <span className="text-sm font-medium text-gray-800">{guest.name}</span>
                          {guest.rsvpStatus !== "confirmed" && (
                            <span className="text-xs text-yellow-600 ml-2">({guest.rsvpStatus})</span>
                          )}
                        </div>
                        <Select
                          value=""
                          onValueChange={(value) => handleGuestAssignment(guest.id, parseInt(value))}
                        >
                          <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue placeholder="Table" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortedTables.map((table) => {
                              const assignedCount = guests.filter(g => g.tableAssignment === table.tableNumber).length;
                              const available = table.capacity - assignedCount;
                              return (
                                <SelectItem
                                  key={table.id}
                                  value={table.tableNumber.toString()}
                                  disabled={available <= 0}
                                >
                                  Table {table.tableNumber} ({available} left)
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Table Assignments */}
            <Card className="wedding-card">
              <CardHeader>
                <CardTitle className="text-lg font-playfair font-semibold text-gray-800">Table Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTableAssignments().map(({ table, guests: tableGuests, available }) => (
                    <div key={table.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">Table {table.tableNumber}</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {tableGuests.length}/{table.capacity} seats
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTable(table.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {tableGuests.length === 0 ? (
                        <p className="text-sm text-gray-500">No guests assigned</p>
                      ) : (
                        <div className="space-y-1">
                          {tableGuests.map((guest) => (
                            <div key={guest.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{guest.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGuestAssignment(guest.id, null)}
                                className="text-xs text-gray-500 hover:text-red-600"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {available > 0 && (
                        <p className="text-xs text-green-600 mt-2">{available} seats available</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="wedding-card">
              <CardHeader>
                <CardTitle className="text-lg font-playfair font-semibold text-gray-800">Seating Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tables:</span>
                    <span className="font-medium">{tables.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Capacity:</span>
                    <span className="font-medium">{tables.reduce((sum, t) => sum + t.capacity, 0)} seats</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confirmed Guests:</span>
                    <span className="font-medium">{confirmedGuests.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unassigned:</span>
                    <span className="font-medium text-yellow-600">{unassignedGuests.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
