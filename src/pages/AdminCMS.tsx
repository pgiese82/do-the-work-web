
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminCMSManager } from '@/components/admin/cms/AdminCMSManager';

const AdminCMS = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Beheer</h1>
          <p className="text-muted-foreground">
            Beheer website inhoud, instellingen en aankondigingen.
          </p>
        </div>
        
        <AdminCMSManager />
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;
