
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientLifecycleTracker } from './ClientLifecycleTracker';
import { ClientSegmentation } from './ClientSegmentation';
import { ProspectsOverview } from './ProspectsOverview';

export function ClientsOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Client Management Overview</h2>
        <p className="text-muted-foreground">
          Comprehensive client lifecycle tracking, segmentation, automated follow-up management en prospect beheer.
        </p>
      </div>

      <Tabs defaultValue="prospects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle Tracking</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation & Targeting</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects">
          <ProspectsOverview />
        </TabsContent>

        <TabsContent value="lifecycle">
          <ClientLifecycleTracker />
        </TabsContent>

        <TabsContent value="segmentation">
          <ClientSegmentation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
