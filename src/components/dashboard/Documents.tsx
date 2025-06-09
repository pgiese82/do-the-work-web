
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function Documents() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Documenten</h1>
          <p className="text-muted-foreground">Bekijk en download je documenten</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mijn Documenten</CardTitle>
          <CardDescription>
            Hier vind je al je training gerelateerde documenten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Geen documenten beschikbaar op dit moment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
