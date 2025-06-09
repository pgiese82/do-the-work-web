
import React from 'react';
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
import { Edit, Trash2, Settings } from 'lucide-react';

interface AvailabilityRulesTableProps {
  onUpdate: () => void;
}

export function AvailabilityRulesTable({ onUpdate }: AvailabilityRulesTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availabilityRules = [], isLoading } = useQuery({
    queryKey: ['availability-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('availability_rules')
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
        .from('availability_rules')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules'] });
      onUpdate();
      toast({
        title: 'Success',
        description: 'Availability rule updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update availability rule',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('availability_rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules'] });
      onUpdate();
      toast({
        title: 'Success',
        description: 'Availability rule deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete availability rule',
        variant: 'destructive',
      });
    },
  });

  const getRuleTypeBadge = (type: string) => {
    const variants = {
      schedule: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      booking_notice: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      max_bookings: 'bg-green-500/20 text-green-400 border-green-500/20',
      blackout: 'bg-red-500/20 text-red-400 border-red-500/20',
    };

    return (
      <Badge variant="secondary" className={variants[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatRuleValue = (type: string, value: any) => {
    switch (type) {
      case 'booking_notice':
        return `${value.min_hours} hours minimum`;
      case 'max_bookings':
        return `${value.max_per_day} per day`;
      case 'schedule':
        const days = value.days_of_week?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ');
        return `${days} ${value.start_time}-${value.end_time}`;
      case 'blackout':
        return `${value.start_date} to ${value.end_date}`;
      default:
        return JSON.stringify(value);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-400" />
            Availability Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">Loading availability rules...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-400" />
          Availability Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-orange-900/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-900/20 hover:bg-gray-700/30">
                <TableHead className="text-gray-300">Service</TableHead>
                <TableHead className="text-gray-300">Rule Type</TableHead>
                <TableHead className="text-gray-300">Configuration</TableHead>
                <TableHead className="text-gray-300">Active</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availabilityRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No availability rules found
                  </TableCell>
                </TableRow>
              ) : (
                availabilityRules.map((rule) => (
                  <TableRow key={rule.id} className="border-orange-900/20 hover:bg-gray-700/20">
                    <TableCell className="text-white">{rule.service?.name}</TableCell>
                    <TableCell>{getRuleTypeBadge(rule.rule_type)}</TableCell>
                    <TableCell className="text-gray-300 text-sm max-w-xs truncate">
                      {formatRuleValue(rule.rule_type, rule.rule_value)}
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
