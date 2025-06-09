
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
      <div className="space-y-2">
        {hours.map(hour => {
          const hourBookings = getBookingsForHour(hour);
          
          return (
            <div key={hour} className="flex">
              {/* Time label */}
              <div className="w-20 text-right pr-4 py-2 text-sm text-gray-400 font-medium">
                {formatTime(hour)}
              </div>
              
              {/* Time slot */}
              <Droppable droppableId={hour.toString()}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[80px] p-3 border border-white/10 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-orange-500/20' : 'bg-white/5'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
                              className={`p-3 border-l-4 cursor-move transition-all ${
                                getServiceColor(booking.services.id)
                              } ${getStatusColor(booking.status)} ${
                                snapshot.isDragging ? 'opacity-75 rotate-2 scale-105' : ''
                              }`}
                              onMouseEnter={() => onBookingDrag(booking)}
                              onMouseLeave={() => onBookingDrag(null)}
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-semibold text-white">
                                      {booking.users.name}
                                    </div>
                                    <div className="text-sm text-gray-300">
                                      {booking.users.email}
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {format(parseISO(booking.date_time), 'HH:mm')}
                                  </span>
                                </div>
                                
                                <div className="text-sm text-gray-300">
                                  {booking.services.name}
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <Badge 
                                    className={`text-xs ${
                                      booking.status === 'confirmed' ? 'bg-green-600' :
                                      booking.status === 'pending' ? 'bg-yellow-600' :
                                      booking.status === 'cancelled' ? 'bg-red-600' :
                                      'bg-gray-600'
                                    }`}
                                  >
                                    {booking.status}
                                  </Badge>
                                  <Badge 
                                    className={`text-xs ${
                                      booking.payment_status === 'paid' ? 'bg-green-600' :
                                      booking.payment_status === 'pending' ? 'bg-yellow-600' :
                                      'bg-red-600'
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
