import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  goal: string;
  experience: string;
  message?: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  converted_to_client_id?: string;
  converted_at?: string;
}

export const useProspects = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: prospects = [], isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      console.log('🔍 Fetching prospects...');
      
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching prospects:', error);
        throw error;
      }

      console.log('📋 Found prospects:', data?.length || 0);
      return data as Prospect[];
    },
  });

  const updateProspectStatus = async (prospectId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('prospects')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', prospectId);

      if (error) throw error;

      toast({
        title: "Status Bijgewerkt",
        description: "De prospect status is succesvol bijgewerkt.",
      });

      queryClient.setQueryData(['prospects'], (oldData: Prospect[] | undefined) => 
        oldData ? oldData.map(p => p.id === prospectId ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p) : []
      );
      return true;
    } catch (error: any) {
      console.error('Update prospect status error:', error);
      toast({
        variant: "destructive",
        title: "Update Mislukt",
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const convertToClient = async (prospectId: string, clientId: string) => {
    setLoading(true);
    try {
      const updatePayload = { 
        status: 'converted',
        converted_to_client_id: clientId,
        converted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('prospects')
        .update(updatePayload)
        .eq('id', prospectId);

      if (error) throw error;

      toast({
        title: "Prospect Geconverteerd",
        description: "De prospect is succesvol geconverteerd naar een klant.",
      });

      queryClient.setQueryData(['prospects'], (oldData: Prospect[] | undefined) => 
        oldData ? oldData.map(p => p.id === prospectId ? { ...p, ...updatePayload } : p) : []
      );
      return true;
    } catch (error: any) {
      console.error('Convert prospect error:', error);
      toast({
        variant: "destructive",
        title: "Conversie Mislukt",
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProspect = async (prospectId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', prospectId);

      if (error) throw error;

      toast({
        title: "Prospect Verwijderd",
        description: "De prospect is succesvol verwijderd uit de database.",
      });
      
      queryClient.setQueryData(['prospects'], (oldData: Prospect[] | undefined) => 
        oldData ? oldData.filter((prospect) => prospect.id !== prospectId) : []
      );

      return true;
    } catch (error: any) {
      console.error('Delete prospect error:', error);
      toast({
        variant: "destructive",
        title: "Verwijderen Mislukt",
        description: error.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    prospects,
    isLoading,
    loading,
    updateProspectStatus,
    convertToClient,
    deleteProspect
  };
};
