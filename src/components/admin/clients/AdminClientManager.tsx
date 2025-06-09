
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
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="profiles">Client Profiles</TabsTrigger>
        <TabsTrigger value="communication">Communication</TabsTrigger>
        <TabsTrigger value="followups">Follow-ups</TabsTrigger>
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
  );
}
