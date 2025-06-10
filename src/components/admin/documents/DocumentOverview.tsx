
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Users, CheckCircle, Clock, Send, AlertTriangle, Zap, TrendingUp } from 'lucide-react';

export function DocumentOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['document-overview-stats'],
    queryFn: async () => {
      const [documentsResult, templatesResult, assignmentsResult, categoriesResult] = await Promise.all([
        supabase.from('documents').select('id', { count: 'exact' }),
        supabase.from('document_templates').select('id, is_active', { count: 'exact' }),
        supabase.from('document_assignments').select('id, status', { count: 'exact' }),
        supabase.from('documents').select('category')
      ]);

      const activeTemplates = templatesResult.data?.filter(t => t.is_active)?.length || 0;
      const pendingAssignments = assignmentsResult.data?.filter(a => a.status === 'pending')?.length || 0;
      const completedAssignments = assignmentsResult.data?.filter(a => a.status === 'completed')?.length || 0;
      const autoDeliveryTemplates = 0; // This would need to be calculated based on auto_deliver_on field
      const recentDeliveries = 0; // This would need recent deliveries calculation
      const failedDeliveries = 0; // This would need failed deliveries calculation

      // Count documents by category
      const categoryCounts = categoriesResult.data?.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        totalDocuments: documentsResult.count || 0,
        activeTemplates,
        pendingAssignments,
        completedAssignments,
        autoDeliveryTemplates,
        recentDeliveries,
        failedDeliveries,
        categoryCounts
      };
    },
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading overview...</div>;
  }

  const overviewCards = [
    {
      title: 'Total Documents',
      value: stats?.totalDocuments || 0,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Active Templates',
      value: stats?.activeTemplates || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Pending Assignments',
      value: stats?.pendingAssignments || 0,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Completed Assignments',
      value: stats?.completedAssignments || 0,
      icon: CheckCircle,
      color: 'text-emerald-600'
    },
    {
      title: 'Auto-Delivery Templates',
      value: stats?.autoDeliveryTemplates || 0,
      icon: Zap,
      color: 'text-purple-600'
    },
    {
      title: 'Recent Deliveries',
      value: stats?.recentDeliveries || 0,
      icon: Send,
      color: 'text-blue-600'
    },
    {
      title: 'Failed Deliveries',
      value: stats?.failedDeliveries || 0,
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Document Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats?.categoryCounts || {}).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="capitalize font-medium">{category}</span>
                <span className="font-bold text-primary">{count}</span>
              </div>
            ))}
            {(!stats?.categoryCounts || Object.keys(stats.categoryCounts).length === 0) && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No document categories found. Upload some documents to see category breakdown.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
