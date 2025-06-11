
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, Users, Send } from 'lucide-react';

interface SegmentCriteria {
  client_status?: string;
  min_total_spent?: number;
  max_total_spent?: number;
  lifecycle_stage?: string;
  days_since_last_session?: number;
  booking_count_min?: number;
  booking_count_max?: number;
  acquisition_source?: string;
}

export function ClientSegmentation() {
  const [segmentName, setSegmentName] = useState('');
  const [criteria, setCriteria] = useState<SegmentCriteria>({});
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const { toast } = useToast();

  const { data: segments = [], refetch } = useQuery({
    queryKey: ['client-segments', criteria],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select(`
          *,
          bookings(count),
          payments(amount)
        `)
        .eq('role', 'client');

      // Apply segmentation criteria
      if (criteria.client_status && criteria.client_status !== 'all') {
        query = query.eq('client_status', criteria.client_status);
      }

      if (criteria.acquisition_source) {
        query = query.eq('acquisition_source', criteria.acquisition_source);
      }

      if (criteria.min_total_spent !== undefined) {
        query = query.gte('total_spent', criteria.min_total_spent);
      }

      if (criteria.max_total_spent !== undefined) {
        query = query.lte('total_spent', criteria.max_total_spent);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Apply additional client-side filtering for complex criteria
      let filteredData = data || [];
      
      // Ensure client_status is never empty
      filteredData = filteredData.map(client => ({
        ...client,
        client_status: client.client_status && client.client_status.trim() !== '' ? client.client_status : 'prospect'
      }));

      return filteredData.filter(client => {
        const bookingCount = client.bookings?.[0]?.count || 0;
        
        if (criteria.booking_count_min !== undefined && bookingCount < criteria.booking_count_min) {
          return false;
        }
        
        if (criteria.booking_count_max !== undefined && bookingCount > criteria.booking_count_max) {
          return false;
        }

        if (criteria.days_since_last_session !== undefined && client.last_session_date) {
          const daysSince = Math.floor(
            (Date.now() - new Date(client.last_session_date).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSince < criteria.days_since_last_session) {
            return false;
          }
        }

        return true;
      });
    },
    enabled: Object.keys(criteria).length > 0,
  });

  const handleCriteriaChange = (field: keyof SegmentCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const sendSegmentEmail = async () => {
    if (!emailSubject || !emailMessage || segments.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide email subject, message, and ensure segment has clients.",
      });
      return;
    }

    try {
      // Send emails to all clients in segment
      await Promise.all(
        segments.map(async (client) => {
          return supabase.functions.invoke('send-custom-email', {
            body: {
              to: client.email,
              subject: emailSubject,
              message: emailMessage,
              clientName: client.name,
            },
          });
        })
      );

      // Log communication history
      await Promise.all(
        segments.map(async (client) => {
          return supabase.from('communication_history').insert({
            user_id: client.id,
            communication_type: 'email',
            direction: 'outbound',
            subject: emailSubject,
            content: emailMessage,
            status: 'sent',
            admin_id: (await supabase.auth.getUser()).data.user?.id
          });
        })
      );

      toast({
        title: "Emails Sent",
        description: `Successfully sent emails to ${segments.length} clients.`,
      });

      setEmailSubject('');
      setEmailMessage('');
    } catch (error: any) {
      console.error('Send segment email error:', error);
      toast({
        variant: "destructive",
        title: "Email Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Client Segmentation
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Segmentation Criteria */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Client Status</Label>
              <Select onValueChange={(value) => handleCriteriaChange('client_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any status</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Min Total Spent (€)</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) => handleCriteriaChange('min_total_spent', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Total Spent (€)</Label>
              <Input
                type="number"
                placeholder="No limit"
                onChange={(e) => handleCriteriaChange('max_total_spent', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Min Bookings</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) => handleCriteriaChange('booking_count_min', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Days Since Last Session</Label>
              <Input
                type="number"
                placeholder="Any"
                onChange={(e) => handleCriteriaChange('days_since_last_session', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Acquisition Source</Label>
              <Input
                placeholder="e.g., Website, Referral"
                onChange={(e) => handleCriteriaChange('acquisition_source', e.target.value)}
              />
            </div>
          </div>

          {/* Segment Results */}
          {segments.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="font-medium">Segment Results: {segments.length} clients</span>
                  </div>
                  <Badge variant="outline">{segments.length} matches</Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Email Subject</Label>
                    <Input
                      id="email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-message">Email Message</Label>
                    <textarea
                      id="email-message"
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Enter your message..."
                      className="w-full h-32 p-3 border rounded-md resize-none"
                    />
                  </div>

                  <Button 
                    onClick={sendSegmentEmail}
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={!emailSubject || !emailMessage}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Email to Segment ({segments.length} clients)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
