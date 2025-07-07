import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Phone, Mail, Globe, MapPin, DollarSign, Check, X } from "lucide-react";
import VendorForm from "@/components/vendor-form";
import type { Vendor } from "@shared/schema";

export default function Vendors() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: vendors = [], isLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const bookedVendors = vendors.filter(v => v.isBooked);
  const unbookedVendors = vendors.filter(v => !v.isBooked);

  const categorizedVendors = vendors.reduce((acc, vendor) => {
    if (!acc[vendor.category]) {
      acc[vendor.category] = [];
    }
    acc[vendor.category].push(vendor);
    return acc;
  }, {} as Record<string, Vendor[]>);

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedVendor(null);
  };

  const totalContractAmount = bookedVendors.reduce((sum, vendor) => {
    return sum + (vendor.contractAmount ? parseFloat(vendor.contractAmount) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-cream-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-semibold text-gray-800 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Manage your wedding vendors and contacts</p>
        </div>

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-800">{vendors.length}</p>
                </div>
                <div className="w-8 h-8 bg-dusty-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{vendors.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Booked</p>
                  <p className="text-2xl font-bold text-green-600">{bookedVendors.length}</p>
                </div>
                <Check className="text-green-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{unbookedVendors.length}</p>
                </div>
                <X className="text-yellow-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Contracts</p>
                  <p className="text-2xl font-bold text-gray-800">${totalContractAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="text-rose-gold text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor List */}
        <Card className="wedding-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-playfair font-semibold text-gray-800">Vendors</CardTitle>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="wedding-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedVendor ? "Edit Vendor" : "Add New Vendor"}
                    </DialogTitle>
                  </DialogHeader>
                  <VendorForm
                    vendor={selectedVendor}
                    onClose={handleFormClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading vendors...</p>
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No vendors added yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(categorizedVendors).map(([category, vendorList]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize border-b border-gray-200 pb-2">
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {vendorList.map((vendor) => (
                        <div
                          key={vendor.id}
                          className="flex items-center justify-between p-4 bg-warm-gray rounded-lg hover:bg-opacity-70 transition-colors cursor-pointer"
                          onClick={() => handleEditVendor(vendor)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{vendor.name}</h4>
                              <Badge variant={vendor.isBooked ? "default" : "secondary"}>
                                {vendor.isBooked ? "Booked" : "Pending"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              {vendor.contactName && (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">Contact:</span>
                                  <span>{vendor.contactName}</span>
                                </div>
                              )}
                              {vendor.contractAmount && (
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="w-4 h-4" />
                                  <span>${parseFloat(vendor.contractAmount).toLocaleString()}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 mt-2">
                              {vendor.phone && (
                                <button
                                  className="flex items-center space-x-1 text-rose-gold hover:text-opacity-80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`tel:${vendor.phone}`);
                                  }}
                                >
                                  <Phone className="w-4 h-4" />
                                  <span className="text-sm">{vendor.phone}</span>
                                </button>
                              )}
                              {vendor.email && (
                                <button
                                  className="flex items-center space-x-1 text-rose-gold hover:text-opacity-80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`mailto:${vendor.email}`);
                                  }}
                                >
                                  <Mail className="w-4 h-4" />
                                  <span className="text-sm">{vendor.email}</span>
                                </button>
                              )}
                              {vendor.website && (
                                <button
                                  className="flex items-center space-x-1 text-rose-gold hover:text-opacity-80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(vendor.website, '_blank');
                                  }}
                                >
                                  <Globe className="w-4 h-4" />
                                  <span className="text-sm">Website</span>
                                </button>
                              )}
                              {vendor.address && (
                                <div className="flex items-center space-x-1 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{vendor.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
