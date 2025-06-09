
import React from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
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

interface CalendarWeekViewProps {
  startDate: Date;
  bookings: Booking[];
  onBookingDrop: (bookingId: string, newDateTime: Date) => void;
  getServiceColor: (serviceId: string) => string;
  onBookingDrag: (booking: Booking | null) => void;
}

export function CalendarWeekView({
  startDate,
  bookings,
  onBookingDrop,
  getServiceColor,
  onBookingDrag
}: CalendarWeekViewProps) {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday start
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  const getBookingsForTimeSlot = (date: Date, hour: number) => {
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

    const [dayIndex, hour] = result.destination.droppableId.split('-').map(Number);
    const targetDate = addDays(weekStart, dayIndex);
    const newDateTime = new Date(targetDate);
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
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-0 border-b border-gray-200">
            <div className="h-16 bg-gray-50 border-r border-gray-200"></div>
            {days.map((day, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 border-r border-gray-200 last:border-r-0">
                <div className="text-sm text-gray-600 font-medium">
                  {format(day, 'EEE')}
                </div>
                <div className="text-lg text-gray-900 font-semibold mt-1">
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots grid */}
          <div className="grid grid-cols-8 gap-0">
            {hours.map(hour => (
              <React.Fragment key={hour}>
                {/* Time label */}
                <div className="text-right pr-3 py-4 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 border-b border-gray-100">
                  {formatTime(hour)}
                </div>
                
                {/* Day columns */}
                {days.map((day, dayIndex) => {
                  const timeSlotBookings = getBookingsForTimeSlot(day, hour);
                  
                  return (
                    <Droppable 
                      key={`${dayIndex}-${hour}`} 
                      droppableId={`${dayIndex}-${hour}`}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[70px] p-2 border-r border-gray-200 border-b border-gray-100 last:border-r-0 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {timeSlotBookings.map((booking, index) => (
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
                                  className={`p-2 mb-1 border-l-4 cursor-move transition-all bg-white hover:shadow-md border border-gray-200 ${
                                    getStatusColor(booking.status)
                                  } ${
                                    snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''
                                  }`}
                                  onMouseEnter={() => onBookingDrag(booking)}
                                  onMouseLeave={() => onBookingDrag(null)}
                                >
                                  <div className="text-xs space-y-1">
                                    <div className="font-semibold text-gray-900 truncate">
                                      {booking.users.name}
                                    </div>
                                    <div className="text-gray-700 truncate font-medium">
                                      {booking.services.name}
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600 font-medium">
                                        {format(parseISO(booking.date_time), 'HH:mm')}
                                      </span>
                                      <Badge 
                                        className={`text-xs ${
                                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}
                                      >
                                        {booking.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
