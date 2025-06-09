
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EnhancedBookingsTable } from '@/components/admin/bookings/EnhancedBookingsTable';

const AdminBookings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Boekingen Beheer</h1>
          <p className="text-muted-foreground">
            Beheer alle klantboekingen met uitgebreide zoek-, filter- en bulkoperaties.
          </p>
        </div>
        
        <EnhancedBookingsTable />
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
