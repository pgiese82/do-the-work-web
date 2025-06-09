
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvailabilityRulesTable } from './AvailabilityRulesTable';
import { CreateAvailabilityRuleModal } from './CreateAvailabilityRuleModal';
import { AvailabilityOverview } from './AvailabilityOverview';
import { Clock, Plus, Settings } from 'lucide-react';

export function AdminAvailabilityManager() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Availability Management</h2>
          <p className="text-gray-300">
            Manage booking schedules, notice requirements, and capacity limits
          </p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-700">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-orange-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="rules" className="text-gray-300 data-[state=active]:text-orange-400">
            Availability Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AvailabilityOverview key={refreshKey} />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <AvailabilityRulesTable key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>
      </Tabs>

      <CreateAvailabilityRuleModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => {
          handleRefresh();
          setCreateModalOpen(false);
        }}
      />
    </div>
  );
}
