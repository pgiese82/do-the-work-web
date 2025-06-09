
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { NotificationPanel } from '@/components/admin/notifications/NotificationPanel';
import { NotificationPreferences } from '@/components/admin/notifications/NotificationPreferences';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminNotifications = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notification preferences and view notification history.
          </p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationPanel />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
