
import React from 'react';
import { BookingForm } from '@/components/booking/BookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BookSession() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Book a Session</h1>
        <p className="text-gray-300">
          Schedule your next training session with DO THE WORK
        </p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Available Services</CardTitle>
          <CardDescription className="text-gray-300">
            Choose from our available training sessions and book your preferred time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingForm />
        </CardContent>
      </Card>
    </div>
  );
}
