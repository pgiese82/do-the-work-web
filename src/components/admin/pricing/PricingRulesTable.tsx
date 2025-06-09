
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Edit, Trash2, DollarSign } from 'lucide-react';

interface PricingRulesTableProps {
  onUpdate: () => void;
}

export function PricingRulesTable({ onUpdate }: PricingRulesTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pricingRules = [], isLoading } = useQuery({
    queryKey: ['pricing-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_pricing')
        .select(`
          *,
          service:services(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('service_pricing')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
      onUpdate();
      toast({
        title: 'Success',
        description: 'Pricing rule updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update pricing rule',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_pricing')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-rules'] });
      onUpdate();
      toast({
        title: 'Success',
        description: 'Pricing rule deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete pricing rule',
        variant: 'destructive',
      });
    },
  });

  const getPricingTypeBadge = (type: string) => {
    const variants = {
      promotional: 'bg-green-500/20 text-green-400 border-green-500/20',
      peak: 'bg-red-500/20 text-red-400 border-red-500/20',
      off_peak: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      base: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
    };

    return (
      <Badge variant="secondary" className={variants[type] || variants.base}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return 'No date restrictions';
    if (startDate && !endDate) return `From ${format(new Date(startDate), 'MMM dd, yyyy')}`;
    if (!startDate && endDate) return `Until ${format(new Date(endDate), 'MMM dd, yyyy')}`;
    return `${format(new Date(startDate!), 'MMM dd')} - ${format(new Date(endDate!), 'MMM dd, yyyy')}`;
  };

  const formatTimeRange = (startTime: string | null, endTime: string | null) => {
    if (!startTime && !endTime) return 'All day';
    return `${startTime || '00:00'} - ${endTime || '23:59'}`;
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            Pricing Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">Loading pricing rules...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-orange-400" />
          Pricing Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-orange-900/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-900/20 hover:bg-gray-700/30">
                <TableHead className="text-gray-300">Service</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Price</TableHead>
                <TableHead className="text-gray-300">Date Range</TableHead>
                <TableHead className="text-gray-300">Time Range</TableHead>
                <TableHead className="text-gray-300">Active</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No pricing rules found
                  </TableCell>
                </TableRow>
              ) : (
                pricingRules.map((rule) => (
                  <TableRow key={rule.id} className="border-orange-900/20 hover:bg-gray-700/20">
                    <TableCell className="text-white">{rule.service?.name}</TableCell>
                    <TableCell>{getPricingTypeBadge(rule.pricing_type)}</TableCell>
                    <TableCell className="text-white font-medium">€{rule.price}</TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {formatDateRange(rule.start_date, rule.end_date)}
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {formatTimeRange(rule.start_time, rule.end_time)}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={(checked) => 
                          toggleActiveMutation.mutate({ id: rule.id, isActive: checked })
                        }
                        disabled={toggleActiveMutation.isPending}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(rule.id)}
                          disabled={deleteMutation.isPending}
                          className="border-red-500/20 text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
