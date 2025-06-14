
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

export function BookingsEmptyState() {
  return (
    <Card className="border-dashed border-border/50">
      <CardContent className="text-center py-16">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Geen boekingen gevonden
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Je hebt nog geen boekingen gemaakt. Maak je eerste boeking om te beginnen met je fitness reis.
        </p>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Eerste Boeking Maken
        </Button>
      </CardContent>
    </Card>
  );
}
