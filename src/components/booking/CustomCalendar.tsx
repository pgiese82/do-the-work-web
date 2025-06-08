
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, Check } from 'lucide-react';
import { format, addDays, isSameDay, isToday, isBefore, getDay } from 'date-fns';
import { nl } from 'date-fns/locale';

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

interface CustomCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  serviceDuration: number;
  onConfirm: () => void;
  loading?: boolean;
}

const CustomCalendar = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  serviceDuration,
  onConfirm,
  loading = false
}: CustomCalendarProps) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [confirming, setConfirming] = useState(false);

  // Business hours: Monday-Friday 9:00-17:00, Saturday 9:00-15:00
  const businessHours = {
    monday: { start: 9, end: 17 },
    tuesday: { start: 9, end: 17 },
    wednesday: { start: 9, end: 17 },
    thursday: { start: 9, end: 17 },
    friday: { start: 9, end: 17 },
    saturday: { start: 9, end: 15 },
    sunday: null // Closed
  };

  // Generate time slots for the selected date
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const dayOfWeek = getDay(selectedDate);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof businessHours;
    const hours = businessHours[dayName];

    if (!hours) {
      setAvailableSlots([]);
      return;
    }

    const slots: TimeSlot[] = [];
    const slotDuration = 60; // 60 minutes per slot
    const serviceDurationHours = serviceDuration / 60;
    
    // Generate slots every 30 minutes
    for (let hour = hours.start; hour < hours.end; hour += 0.5) {
      const wholeHour = Math.floor(hour);
      const minutes = (hour % 1) * 60;
      const timeString = `${wholeHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Check if there's enough time for the service before closing
      const slotEndTime = hour + serviceDurationHours;
      const isAvailable = slotEndTime <= hours.end;
      
      // Mock some booked slots for demonstration
      const isBooked = ['14:00', '15:30'].includes(timeString) && isToday(selectedDate);
      
      slots.push({
        time: timeString,
        available: isAvailable && !isBooked,
        booked: isBooked
      });
    }

    setAvailableSlots(slots);
  }, [selectedDate, serviceDuration]);

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, new Date())) {
      return true;
    }
    
    // Disable Sundays
    const dayOfWeek = getDay(date);
    if (dayOfWeek === 0) {
      return true;
    }
    
    // Mock blocked dates (e.g., holidays)
    const blockedDates = [
      new Date(2024, 11, 25), // Christmas
      new Date(2024, 11, 26), // Boxing Day
      new Date(2025, 0, 1),   // New Year
    ];
    
    return blockedDates.some(blockedDate => isSameDay(date, blockedDate));
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      onConfirm();
      setConfirming(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Selecteer een datum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={isDateDisabled}
            initialFocus
            className="rounded-md border pointer-events-auto"
          />
          
          {selectedDate && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                Geselecteerde datum: {format(selectedDate, "EEEE d MMMM yyyy", { locale: nl })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Beschikbare tijden
            </CardTitle>
            <p className="text-sm text-gray-600">
              Serviceduur: {serviceDuration} minuten
            </p>
          </CardHeader>
          <CardContent>
            {availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Geen beschikbare tijden op deze datum</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => slot.available && onTimeSelect(slot.time)}
                    className={`
                      ${slot.available 
                        ? selectedTime === slot.time 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'hover:bg-orange-50 hover:border-orange-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                      ${slot.booked ? 'bg-red-100 text-red-600 hover:bg-red-100' : ''}
                    `}
                  >
                    {slot.time}
                    {slot.booked && (
                      <Badge variant="destructive" className="ml-1 text-xs">
                        Bezet
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}
            
            {selectedTime && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Geselecteerde tijd: {selectedTime} - {
                    format(
                      new Date(selectedDate.getTime() + (parseInt(selectedTime.split(':')[0]) * 60 + parseInt(selectedTime.split(':')[1]) + serviceDuration) * 60000),
                      'HH:mm'
                    )
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Bevestig je boeking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Datum:</span>
                <span>{format(selectedDate, "EEEE d MMMM yyyy", { locale: nl })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tijd:</span>
                <span>
                  {selectedTime} - {
                    format(
                      new Date(selectedDate.getTime() + (parseInt(selectedTime.split(':')[0]) * 60 + parseInt(selectedTime.split(':')[1]) + serviceDuration) * 60000),
                      'HH:mm'
                    )
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duur:</span>
                <span>{serviceDuration} minuten</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tijdzone:</span>
                <span>Europe/Amsterdam (CET)</span>
              </div>
            </div>
            
            <Button 
              onClick={handleConfirm}
              disabled={loading || confirming}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {confirming ? 'Bevestigen...' : loading ? 'Bezig...' : 'Boeking bevestigen'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>Beschikbaar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span>Geselecteerd</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Niet beschikbaar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>Bezet</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomCalendar;
