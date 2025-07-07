import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Clock, MapPin, Calendar } from "lucide-react";
import TimelineForm from "@/components/timeline-form";
import type { TimelineEvent } from "@shared/schema";

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: events = [], isLoading } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/timeline"],
  });

  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(`2000-01-01 ${a.startTime}`);
    const timeB = new Date(`2000-01-01 ${b.startTime}`);
    return timeA.getTime() - timeB.getTime();
  });

  const handleEditEvent = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "ceremony":
        return "bg-rose-gold";
      case "reception":
        return "bg-sage-green";
      case "photo":
        return "bg-dusty-blue";
      case "cocktail":
        return "bg-champagne-gold";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-cream-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-semibold text-gray-800 mb-2">Wedding Timeline</h1>
          <p className="text-gray-600">Plan your perfect wedding day schedule</p>
        </div>

        {/* Timeline Header */}
        <Card className="wedding-card mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-playfair font-semibold text-gray-800">Wedding Day Schedule</CardTitle>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="wedding-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedEvent ? "Edit Event" : "Add New Event"}
                    </DialogTitle>
                  </DialogHeader>
                  <TimelineForm
                    event={selectedEvent}
                    onClose={handleFormClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading timeline events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No timeline events added yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline connector */}
                    {index < sortedEvents.length - 1 && (
                      <div className="absolute left-6 top-16 w-px h-16 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getEventTypeColor(event.eventType)}`}>
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Event details */}
                      <div 
                        className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-soft-blush hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleEditEvent(event)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded capitalize">
                            {event.eventType}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-gray-700 text-sm">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Types Legend */}
        <Card className="wedding-card">
          <CardHeader>
            <CardTitle className="text-lg font-playfair font-semibold text-gray-800">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-rose-gold rounded-full"></div>
                <span className="text-sm text-gray-600">Ceremony</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-sage-green rounded-full"></div>
                <span className="text-sm text-gray-600">Reception</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-dusty-blue rounded-full"></div>
                <span className="text-sm text-gray-600">Photo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-champagne-gold rounded-full"></div>
                <span className="text-sm text-gray-600">Cocktail</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Other</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
