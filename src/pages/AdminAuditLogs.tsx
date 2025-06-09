
import React from 'react';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { AdminMiddleware } from '@/components/admin/AdminMiddleware';

const AdminAuditLogs = () => {
  return (
    <AdminMiddleware>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Audit Logs</h2>
          <p className="text-gray-300">
            Track all administrative actions and system events.
          </p>
        </div>
        
        <AuditLogViewer />
      </div>
    </AdminMiddleware>
  );
};

export default AdminAuditLogs;
