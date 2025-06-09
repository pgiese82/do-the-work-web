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
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          bookings(count),
          communication_history(created_at),
          follow_ups(scheduled_date, status)
        `)
        .eq('role', 'client');

      if (error) throw error;

      return data.map(client => {
        const bookingCount = client.bookings?.[0]?.count || 0;
        const lastCommunication = client.communication_history?.[0]?.created_at;
        const nextFollowUp = client.follow_ups?.find(f => f.status === 'pending')?.scheduled_date;
        
        // Calculate lifecycle stage
        const daysSinceLastSession = client.last_session_date 
          ? Math.floor((Date.now() - new Date(client.last_session_date).getTime()) / (1000 * 60 * 60 * 24))
          : null;

        let lifecycle_stage: ClientLifecycleData['lifecycle_stage'] = 'prospect';
        
        if (bookingCount === 0) {
          lifecycle_stage = 'prospect';
        } else if (bookingCount <= 2) {
          lifecycle_stage = 'onboarding';
        } else if (daysSinceLastSession && daysSinceLastSession > 60) {
          lifecycle_stage = 'churned';
        } else if (daysSinceLastSession && daysSinceLastSession > 30) {
          lifecycle_stage = 'at_risk';
        } else {
          lifecycle_stage = 'active';
        }

        // Calculate engagement score (0-100)
        let engagement_score = 50; // Base score
        
        if (bookingCount > 0) engagement_score += Math.min(bookingCount * 5, 30);
        if (client.total_spent > 0) engagement_score += Math.min(client.total_spent / 50, 20);
        if (daysSinceLastSession) {
          if (daysSinceLastSession <= 7) engagement_score += 20;
          else if (daysSinceLastSession <= 30) engagement_score += 10;
          else if (daysSinceLastSession > 60) engagement_score -= 30;
        }

        return {
          ...client,
          booking_count: bookingCount,
          last_communication_date: lastCommunication,
          next_follow_up_date: nextFollowUp,
          lifecycle_stage,
          engagement_score: Math.max(0, Math.min(100, engagement_score))
        } as ClientLifecycleData;
      });
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
