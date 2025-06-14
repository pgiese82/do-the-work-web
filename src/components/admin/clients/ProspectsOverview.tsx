
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useProspects } from '@/hooks/useProspects';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Target,
  MessageSquare,
  UserCheck,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export function ProspectsOverview() {
  const { prospects, isLoading, updateProspectStatus, deleteProspect } = useProspects();

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      intake_scheduled: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
      converted: 'bg-green-500/20 text-green-400 border-green-500/20',
      not_interested: 'bg-red-500/20 text-red-400 border-red-500/20'
    };

    const labels = {
      new: 'Nieuw',
      contacted: 'Gecontacteerd',
      intake_scheduled: 'Intake Ingepland',
      converted: 'Actieve Klant',
      not_interested: 'Niet Geïnteresseerd'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.new}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getGoalBadge = (goal: string) => {
    const goalColors = {
      'Afvallen': 'bg-orange-500/20 text-orange-400',
      'Aankomen': 'bg-green-500/20 text-green-400',
      'Fitter worden': 'bg-blue-500/20 text-blue-400',
      'Sterker worden': 'bg-red-500/20 text-red-400',
      'Stressvermindering': 'bg-purple-500/20 text-purple-400',
      'Anders': 'bg-gray-500/20 text-gray-400'
    };

    return (
      <Badge className={goalColors[goal as keyof typeof goalColors] || goalColors.Anders}>
        {goal}
      </Badge>
    );
  };

  const handleDeleteProspect = async (prospectId: string, prospectName: string) => {
    if (window.confirm(`Weet je zeker dat je ${prospectName} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
      await deleteProspect(prospectId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Prospects laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (prospects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            Prospects Overzicht
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Geen prospects gevonden</h3>
          <p className="text-muted-foreground">
            Er zijn nog geen prospects die het contactformulier hebben ingevuld.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusStats = {
    new: prospects.filter(p => p.status === 'new').length,
    contacted: prospects.filter(p => p.status === 'contacted').length,
    intake_scheduled: prospects.filter(p => p.status === 'intake_scheduled').length,
    converted: prospects.filter(p => p.status === 'converted').length,
    not_interested: prospects.filter(p => p.status === 'not_interested').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <User className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{statusStats.new}</div>
            <div className="text-xs text-muted-foreground">Nieuw</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Mail className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{statusStats.contacted}</div>
            <div className="text-xs text-muted-foreground">Gecontacteerd</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{statusStats.intake_scheduled}</div>
            <div className="text-xs text-muted-foreground">Intake Ingepland</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{statusStats.converted}</div>
            <div className="text-xs text-muted-foreground">Actieve Klant</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400">{statusStats.not_interested}</div>
            <div className="text-xs text-muted-foreground">Niet Geïnteresseerd</div>
          </CardContent>
        </Card>
      </div>

      {/* Prospects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            Prospects ({prospects.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Doel</TableHead>
                <TableHead>Ervaring</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ontvangen</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prospects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {prospect.first_name} {prospect.last_name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {prospect.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {prospect.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getGoalBadge(prospect.goal)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{prospect.experience}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(prospect.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(prospect.created_at), 'dd MMM yyyy', { locale: nl })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {prospect.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProspectStatus(prospect.id, 'contacted')}
                        >
                          Contacteren
                        </Button>
                      )}
                      {prospect.status === 'contacted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProspectStatus(prospect.id, 'intake_scheduled')}
                        >
                          Intake Plannen
                        </Button>
                      )}
                      {prospect.status === 'intake_scheduled' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProspectStatus(prospect.id, 'converted')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Klant Maken
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProspectStatus(prospect.id, 'not_interested')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Niet Geïnteresseerd
                          </Button>
                        </>
                      )}
                      {prospect.status === 'not_interested' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProspect(prospect.id, `${prospect.first_name} ${prospect.last_name}`)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Verwijderen
                        </Button>
                      )}
                      {prospect.message && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title={prospect.message}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      )}
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
