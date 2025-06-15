
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types/calendar';

interface ServiceLegendProps {
    bookings: Booking[];
}

export function ServiceLegend({ bookings }: ServiceLegendProps) {
    const services = Array.from(new Set(bookings.map(b => b.services?.id).filter(Boolean)))
        .map(serviceId => {
            return bookings.find(b => b.services?.id === serviceId)?.services;
        })
        .filter((service): service is Booking['services'] => service !== undefined);

    return (
        <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Dienst Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {services.map(service => (
                    <Badge
                      key={service.id}
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium"
                    >
                      {service.name}
                    </Badge>
                ))}
              </div>
            </CardContent>
        </Card>
    );
}
