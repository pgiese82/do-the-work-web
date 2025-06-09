
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WaitingListTable } from './WaitingListTable';
import { WaitingListStats } from './WaitingListStats';
import { WaitingListNotifications } from './WaitingListNotifications';
import { Users, Mail, BarChart3 } from 'lucide-react';

export function AdminWaitingListManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Waiting List Management</h2>
        <p className="text-gray-300">
          Manage client waiting lists and send notifications when slots become available
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-orange-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="list" className="text-gray-300 data-[state=active]:text-orange-400">
            Waiting List
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:text-orange-400">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WaitingListStats key={refreshKey} />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <WaitingListTable key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <WaitingListNotifications key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
