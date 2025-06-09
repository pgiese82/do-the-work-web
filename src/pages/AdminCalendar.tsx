
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminCalendar } from '@/components/admin/calendar/AdminCalendar';

const AdminCalendarPage = () => {
  return (
    <AdminLayout>
      <AdminCalendar />
    </AdminLayout>
  );
};

export default AdminCalendarPage;
