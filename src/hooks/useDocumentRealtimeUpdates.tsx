
import { useEffect, useCallback } from 'react';
import { useRealtimeSubscriptions } from './useRealtimeSubscriptions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export const useDocumentRealtimeUpdates = () => {
  const { createSubscription } = useRealtimeSubscriptions();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleDocumentUpdate = useCallback((payload: any) => {
    console.log('📄 Document updated:', payload);
    
    const { new: newDocument, eventType } = payload;
    
    // Invalidate document queries
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

    if (eventType === 'INSERT') {
      toast({
        title: "New Document Available",
        description: `${newDocument.title} has been uploaded and is ready for download`,
      });
    }
  }, [toast, queryClient]);

  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up document realtime subscriptions...');

    // Subscribe to document changes for current user
    const documentInserts = createSubscription(
      'documents', 
      'INSERT', 
      handleDocumentUpdate,
      { column: 'user_id', value: user.id }
    );
    
    const documentUpdates = createSubscription(
      'documents', 
      'UPDATE', 
      handleDocumentUpdate,
      { column: 'user_id', value: user.id }
    );

    return () => {
      documentInserts.cleanup();
      documentUpdates.cleanup();
    };
  }, [user, createSubscription, handleDocumentUpdate]);

  return null;
};
