
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';
import { BookingCard } from './BookingCard';

interface Booking {
  id: string;
  date_time: string;
  status: string;
  payment_status: string;
  notes?: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

interface BookingTabsProps {
  upcomingBookings: Booking[];
  pastBookings: Booking[];
}

export function BookingTabs({ upcomingBookings, pastBookings }: BookingTabsProps) {
  const EmptyState = ({ 
    icon: Icon, 
    title, 
    description 
  }: { 
    icon: React.ElementType; 
    title: string; 
    description: string; 
  }) => (
    <Card className="border-dashed border-border/50">
      <CardContent className="text-center py-12">
        <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1">
        <TabsTrigger 
          value="upcoming" 
          className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Aankomend ({upcomingBookings.length})
        </TabsTrigger>
        <TabsTrigger 
          value="past"
          className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Vorige Sessies ({pastBookings.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4 mt-6">
        {upcomingBookings.length === 0 ? (
          <EmptyState 
            icon={Calendar}
            title="Geen aankomende sessies"
            description="Je hebt geen aankomende training sessies ingepland. Boek je volgende sessie om door te gaan met je fitness reis!"
          />
        ) : (
          <div className="grid gap-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4 mt-6">
        {pastBookings.length === 0 ? (
          <EmptyState 
            icon={TrendingUp}
            title="Geen vorige sessies"
            description="Je hebt nog geen training sessies voltooid. Je sessie geschiedenis verschijnt hier na je eerste workout."
          />
        ) : (
          <div className="grid gap-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
