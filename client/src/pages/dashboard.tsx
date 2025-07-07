import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, DollarSign, CheckCircle, Handshake, Search, Plus, Edit, Phone, Mail } from "lucide-react";
import type { Guest, Task, BudgetItem, Vendor, WeddingDetails } from "@shared/schema";

export default function Dashboard() {
  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: budgetItems = [] } = useQuery<BudgetItem[]>({
    queryKey: ["/api/budget"],
  });

  const { data: vendors = [] } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const { data: weddingDetails } = useQuery<WeddingDetails>({
    queryKey: ["/api/wedding-details"],
  });

  // Calculate statistics
  const confirmedGuests = guests.filter(g => g.rsvpStatus === "confirmed").length;
  const totalGuests = guests.length;
  const guestProgress = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0;

  const totalBudget = budgetItems.reduce((sum, item) => sum + parseFloat(item.budgetAmount), 0);
  const spentBudget = budgetItems.reduce((sum, item) => sum + parseFloat(item.actualAmount), 0);
  const budgetProgress = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const bookedVendors = vendors.filter(v => v.isBooked).length;
  const totalVendors = vendors.length;
  const vendorProgress = totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0;

  const getCountdown = () => {
    if (!weddingDetails?.weddingDate) return { days: 0, hours: 0, minutes: 0 };
    
    const weddingDate = new Date(weddingDetails.weddingDate);
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const countdown = getCountdown();

  return (
    <div className="min-h-screen bg-cream-white">
      {/* Hero Section */}
      <section className="wedding-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
              {weddingDetails?.groomName || "Ahsan"} & {weddingDetails?.brideName || "Sobia"}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {weddingDetails?.weddingDate || "October 15, 2025"} • {weddingDetails?.venue || "Rosewood Manor"}
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div className="bg-white bg-opacity-50 rounded-lg p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-gray-800">{countdown.days}</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-gray-800">{countdown.hours}</div>
                <div className="text-sm text-gray-600">Hours</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4 min-w-[100px]">
                <div className="text-2xl font-bold text-gray-800">{countdown.minutes}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-playfair font-semibold text-gray-800 mb-8 text-center">Planning Overview</h3>
          
          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="wedding-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-rose-gold text-2xl" />
                  <span className="text-sm font-medium text-gray-500">{guestProgress}% Complete</span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800 mb-2">Guest List</CardTitle>
                <p className="text-gray-600 text-sm mb-3">
                  {confirmedGuests} of {totalGuests} confirmed
                </p>
                <Progress value={guestProgress} className="w-full" />
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-sage-green text-2xl" />
                  <span className="text-sm font-medium text-gray-500">{budgetProgress}% Used</span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800 mb-2">Budget</CardTitle>
                <p className="text-gray-600 text-sm mb-3">
                  ${spentBudget.toLocaleString()} of ${totalBudget.toLocaleString()}
                </p>
                <Progress value={budgetProgress} className="w-full" />
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="text-dusty-blue text-2xl" />
                  <span className="text-sm font-medium text-gray-500">{taskProgress}% Done</span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800 mb-2">Tasks</CardTitle>
                <p className="text-gray-600 text-sm mb-3">
                  {completedTasks} of {totalTasks} completed
                </p>
                <Progress value={taskProgress} className="w-full" />
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Handshake className="text-champagne-gold text-2xl" />
                  <span className="text-sm font-medium text-gray-500">{vendorProgress}% Booked</span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800 mb-2">Vendors</CardTitle>
                <p className="text-gray-600 text-sm mb-3">
                  {bookedVendors} of {totalVendors} booked
                </p>
                <Progress value={vendorProgress} className="w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Guest Management */}
            <div className="lg:col-span-2">
              <Card className="wedding-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-playfair font-semibold text-gray-800">Guest Management</CardTitle>
                    <Button className="wedding-btn">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Guest
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search guests..."
                        className="pl-10 wedding-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {guests.slice(0, 5).map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-4 bg-warm-gray rounded-lg hover:bg-opacity-70 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-rose-gold rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {guest.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800">{guest.name}</h5>
                            <p className="text-sm text-gray-600">{guest.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={guest.rsvpStatus === "confirmed" ? "default" : "secondary"}>
                            {guest.rsvpStatus}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline & Tasks */}
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <Card className="wedding-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-playfair font-semibold text-gray-800">Upcoming Tasks</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <Checkbox
                          checked={task.isCompleted}
                          className="focus:ring-rose-gold"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Contacts */}
              <Card className="wedding-card">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair font-semibold text-gray-800">Vendor Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendors.slice(0, 3).map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between p-4 bg-warm-gray rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-800">{vendor.name}</h5>
                          <p className="text-sm text-gray-600">Contact: {vendor.contactName}</p>
                          <p className="text-sm text-gray-600">Phone: {vendor.phone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
