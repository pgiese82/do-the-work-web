
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon } from 'lucide-react';
import { BookingCard } from './BookingCard';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  service_id: string;
  notes?: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

interface BookingListViewProps {
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  onUpdate: () => void;
}

export function BookingListView({ upcomingBookings, pastBookings, onUpdate }: BookingListViewProps) {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white/10">
        <TabsTrigger value="upcoming" className="data-[state=active]:bg-white/20">
          Upcoming ({upcomingBookings.length})
        </TabsTrigger>
        <TabsTrigger value="past" className="data-[state=active]:bg-white/20">
          Past ({pastBookings.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4 mt-6">
        {upcomingBookings.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No upcoming bookings</h3>
              <p className="text-gray-300">You don't have any upcoming sessions scheduled.</p>
            </CardContent>
          </Card>
        ) : (
          upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onUpdate={onUpdate} />
          ))
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4 mt-6">
        {pastBookings.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No past bookings</h3>
              <p className="text-gray-300">You don't have any completed sessions yet.</p>
            </CardContent>
          </Card>
        ) : (
          pastBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onUpdate={onUpdate} />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
