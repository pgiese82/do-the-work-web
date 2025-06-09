
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
          <h2 className="text-3xl font-black text-white mb-2">Notifications</h2>
          <p className="text-gray-300">
            Manage your notification preferences and view notification history.
          </p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            <NotificationPanel />
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
