import React, { useState, useEffect } from 'react';
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
import { Target, Users, Send, Filter } from 'lucide-react';

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

  // Auto-trigger segmentation when criteria change
  useEffect(() => {
    // Only trigger if there's at least one meaningful criteria
    const hasCriteria = Object.values(criteria).some(value => 
      value !== undefined && value !== '' && value !== 'all'
    );
    
    if (hasCriteria) {
      refetch();
    }
  }, [criteria]);

  const { data: segments = [], refetch, isLoading } = useQuery({
    queryKey: ['client-segments', criteria],
    queryFn: async () => {
      console.log('🔍 Fetching client segments with criteria:', criteria);
      
      // Start by getting ALL clients to debug what we have
      const { data: allClients, error: allClientsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client');

      if (allClientsError) {
        console.error('❌ Error fetching all clients:', allClientsError);
        throw allClientsError;
      }

      console.log('📊 All clients in database:', allClients?.length || 0);
      console.log('📊 Client statuses found:', allClients?.map(c => ({
        name: c.name,
        status: c.client_status,
        statusType: typeof c.client_status
      })));

      if (!allClients || allClients.length === 0) {
        console.log('⚠️ No clients found with role "client"');
        return [];
      }

      // Start with all clients, then apply filters
      let filteredData = allClients;

      // Apply client status filter
      if (criteria.client_status && criteria.client_status !== 'all') {
        console.log('🎯 Filtering by client_status:', criteria.client_status);
        
        filteredData = filteredData.filter(client => {
          // Normalize both values for comparison
          const clientStatus = (client.client_status || 'prospect').toLowerCase().trim();
          const filterStatus = criteria.client_status!.toLowerCase().trim();
          
          console.log(`Comparing: "${clientStatus}" === "${filterStatus}" for client ${client.name}`);
          return clientStatus === filterStatus;
        });
        
        console.log('✅ After status filter:', filteredData.length, 'clients');
      }

      // Apply acquisition source filter
      if (criteria.acquisition_source) {
        filteredData = filteredData.filter(client => 
          client.acquisition_source?.toLowerCase().includes(criteria.acquisition_source!.toLowerCase())
        );
      }

      // Apply total spent filters
      if (criteria.min_total_spent !== undefined) {
        filteredData = filteredData.filter(client => 
          (client.total_spent || 0) >= criteria.min_total_spent!
        );
      }

      if (criteria.max_total_spent !== undefined) {
        filteredData = filteredData.filter(client => 
          (client.total_spent || 0) <= criteria.max_total_spent!
        );
      }

      // Apply booking count filtering if needed
      if (criteria.booking_count_min !== undefined || criteria.booking_count_max !== undefined) {
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('user_id, id')
          .in('user_id', filteredData.map(c => c.id));

        filteredData = filteredData.filter(client => {
          const bookingCount = bookingsData?.filter(b => b.user_id === client.id).length || 0;
          
          if (criteria.booking_count_min !== undefined && bookingCount < criteria.booking_count_min) {
            return false;
          }
          
          if (criteria.booking_count_max !== undefined && bookingCount > criteria.booking_count_max) {
            return false;
          }

          return true;
        });
      }

      // Apply days since last session filtering
      if (criteria.days_since_last_session !== undefined) {
        filteredData = filteredData.filter(client => {
          if (!client.last_session_date) return false;
          
          const daysSince = Math.floor(
            (Date.now() - new Date(client.last_session_date).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSince >= criteria.days_since_last_session;
        });
      }

      // Ensure client_status is never empty (normalize data)
      filteredData = filteredData.map(client => ({
        ...client,
        client_status: client.client_status && client.client_status.trim() !== '' ? client.client_status : 'prospect'
      }));

      console.log('✅ Final filtered segment results:', filteredData.length, 'clients');
      console.log('✅ Final results:', filteredData.map(c => ({ name: c.name, status: c.client_status })));
      return filteredData;
    },
    enabled: false, // We'll manually trigger this
  });

  const handleCriteriaChange = (field: keyof SegmentCriteria, value: any) => {
    console.log(`🎯 Updating criteria - ${field}:`, value);
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const clearSegmentation = () => {
    setCriteria({});
    setSegmentName('');
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

  // Check if any criteria are set
  const hasCriteria = Object.values(criteria).some(value => 
    value !== undefined && value !== '' && value !== 'all'
  );

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
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
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
                onChange={(e) => handleCriteriaChange('min_total_spent', Number(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Total Spent (€)</Label>
              <Input
                type="number"
                placeholder="No limit"
                onChange={(e) => handleCriteriaChange('max_total_spent', Number(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label>Min Bookings</Label>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) => handleCriteriaChange('booking_count_min', Number(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label>Days Since Last Session</Label>
              <Input
                type="number"
                placeholder="Any"
                onChange={(e) => handleCriteriaChange('days_since_last_session', Number(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label>Acquisition Source</Label>
              <Input
                placeholder="e.g., Website, Referral"
                onChange={(e) => handleCriteriaChange('acquisition_source', e.target.value || undefined)}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasCriteria && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={clearSegmentation}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && hasCriteria && (
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                  <span>Searching for clients...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Segment Results */}
          {!isLoading && segments.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="font-medium">Segment Results: {segments.length} clients</span>
                  </div>
                  <Badge variant="outline">{segments.length} matches</Badge>
                </div>

                {/* Client List */}
                <div className="space-y-3 mb-4">
                  <h4 className="font-medium text-sm text-gray-700">Clients in this segment:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {segments.map((client) => (
                      <div key={client.id} className="bg-white p-3 rounded border text-sm">
                        <div className="font-medium">{client.name}</div>
                        <div className="text-gray-500">{client.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {client.client_status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            €{client.total_spent?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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

          {/* No Results State */}
          {!isLoading && hasCriteria && segments.length === 0 && (
            <Card className="bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">No clients match the selected criteria</span>
                </div>
                <p className="text-sm text-yellow-600 mt-2">
                  Try adjusting your filters or clearing them to see more results.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {!hasCriteria && (
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Select criteria to segment your clients</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Choose one or more filters above to find specific client groups. Results will appear automatically.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
