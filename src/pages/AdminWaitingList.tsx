
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminWaitingListManager } from '@/components/admin/waitinglist/AdminWaitingListManager';

const AdminWaitingList = () => {
  return (
    <AdminLayout>
      <AdminWaitingListManager />
    </AdminLayout>
  );
};

export default AdminWaitingList;
