import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Prospect {
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

  const { data: prospects = [], isLoading } = useQuery<Prospect[]>({
    queryKey: ['prospects'],
    queryFn: async () => {
      console.log('🔍 Fetching non-converted prospects...');
      
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .neq('status', 'converted') // Haal geen prospects op die al klant zijn
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching prospects:', error);
        throw error;
      }

      console.log('📋 Found prospects:', data?.length || 0);
      return data;
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

  const convertProspectToClient = async (prospect: Prospect) => {
    setLoading(true);
    try {
      // 1. Check if a client with this email already exists
      const { data: existingClient, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', prospect.email)
        .maybeSingle();

      if (checkError) throw checkError;

      let clientId: string;
      let newClientCreated = false;

      if (existingClient) {
        // User already exists, use their ID
        clientId = existingClient.id;
        toast({
          title: "Klant Bestaat Al",
          description: `Een klant met e-mail ${prospect.email} bestaat al. De prospect wordt nu gekoppeld.`,
        });
      } else {
        // Create a new client in the 'users' table
        const { data: newClient, error: clientError } = await supabase
          .from('users')
          .insert({
            name: `${prospect.first_name} ${prospect.last_name}`,
            email: prospect.email,
            phone: prospect.phone,
            role: 'client',
            client_status: 'active',
            acquisition_source: prospect.source || 'contact_form',
          })
          .select('id')
          .single();

        if (clientError) throw clientError;
        
        clientId = newClient.id;
        newClientCreated = true;
      }

      // 2. Update the prospect to link to the client
      const { error: prospectError } = await supabase
        .from('prospects')
        .update({
          status: 'converted',
          converted_to_client_id: clientId,
          converted_at: new Date().toISOString(),
        })
        .eq('id', prospect.id);

      if (prospectError) {
        // Rollback client creation if prospect update fails and if we created a new client
        if (newClientCreated) {
          await supabase.from('users').delete().eq('id', clientId);
        }
        throw prospectError;
      }

      toast({
        title: "Prospect Geconverteerd",
        description: `${prospect.first_name} ${prospect.last_name} is succesvol geconverteerd naar een klant.`,
      });

      // 3. Optimistically update prospects list (remove converted prospect)
      queryClient.setQueryData(['prospects'], (oldData: Prospect[] | undefined) =>
        oldData ? oldData.filter((p) => p.id !== prospect.id) : []
      );

      // 4. Invalidate clients list to refetch with the new client
      await queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      await queryClient.invalidateQueries({ queryKey: ['client-check'] });

      return true;
    } catch (error: any) {
      console.error('Convert prospect to client error:', error);
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
    convertProspectToClient,
    deleteProspect
  };
};
