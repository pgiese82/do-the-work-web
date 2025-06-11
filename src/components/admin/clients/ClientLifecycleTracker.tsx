
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useClientLifecycle } from '@/hooks/useClientLifecycle';
import { format } from 'date-fns';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';

export function ClientLifecycleTracker() {
  const { 
    clients, 
    isLoading, 
    scheduleFollowUp, 
    updateClientStatus, 
    autoScheduleFollowUps 
  } = useClientLifecycle();

  console.log('🎯 ClientLifecycleTracker - clients:', clients.length, clients);

  const getLifecycleBadge = (stage: string) => {
    const variants = {
      prospect: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      onboarding: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
      active: 'bg-green-500/20 text-green-400 border-green-500/20',
      at_risk: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      churned: 'bg-red-500/20 text-red-400 border-red-500/20'
    };

    return (
      <Badge className={variants[stage as keyof typeof variants] || variants.prospect}>
        {stage.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const lifecycleStats = {
    prospects: clients.filter(c => c.lifecycle_stage === 'prospect').length,
    onboarding: clients.filter(c => c.lifecycle_stage === 'onboarding').length,
    active: clients.filter(c => c.lifecycle_stage === 'active').length,
    atRisk: clients.filter(c => c.lifecycle_stage === 'at_risk').length,
    churned: clients.filter(c => c.lifecycle_stage === 'churned').length,
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Client lifecycle data laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show debug info if no clients
  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-400" />
            Client Lifecycle Tracking - Debug
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Geen clients gevonden</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Er zijn geen clients gevonden in de lifecycle tracker. Dit kan verschillende oorzaken hebben:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 ml-4">
              <li>• Geen users met role 'client' in de database</li>
              <li>• Database connectie problemen</li>
              <li>• RLS (Row Level Security) blokkeert toegang</li>
            </ul>
            <p className="text-xs text-yellow-600 mt-3">
              Check de browser console voor meer details over de database queries.
            </p>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="w-full"
          >
            Pagina Herladen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lifecycle Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{lifecycleStats.prospects}</div>
            <div className="text-xs text-muted-foreground">Prospects</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{lifecycleStats.onboarding}</div>
            <div className="text-xs text-muted-foreground">Onboarding</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{lifecycleStats.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{lifecycleStats.atRisk}</div>
            <div className="text-xs text-muted-foreground">At Risk</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400">{lifecycleStats.churned}</div>
            <div className="text-xs text-muted-foreground">Churned</div>
          </CardContent>
        </Card>
      </div>

      {/* Auto Follow-up Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Client Lifecycle Tracking ({clients.length} clients)
            <Button onClick={autoScheduleFollowUps} className="bg-orange-500 hover:bg-orange-600">
              <Calendar className="w-4 h-4 mr-2" />
              Auto-Schedule Follow-ups
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Lifecycle Stage</TableHead>
                <TableHead>Engagement Score</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Session</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">{client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getLifecycleBadge(client.lifecycle_stage)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress 
                        value={client.engagement_score} 
                        className="h-2"
                      />
                      <div className="text-xs text-center">{client.engagement_score}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    €{client.total_spent?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell>
                    {client.last_session_date 
                      ? format(new Date(client.last_session_date), 'MMM dd, yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    {client.next_follow_up_date 
                      ? format(new Date(client.next_follow_up_date), 'MMM dd, yyyy')
                      : 'None scheduled'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const followUpDate = new Date();
                          followUpDate.setDate(followUpDate.getDate() + 7);
                          scheduleFollowUp(
                            client.id, 
                            'manual', 
                            followUpDate.toISOString(),
                            'Manual follow-up scheduled'
                          );
                        }}
                      >
                        Schedule Follow-up
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
