
import React from 'react';
import { AdminClientManager } from '@/components/admin/clients/AdminClientManager';

const AdminClients = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          Manage client profiles, track communication history, and schedule follow-ups.
        </p>
      </div>
      
      <AdminClientManager />
    </div>
  );
};

export default AdminClients;
