
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientsOverview } from './ClientsOverview';
import { ClientProfilesTable } from './ClientProfilesTable';
import { CommunicationHistory } from './CommunicationHistory';
import { FollowUpScheduler } from './FollowUpScheduler';

export function AdminClientManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Client Management</h2>
        <p className="text-gray-300">
          Manage client profiles, track communication history, and schedule follow-ups
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-orange-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="profiles" className="text-gray-300 data-[state=active]:text-orange-400">
            Client Profiles
          </TabsTrigger>
          <TabsTrigger value="communication" className="text-gray-300 data-[state=active]:text-orange-400">
            Communication
          </TabsTrigger>
          <TabsTrigger value="followups" className="text-gray-300 data-[state=active]:text-orange-400">
            Follow-ups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ClientsOverview key={refreshKey} />
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <ClientProfilesTable key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationHistory key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="followups" className="space-y-6">
          <FollowUpScheduler key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
