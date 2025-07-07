import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Users, UserCheck, UserX } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import GuestForm from "@/components/guest-form";
import type { Guest } from "@shared/schema";

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: guests = [], isLoading } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const deleteGuestMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete guest");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
    },
  });

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmedGuests = guests.filter(g => g.rsvpStatus === "confirmed").length;
  const pendingGuests = guests.filter(g => g.rsvpStatus === "pending").length;
  const declinedGuests = guests.filter(g => g.rsvpStatus === "declined").length;

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsFormOpen(true);
  };

  const handleDeleteGuest = (id: number) => {
    if (confirm("Are you sure you want to delete this guest?")) {
      deleteGuestMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedGuest(null);
  };

  return (
    <div className="min-h-screen bg-cream-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-semibold text-gray-800 mb-2">Guest Management</h1>
          <p className="text-gray-600">Manage your wedding guest list and track RSVPs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Guests</p>
                  <p className="text-2xl font-bold text-gray-800">{guests.length}</p>
                </div>
                <Users className="text-rose-gold text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{confirmedGuests}</p>
                </div>
                <UserCheck className="text-green-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingGuests}</p>
                </div>
                <Users className="text-yellow-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Declined</p>
                  <p className="text-2xl font-bold text-red-600">{declinedGuests}</p>
                </div>
                <UserX className="text-red-600 text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="wedding-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-playfair font-semibold text-gray-800">Guest List</CardTitle>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="wedding-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedGuest ? "Edit Guest" : "Add New Guest"}
                    </DialogTitle>
                  </DialogHeader>
                  <GuestForm
                    guest={selectedGuest}
                    onClose={handleFormClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search guests by name or email..."
                  className="pl-10 wedding-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading guests...</p>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {searchTerm ? "No guests found matching your search." : "No guests added yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGuests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-4 bg-warm-gray rounded-lg hover:bg-opacity-70 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-rose-gold rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {guest.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">{guest.name}</h5>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                        {guest.phone && <p className="text-sm text-gray-600">{guest.phone}</p>}
                        {guest.dietaryRestrictions && (
                          <p className="text-sm text-gray-600">Dietary: {guest.dietaryRestrictions}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={guest.rsvpStatus === "confirmed" ? "default" : 
                               guest.rsvpStatus === "declined" ? "destructive" : "secondary"}
                      >
                        {guest.rsvpStatus}
                      </Badge>
                      {guest.plusOne && (
                        <Badge variant="outline">+1</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGuest(guest)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGuest(guest.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
