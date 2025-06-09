
import React from 'react';
import { AdminBookingsTable } from '@/components/admin/bookings/AdminBookingsTable';

const AdminBookings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          Manage all client bookings, payments, and scheduling.
        </p>
      </div>
      
      <AdminBookingsTable />
    </div>
  );
};

export default AdminBookings;
