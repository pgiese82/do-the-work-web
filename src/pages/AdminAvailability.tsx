
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminAvailabilityManager } from '@/components/admin/availability/AdminAvailabilityManager';

const AdminAvailability = () => {
  return (
    <AdminLayout>
      <AdminAvailabilityManager />
    </AdminLayout>
  );
};

export default AdminAvailability;
