
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Users, Send, Clock, CheckCircle } from 'lucide-react';

export function DocumentOverview({ key: refreshKey }: { key: number }) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['document-stats', refreshKey],
    queryFn: async () => {
      const [documentsResult, templatesResult, assignmentsResult, deliveryResult] = await Promise.all([
        supabase.from('documents').select('category, created_at'),
        (supabase as any).from('document_templates').select('is_active, auto_deliver_on'),
        (supabase as any).from('document_assignments').select('status'),
        (supabase as any).from('document_delivery_log').select('status, delivered_at')
      ]);

      const documents = documentsResult.data || [];
      const templates = templatesResult.data || [];
      const assignments = assignmentsResult.data || [];
      const deliveries = deliveryResult.data || [];

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      return {
        totalDocuments: documents.length,
        totalTemplates: templates.length,
        activeTemplates: templates.filter((t: any) => t.is_active).length,
        autoDeliveryTemplates: templates.filter((t: any) => t.auto_deliver_on !== 'manual').length,
        pendingAssignments: assignments.filter((a: any) => a.status === 'pending').length,
        completedAssignments: assignments.filter((a: any) => a.status === 'completed').length,
        recentDeliveries: deliveries.filter((d: any) => new Date(d.delivered_at) >= thirtyDaysAgo).length,
        failedDeliveries: deliveries.filter((d: any) => d.status === 'failed').length,
        categoryCounts: documents.reduce((acc: Record<string, number>, doc: any) => {
          acc[doc.category] = (acc[doc.category] || 0) + 1;
          return acc;
        }, {})
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-orange-900/20">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Total Documents</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{stats?.totalDocuments || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Active Templates</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{stats?.activeTemplates || 0}</span>
              <span className="text-gray-400 text-sm ml-2">/ {stats?.totalTemplates || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300 text-sm">Pending Assignments</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{stats?.pendingAssignments || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Completed Assignments</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{stats?.completedAssignments || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm">Auto-Delivery Templates</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{stats?.autoDeliveryTemplates || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span className="text-gray-300 text-sm">Recent Deliveries</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{stats?.recentDeliveries || 0}</span>
              <span className="text-gray-400 text-sm ml-2">last 30 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-400" />
              <span className="text-gray-300 text-sm">Failed Deliveries</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">{stats?.failedDeliveries || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white">Document Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Object.entries(stats?.categoryCounts || {}).map(([category, count]) => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-orange-400">{count as number}</div>
                <div className="text-sm text-gray-300 capitalize">{category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
