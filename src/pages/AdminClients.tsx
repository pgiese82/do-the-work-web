
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminClientManager } from '@/components/admin/clients/AdminClientManager';

const AdminClients = () => {
  return (
    <AdminLayout>
      <AdminClientManager />
    </AdminLayout>
  );
};

export default AdminClients;
