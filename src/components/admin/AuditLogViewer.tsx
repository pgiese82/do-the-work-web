
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { formatDistanceToNow } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchAuditLogs();
    }
  }, [isAdmin]);

  const fetchAuditLogs = async () => {
    try {
      // Use type assertion to work around TypeScript type issues
      const { data, error } = await (supabase as any)
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching audit logs:', error);
      } else {
        setLogs(data || []);
      }
    } catch (error) {
      console.error('💥 Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'bg-green-500';
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-500';
    if (action.includes('delete') || action.includes('remove')) return 'bg-red-500';
    if (action.includes('view') || action.includes('read')) return 'bg-gray-500';
    return 'bg-orange-500';
  };

  if (!isAdmin) {
    return <div className="text-red-400">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white">Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getActionColor(log.action)} text-white`}>
                      {log.action}
                    </Badge>
                    <span className="text-gray-300 text-sm">{log.resource_type}</span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(log.created_at))} ago
                  </span>
                </div>
                
                {log.details && (
                  <div className="text-gray-400 text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="text-gray-500 text-xs mt-2">
                  User: {log.user_id.substring(0, 8)}...
                  {log.resource_id && ` | Resource: ${log.resource_id.substring(0, 8)}...`}
                </div>
              </div>
            ))}
            
            {logs.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No audit logs found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
