
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { AdminMiddleware } from '@/components/admin/AdminMiddleware';

const AdminAuditLogs = () => {
  return (
    <AdminMiddleware>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">
              Track all administrative actions and system events.
            </p>
          </div>
          
          <AuditLogViewer />
        </div>
      </AdminLayout>
    </AdminMiddleware>
  );
};

export default AdminAuditLogs;
