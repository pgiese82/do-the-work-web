
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function ProfileSettings() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Profiel Instellingen</h1>
          <p className="text-muted-foreground">Beheer je profiel en voorkeuren</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profiel Informatie</CardTitle>
          <CardDescription>
            Bekijk en bewerk je profiel gegevens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Profiel instellingen worden geladen...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
