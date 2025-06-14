
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientLifecycleTracker } from './ClientLifecycleTracker';
import { ClientSegmentation } from './ClientSegmentation';
import { ProspectsOverview } from './ProspectsOverview';

export function ClientsOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overzicht Klantbeheer</h2>
        <p className="text-muted-foreground">
          Een uitgebreid overzicht voor het volgen van de klantlevenscyclus, segmentatie, geautomatiseerd follow-up beheer en prospectbeheer.
        </p>
      </div>

      <Tabs defaultValue="prospects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="lifecycle">Levenscyclus</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentatie & Targeting</TabsTrigger>
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
