
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientsOverview } from './ClientsOverview';
import { ClientProfilesTable } from './ClientProfilesTable';
import { CommunicationHistory } from './CommunicationHistory';
import { FollowUpScheduler } from './FollowUpScheduler';
import { ClientDataDiagnostic } from './ClientDataDiagnostic';
import { AlertTriangle, Database } from 'lucide-react';

export function AdminClientManager() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Check if there are any clients in the database
  const { data: clientCheck, isLoading: checkingClients } = useQuery({
    queryKey: ['client-check', refreshKey],
    queryFn: async () => {
      const { data: clients, error: clientError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'client')
        .limit(1);

      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('id, role')
        .limit(10);

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('user_id')
        .limit(5);

      if (clientError || usersError || bookingsError) {
        throw new Error('Database check failed');
      }

      return {
        hasClients: clients && clients.length > 0,
        totalUsers: allUsers?.length || 0,
        hasBookings: bookings && bookings.length > 0,
        clientCount: clients?.length || 0
      };
    }
  });

  const shouldShowDiagnostic = !checkingClients && clientCheck && (
    !clientCheck.hasClients && 
    (clientCheck.totalUsers > 0 || clientCheck.hasBookings)
  );

  if (checkingClients) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Database className="w-8 h-8 animate-pulse mx-auto mb-4 text-muted-foreground" />
          <p>Controleren van klantendatabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning when no clients found */}
      {shouldShowDiagnostic && !showDiagnostic && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Geen klanten gevonden:</strong> Er zijn {clientCheck?.totalUsers} gebruikers in de database, 
              maar geen hebben de rol 'client'. Dit kan de oorzaak zijn.
            </div>
            <Button 
              onClick={() => setShowDiagnostic(true)}
              variant="outline"
              size="sm"
            >
              Diagnose & Repareer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Diagnostic Tool */}
      {showDiagnostic && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Database Diagnose</h3>
            <Button 
              onClick={() => setShowDiagnostic(false)}
              variant="ghost"
              size="sm"
            >
              Sluiten
            </Button>
          </div>
          <ClientDataDiagnostic />
        </div>
      )}

      {/* Main Client Management Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            Overview
            {clientCheck?.clientCount !== undefined && (
              <span className="ml-2 text-xs bg-muted px-1 rounded">
                {clientCheck.clientCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="profiles">Client Profiles</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ClientsOverview key={refreshKey} />
        </TabsContent>

        <TabsContent value="profiles">
          <ClientProfilesTable key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="communication">
          <CommunicationHistory key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="followups">
          <FollowUpScheduler key={refreshKey} onUpdate={handleRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
