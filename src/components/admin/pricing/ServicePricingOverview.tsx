import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Euro, TrendingUp, TrendingDown, Percent } from 'lucide-react';

export function ServicePricingOverview() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-with-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_pricing(*)
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-orange-900/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => {
        const activePricingRules = service.service_pricing?.filter(p => p.is_active) || [];
        const hasPromotional = activePricingRules.some(p => p.pricing_type === 'promotional');
        const hasPeakPricing = activePricingRules.some(p => p.pricing_type === 'peak');
        const hasOffPeakPricing = activePricingRules.some(p => p.pricing_type === 'off_peak');

        return (
          <Card key={service.id} className="bg-gray-800/50 border-orange-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="truncate">{service.name}</span>
                <Euro className="w-5 h-5 text-orange-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  €{service.price}
                </div>
                <div className="text-sm text-gray-400">Basisprijs</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Actieve Regels:</span>
                  <span className="text-sm text-orange-400">{activePricingRules.length}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {hasPromotional && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/20">
                      <Percent className="w-3 h-3 mr-1" />
                      Promotie
                    </Badge>
                  )}
                  {hasPeakPricing && (
                    <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/20">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Piek
                    </Badge>
                  )}
                  {hasOffPeakPricing && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Daltarief
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Duur: {service.duration} minuten
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
