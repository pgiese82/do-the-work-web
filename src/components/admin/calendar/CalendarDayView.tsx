
import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  users: {
    name: string;
    email: string;
  };
  services: {
    name: string;
    duration: number;
    id: string;
  };
}

interface CalendarDayViewProps {
  date: Date;
  bookings: Booking[];
  onBookingDrop: (bookingId: string, newDateTime: Date) => void;
  getServiceColor: (serviceId: string) => string;
  onBookingDrag: (booking: Booking | null) => void;
}

export function CalendarDayView({
  date,
  bookings,
  onBookingDrop,
  getServiceColor,
  onBookingDrag
}: CalendarDayViewProps) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  const getBookingsForHour = (hour: number) => {
    return bookings.filter(booking => {
      const bookingDate = parseISO(booking.date_time);
      return (
        isSameDay(bookingDate, date) &&
        bookingDate.getHours() >= hour &&
        bookingDate.getHours() < hour + 1
      );
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      onBookingDrag(null);
      return;
    }

    const hour = parseInt(result.destination.droppableId);
    const newDateTime = new Date(date);
    newDateTime.setHours(hour, 0, 0, 0);

    onBookingDrop(result.draggableId, newDateTime);
    onBookingDrag(null);
  };

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'border-l-green-500';
      case 'pending': return 'border-l-yellow-500';
      case 'completed': return 'border-l-blue-500';
      case 'cancelled': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-1">
        {hours.map(hour => {
          const hourBookings = getBookingsForHour(hour);
          
          return (
            <div key={hour} className="flex border-b border-gray-200/20">
              {/* Time label */}
              <div className="w-20 text-right pr-4 py-3 text-sm font-medium text-gray-900 bg-gray-50/10 border-r border-gray-200/20">
                {formatTime(hour)}
              </div>
              
              {/* Time slot */}
              <Droppable droppableId={hour.toString()}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[80px] p-3 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-white hover:bg-gray-50/30'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {hourBookings.map((booking, index) => (
                        <Draggable
                          key={booking.id}
                          draggableId={booking.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 border-l-4 cursor-move transition-all bg-white hover:shadow-md border border-gray-200 ${
                                getStatusColor(booking.status)
                              } ${
                                snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''
                              }`}
                              onMouseEnter={() => onBookingDrag(booking)}
                              onMouseLeave={() => onBookingDrag(null)}
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-semibold text-gray-900 text-sm">
                                      {booking.users.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {booking.users.email}
                                    </div>
                                  </div>
                                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                    {format(parseISO(booking.date_time), 'HH:mm')}
                                  </span>
                                </div>
                                
                                <div className="text-sm font-medium text-gray-800">
                                  {booking.services.name}
                                </div>
                                
                                <div className="flex justify-between items-center gap-2">
                                  <Badge 
                                    className={`text-xs font-medium ${
                                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                      'bg-gray-100 text-gray-800 border-gray-200'
                                    }`}
                                  >
                                    {booking.status}
                                  </Badge>
                                  <Badge 
                                    className={`text-xs font-medium ${
                                      booking.payment_status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                                      booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                      'bg-red-100 text-red-800 border-red-200'
                                    }`}
                                  >
                                    {booking.payment_status}
                                  </Badge>
                                </div>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
