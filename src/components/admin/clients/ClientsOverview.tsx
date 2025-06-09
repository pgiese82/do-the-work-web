
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientLifecycleTracker } from './ClientLifecycleTracker';
import { ClientSegmentation } from './ClientSegmentation';

export function ClientsOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Client Management Overview</h2>
        <p className="text-muted-foreground">
          Comprehensive client lifecycle tracking, segmentation, and automated follow-up management.
        </p>
      </div>

      <Tabs defaultValue="lifecycle" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lifecycle">Lifecycle Tracking</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation & Targeting</TabsTrigger>
        </TabsList>

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
