
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Users, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export function ClientDataDiagnostic() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [diagnosticStep, setDiagnosticStep] = useState<'initial' | 'running' | 'complete'>('initial');
  const [results, setResults] = useState<any>(null);

  // Check all users in database
  const { data: allUsers, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['diagnostic-all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, client_status, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: diagnosticStep === 'running'
  });

  // Check bookings to identify real clients
  const { data: bookingUsers, isLoading: bookingsLoading } = useQuery({
    queryKey: ['diagnostic-booking-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('user_id, users(id, name, email, role)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get unique users who have made bookings
      const uniqueUsers = new Map();
      data.forEach(booking => {
        if (booking.users && !uniqueUsers.has(booking.user_id)) {
          uniqueUsers.set(booking.user_id, booking.users);
        }
      });
      
      return Array.from(uniqueUsers.values());
    },
    enabled: diagnosticStep === 'running'
  });

  // Mutation to fix user roles
  const fixUserRolesMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const { error } = await supabase
        .from('users')
        .update({ 
          role: 'client',
          client_status: 'active'
        })
        .in('id', userIds);
      
      if (error) throw error;
      return userIds;
    },
    onSuccess: (fixedUserIds) => {
      toast({
        title: "Rollen bijgewerkt",
        description: `${fixedUserIds.length} gebruikers zijn bijgewerkt naar client rol.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic-all-users'] });
      queryClient.invalidateQueries({ queryKey: ['client-check'] });
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Fout bij bijwerken",
        description: error.message,
      });
    }
  });

  const runDiagnostic = () => {
    setDiagnosticStep('running');
    setResults(null);
  };

  const analyzeDiagnostic = () => {
    if (!allUsers || !bookingUsers) return;

    const clientUsers = allUsers.filter(user => user.role === 'client');
    const nonClientUsers = allUsers.filter(user => user.role !== 'client' && user.role !== 'admin');
    const usersWithBookings = bookingUsers.map(u => u.id);
    const missingClientRole = allUsers.filter(user => 
      usersWithBookings.includes(user.id) && user.role !== 'client'
    );

    const diagnosticResults = {
      totalUsers: allUsers.length,
      clientUsers: clientUsers.length,
      nonClientUsers: nonClientUsers.length,
      usersWithBookings: usersWithBookings.length,
      missingClientRole: missingClientRole.length,
      needsFixing: missingClientRole,
      allUsers,
      clientUsers,
      nonClientUsers
    };

    setResults(diagnosticResults);
    setDiagnosticStep('complete');
  };

  // Auto-analyze when data is available
  React.useEffect(() => {
    if (diagnosticStep === 'running' && allUsers && bookingUsers && !usersLoading && !bookingsLoading) {
      analyzeDiagnostic();
    }
  }, [allUsers, bookingUsers, usersLoading, bookingsLoading, diagnosticStep]);

  const handleFixRoles = () => {
    if (results?.needsFixing?.length > 0) {
      const userIds = results.needsFixing.map((user: any) => user.id);
      fixUserRolesMutation.mutate(userIds);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Client Data Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {diagnosticStep === 'initial' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Controleer waarom er geen klanten zichtbaar zijn in het beheerportaal.
              </p>
              <Button onClick={runDiagnostic} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Start Diagnose
              </Button>
            </div>
          )}

          {diagnosticStep === 'running' && (usersLoading || bookingsLoading) && (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-4" />
              <p>Analyseren van database...</p>
            </div>
          )}

          {diagnosticStep === 'complete' && results && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{results.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Totaal Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{results.clientUsers}</div>
                    <div className="text-sm text-muted-foreground">Client Role</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.usersWithBookings}</div>
                    <div className="text-sm text-muted-foreground">Met Boekingen</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{results.missingClientRole}</div>
                    <div className="text-sm text-muted-foreground">Verkeerde Role</div>
                  </CardContent>
                </Card>
              </div>

              {/* Issues Found */}
              {results.missingClientRole > 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Probleem gevonden:</strong> Er zijn {results.missingClientRole} gebruikers die boekingen hebben gemaakt 
                    maar niet de rol 'client' hebben. Dit verklaart waarom ze niet zichtbaar zijn in het klantenportaal.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Geen problemen gevonden:</strong> Alle gebruikers met boekingen hebben de juiste 'client' rol.
                  </AlertDescription>
                </Alert>
              )}

              {/* Fix Action */}
              {results.needsFixing?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Te Repareren Users</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {results.needsFixing.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          <Badge variant="secondary">
                            {user.role || 'geen role'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleFixRoles}
                      disabled={fixUserRolesMutation.isPending}
                      className="w-full"
                    >
                      {fixUserRolesMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Repareren...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Repareer User Rollen
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Button 
                onClick={() => {
                  setDiagnosticStep('initial');
                  setResults(null);
                }}
                variant="outline"
                className="w-full"
              >
                Nieuwe Diagnose
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
