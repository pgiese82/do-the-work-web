
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarCheck, FileText, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardOverview() {
  const navigate = useNavigate();

  console.log('DashboardOverview component rendering');

  const quickActions = [
    {
      title: 'Sessie Boeken',
      description: 'Plan je volgende training sessie',
      icon: Calendar,
      action: () => navigate('/dashboard/book'),
      color: 'bg-blue-500'
    },
    {
      title: 'Mijn Boekingen',
      description: 'Bekijk je geplande sessies',
      icon: CalendarCheck,
      action: () => navigate('/dashboard/bookings'),
      color: 'bg-green-500'
    },
    {
      title: 'Documenten',
      description: 'Toegang tot je documenten',
      icon: FileText,
      action: () => navigate('/dashboard/documents'),
      color: 'bg-purple-500'
    },
    {
      title: 'Profiel',
      description: 'Beheer je profiel instellingen',
      icon: Settings,
      action: () => navigate('/dashboard/profile'),
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Welkom terug!</h1>
        <p className="text-muted-foreground">
          Beheer je training sessies en bekijk je voortgang
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Je laatste activiteiten en updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Geen recente activiteit beschikbaar.</p>
            <Button className="mt-4 gap-2" onClick={() => navigate('/dashboard/book')}>
              <Plus className="w-4 h-4" />
              Plan je eerste sessie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
