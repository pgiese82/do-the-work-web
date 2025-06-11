import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientLifecycleData {
  id: string;
  name: string;
  email: string;
  client_status: string;
  acquisition_source?: string;
  created_at: string;
  last_session_date?: string;
  total_spent: number;
  booking_count: number;
  last_communication_date?: string;
  next_follow_up_date?: string;
  lifecycle_stage: 'prospect' | 'onboarding' | 'active' | 'at_risk' | 'churned';
  engagement_score: number;
}

export const useClientLifecycle = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ['client-lifecycle'],
    queryFn: async () => {
      console.log('🔍 Fetching client lifecycle data...');
      
      try {
        // First, get all clients with role 'client'
        const { data: clientsData, error: clientsError } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'client');

        if (clientsError) {
          console.error('❌ Error fetching clients:', clientsError);
          throw clientsError;
        }

        console.log('👥 Found clients:', clientsData?.length || 0, clientsData);

        if (!clientsData || clientsData.length === 0) {
          console.log('⚠️ No clients found with role "client"');
          return [];
        }

        // Get booking counts for each client
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('user_id, id, status, date_time')
          .in('user_id', clientsData.map(c => c.id));

        if (bookingsError) {
          console.error('❌ Error fetching bookings:', bookingsError);
          // Don't throw here, just log and continue with empty bookings
        }

        console.log('📅 Found bookings:', bookingsData?.length || 0);

        // Get communication history for each client
        const { data: communicationData, error: communicationError } = await supabase
          .from('communication_history')
          .select('user_id, created_at')
          .in('user_id', clientsData.map(c => c.id))
          .order('created_at', { ascending: false });

        if (communicationError) {
          console.error('❌ Error fetching communication history:', communicationError);
          // Don't throw here, just log and continue
        }

        console.log('💬 Found communications:', communicationData?.length || 0);

        // Get follow-ups for each client
        const { data: followUpsData, error: followUpsError } = await supabase
          .from('follow_ups')
          .select('user_id, scheduled_date, status')
          .in('user_id', clientsData.map(c => c.id))
          .eq('status', 'pending')
          .order('scheduled_date', { ascending: true });

        if (followUpsError) {
          console.error('❌ Error fetching follow-ups:', followUpsError);
          // Don't throw here, just log and continue
        }

        console.log('📋 Found follow-ups:', followUpsData?.length || 0);

        // Process the data
        const processedClients = clientsData.map(client => {
          // Ensure client_status is never empty
          const normalizedStatus = client.client_status && client.client_status.trim() !== '' 
            ? client.client_status 
            : 'prospect';

          // Count bookings for this client
          const clientBookings = bookingsData?.filter(b => b.user_id === client.id) || [];
          const bookingCount = clientBookings.length;
          
          // Get last communication
          const lastCommunication = communicationData?.find(c => c.user_id === client.id);
          
          // Get next follow-up
          const nextFollowUp = followUpsData?.find(f => f.user_id === client.id);
          
          // Calculate lifecycle stage
          const completedBookings = clientBookings.filter(b => b.status === 'completed');
          const daysSinceLastSession = client.last_session_date 
            ? Math.floor((Date.now() - new Date(client.last_session_date).getTime()) / (1000 * 60 * 60 * 24))
            : null;

          let lifecycle_stage: ClientLifecycleData['lifecycle_stage'] = 'prospect';
          
          if (completedBookings.length === 0) {
            lifecycle_stage = 'prospect';
          } else if (completedBookings.length <= 2) {
            lifecycle_stage = 'onboarding';
          } else if (daysSinceLastSession && daysSinceLastSession > 90) {
            lifecycle_stage = 'churned';
          } else if (daysSinceLastSession && daysSinceLastSession > 30) {
            lifecycle_stage = 'at_risk';
          } else {
            lifecycle_stage = 'active';
          }

          // Calculate engagement score (0-100)
          let engagement_score = 50; // Base score
          
          if (completedBookings.length > 0) {
            engagement_score += Math.min(completedBookings.length * 5, 30);
          }
          
          if (client.total_spent && client.total_spent > 0) {
            engagement_score += Math.min(client.total_spent / 50, 20);
          }
          
          if (daysSinceLastSession !== null) {
            if (daysSinceLastSession <= 7) engagement_score += 20;
            else if (daysSinceLastSession <= 30) engagement_score += 10;
            else if (daysSinceLastSession > 60) engagement_score -= 30;
          }

          const processedClient = {
            ...client,
            client_status: normalizedStatus,
            booking_count: bookingCount,
            last_communication_date: lastCommunication?.created_at,
            next_follow_up_date: nextFollowUp?.scheduled_date,
            lifecycle_stage,
            engagement_score: Math.max(0, Math.min(100, engagement_score)),
            total_spent: client.total_spent || 0
          } as ClientLifecycleData;

          console.log(`👤 Processed client ${client.name}:`, {
            bookings: bookingCount,
            lifecycle: lifecycle_stage,
            engagement: processedClient.engagement_score
          });

          return processedClient;
        });

        console.log('✅ Processed clients:', processedClients.length);
        return processedClients;

      } catch (error) {
        console.error('💥 Error in client lifecycle query:', error);
        throw error;
      }
    },
  });

  const scheduleFollowUp = async (clientId: string, followUpType: string, scheduledDate: string, description: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('follow_ups')
        .insert({
          user_id: clientId,
          follow_up_type: followUpType,
          scheduled_date: scheduledDate,
          title: `Follow-up: ${followUpType}`,
          description,
          status: 'pending',
          admin_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Follow-up Scheduled",
        description: "The follow-up has been successfully scheduled.",
      });

      refetch();
      return true;
    } catch (error: any) {
      console.error('Schedule follow-up error:', error);
      toast({
        variant: "destructive",
        title: "Scheduling Failed",
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ client_status: newStatus })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Client Status Updated",
        description: "The client status has been updated successfully.",
      });

      refetch();
      return true;
    } catch (error: any) {
      console.error('Update client status error:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const autoScheduleFollowUps = async () => {
    const clientsNeedingFollowUp = clients.filter(client => {
      const hasActiveFollowUp = client.next_follow_up_date && new Date(client.next_follow_up_date) > new Date();
      return !hasActiveFollowUp && (
        client.lifecycle_stage === 'prospect' ||
        client.lifecycle_stage === 'at_risk' ||
        (client.lifecycle_stage === 'onboarding' && client.booking_count === 0)
      );
    });

    for (const client of clientsNeedingFollowUp) {
      let followUpDays = 7; // Default
      let followUpType = 'general';

      if (client.lifecycle_stage === 'prospect') {
        followUpDays = 3;
        followUpType = 'prospect_nurture';
      } else if (client.lifecycle_stage === 'at_risk') {
        followUpDays = 1;
        followUpType = 'retention';
      } else if (client.lifecycle_stage === 'onboarding') {
        followUpDays = 5;
        followUpType = 'onboarding_check';
      }

      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + followUpDays);

      await scheduleFollowUp(
        client.id,
        followUpType,
        followUpDate.toISOString(),
        `Auto-scheduled ${followUpType} follow-up for ${client.lifecycle_stage} client`
      );
    }
  };

  return {
    clients,
    isLoading,
    loading,
    refetch,
    scheduleFollowUp,
    updateClientStatus,
    autoScheduleFollowUps
  };
};
