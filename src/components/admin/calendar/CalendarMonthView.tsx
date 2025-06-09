
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, parseISO } from 'date-fns';
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

interface CalendarMonthViewProps {
  month: Date;
  bookings: Booking[];
  onBookingDrop: (bookingId: string, newDateTime: Date) => void;
  getServiceColor: (serviceId: string) => string;
  onBookingDrag: (booking: Booking | null) => void;
}

export function CalendarMonthView({
  month,
  bookings,
  onBookingDrop,
  getServiceColor,
  onBookingDrag
}: CalendarMonthViewProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = parseISO(booking.date_time);
      return isSameDay(bookingDate, date);
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      onBookingDrag(null);
      return;
    }

    const dayIndex = parseInt(result.destination.droppableId);
    const targetDate = days[dayIndex];
    const booking = bookings.find(b => b.id === result.draggableId);
    
    if (booking) {
      const originalDate = parseISO(booking.date_time);
      const newDateTime = new Date(targetDate);
      newDateTime.setHours(originalDate.getHours(), originalDate.getMinutes());
      
      onBookingDrop(result.draggableId, newDateTime);
    }
    onBookingDrag(null);
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
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-300 bg-white/5 rounded">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const dayBookings = getBookingsForDay(day);
          const isCurrentMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Droppable key={index} droppableId={index.toString()}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[120px] p-1 border border-white/10 rounded transition-colors ${
                    snapshot.isDraggingOver ? 'bg-orange-500/20' : 'bg-white/5'
                  } ${!isCurrentMonth ? 'opacity-50' : ''} ${
                    isToday ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-orange-400' : 'text-white'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map((booking, bookingIndex) => (
                      <Draggable
                        key={booking.id}
                        draggableId={booking.id}
                        index={bookingIndex}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-1 text-xs cursor-move border-l-2 transition-all ${
                              getServiceColor(booking.services.id)
                            } ${getStatusColor(booking.status)} ${
                              snapshot.isDragging ? 'opacity-75 rotate-1 scale-105' : ''
                            }`}
                            onMouseEnter={() => onBookingDrag(booking)}
                            onMouseLeave={() => onBookingDrag(null)}
                          >
                            <div className="truncate text-white font-medium">
                              {format(parseISO(booking.date_time), 'HH:mm')}
                            </div>
                            <div className="truncate text-gray-300">
                              {booking.users.name}
                            </div>
                            <div className="truncate text-gray-400">
                              {booking.services.name}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-gray-400 pl-1">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                  
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
