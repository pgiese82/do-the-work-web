
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';

interface RegisterStatusAlertsProps {
  error: string | null;
  debugInfo: string;
  loading: boolean;
}

export const RegisterStatusAlerts = ({ error, debugInfo, loading }: RegisterStatusAlertsProps) => {
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && loading && (
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {debugInfo}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
