
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

      <TabsContent value="overview">
        <ClientsOverview key={refreshKey} />
      </TabsContent>

      <TabsContent value="profiles">
        <ClientProfilesTable key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="communication">
        <CommunicationHistory key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="followups">
        <FollowUpScheduler key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>
    </Tabs>
  );
}
