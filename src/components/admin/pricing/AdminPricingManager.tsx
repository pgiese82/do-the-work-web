
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PricingRulesTable } from './PricingRulesTable';
import { CreatePricingRuleModal } from './CreatePricingRuleModal';
import { ServicePricingOverview } from './ServicePricingOverview';
import { DollarSign, Plus, TrendingUp } from 'lucide-react';

export function AdminPricingManager() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Pricing Management</h2>
          <p className="text-gray-300">
            Manage service pricing, promotional rates, and peak/off-peak pricing
          </p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Pricing Rule
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-orange-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="rules" className="text-gray-300 data-[state=active]:text-orange-400">
            Pricing Rules
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-orange-400">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ServicePricingOverview key={refreshKey} />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <PricingRulesTable key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gray-800/50 border-orange-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Pricing Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Pricing analytics will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreatePricingRuleModal
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
