
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export function BookSession() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Sessie Boeken</h1>
          <p className="text-muted-foreground">Boek je volgende training sessie</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Boek een Sessie</CardTitle>
          <CardDescription>
            Kies een beschikbare tijd voor je volgende training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            De boekingsfunctionaliteit wordt geladen...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
