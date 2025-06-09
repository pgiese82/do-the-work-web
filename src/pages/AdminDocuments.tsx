
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDocumentManager } from '@/components/admin/documents/AdminDocumentManager';

const AdminDocuments = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage document templates, assignments, and delivery tracking.
          </p>
        </div>
        
        <AdminDocumentManager />
      </div>
    </AdminLayout>
  );
};

export default AdminDocuments;
