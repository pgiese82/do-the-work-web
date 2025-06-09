
import React from 'react';
import { AdminBookingsTable } from '@/components/admin/bookings/AdminBookingsTable';

const AdminBookings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Bookings Management</h2>
        <p className="text-gray-300">
          Manage all client bookings, payments, and scheduling.
        </p>
      </div>
      
      <AdminBookingsTable />
    </div>
  );
};

export default AdminBookings;
