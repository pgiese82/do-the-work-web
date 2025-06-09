
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'Er is een fout opgetreden',
  message = 'Kon gegevens niet laden. Probeer het opnieuw.',
  onRetry,
  className = ''
}: ErrorMessageProps) {
  return (
    <Card className={`border-destructive/20 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Opnieuw proberen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
