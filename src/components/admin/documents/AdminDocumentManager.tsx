
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentOverview } from './DocumentOverview';
import { DocumentTemplates } from './DocumentTemplates';
import { ClientDocuments } from './ClientDocuments';
import { DocumentAssignments } from './DocumentAssignments';
import { DocumentDeliveryLog } from './DocumentDeliveryLog';

export function AdminDocumentManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="client-documents">Client Documents</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="delivery-log">Delivery Log</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <DocumentOverview key={refreshKey} />
      </TabsContent>

      <TabsContent value="templates" className="space-y-6">
        <DocumentTemplates key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="client-documents" className="space-y-6">
        <ClientDocuments key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="assignments" className="space-y-6">
        <DocumentAssignments key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="delivery-log" className="space-y-6">
        <DocumentDeliveryLog key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>
    </Tabs>
  );
}
