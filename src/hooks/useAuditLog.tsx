
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from './useAdminAuth';

interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}

export const useAuditLog = () => {
  const { user } = useAdminAuth();

  const logAction = async (entry: AuditLogEntry) => {
    if (!user) {
      console.warn('⚠️ Cannot log action: no user');
      return;
    }

    try {
      // Get client IP and user agent from browser
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: entry.action,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          details: entry.details,
          user_agent: userAgent,
        });

      if (error) {
        console.error('❌ Failed to log audit action:', error);
      } else {
        console.log('📝 Audit log created:', entry.action);
      }
    } catch (error) {
      console.error('💥 Error creating audit log:', error);
    }
  };

  const logAdminAction = async (action: string, resourceType: string, resourceId?: string, details?: Record<string, any>) => {
    await logAction({
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    });
  };

  return { logAdminAction };
};
