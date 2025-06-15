import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types/calendar';

interface CalendarMonthViewProps {
  month: Date;
  bookings: Booking[];
  onBookingDrop: (bookingId: string, newDateTime: Date) => void;
  onBookingDrag: (booking: Booking | null) => void;
}

export function CalendarMonthView({
  month,
  bookings,
  onBookingDrop,
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
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 gap-0">
          {/* Day headers */}
          {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(day => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-foreground bg-muted/30 border-b border-border">
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
                    className={`min-h-[140px] p-2 border-b border-border/50 border-r border-border/50 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary/10' : 'bg-background hover:bg-muted/30'
                    } ${!isCurrentMonth ? 'opacity-40 bg-muted/10' : ''} ${
                      isToday ? 'ring-2 ring-primary ring-inset' : ''
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-primary' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
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
                              className={`p-2 text-xs cursor-move border-l-2 transition-all bg-background hover:shadow-md border border-border ${
                                getStatusColor(booking.status)
                              } ${
                                snapshot.isDragging ? 'shadow-lg rotate-1 scale-105' : ''
                              }`}
                              onMouseEnter={() => onBookingDrag(booking)}
                              onMouseLeave={() => onBookingDrag(null)}
                            >
                              <div className="truncate text-foreground font-semibold mb-1">
                                {format(parseISO(booking.date_time), 'HH:mm')}
                              </div>
                              <div className="truncate text-foreground font-medium">
                                {booking.users.name}
                              </div>
                              <div className="truncate text-muted-foreground text-xs">
                                {booking.services.name}
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-muted-foreground font-medium pl-2">
                          +{dayBookings.length - 3} meer
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
      </div>
    </DragDropContext>
  );
}
