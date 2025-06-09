
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Document Management</h2>
        <p className="text-gray-300">
          Manage client documents, templates, assignments, and automated delivery
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-700">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-orange-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-gray-300 data-[state=active]:text-orange-400">
            Templates
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-gray-300 data-[state=active]:text-orange-400">
            Client Documents
          </TabsTrigger>
          <TabsTrigger value="assignments" className="text-gray-300 data-[state=active]:text-orange-400">
            Assignments
          </TabsTrigger>
          <TabsTrigger value="delivery" className="text-gray-300 data-[state=active]:text-orange-400">
            Delivery Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DocumentOverview key={refreshKey} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <DocumentTemplates key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <ClientDocuments key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <DocumentAssignments key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <DocumentDeliveryLog key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
