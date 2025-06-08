
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';

interface EmailVerificationNoticeProps {
  onBack: () => void;
}

const EmailVerificationNotice = ({ onBack }: EmailVerificationNoticeProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-orange-400" />
        </div>
        <CardTitle className="text-xl font-black text-white mb-2">
          Bevestig je email
        </CardTitle>
        <CardDescription className="text-gray-300">
          We hebben een bevestigingslink naar je email gestuurd
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-300 mb-6">
          <AlertDescription>
            Klik op de link in je email om je account te activeren. 
            Daarna kun je inloggen en gebruikmaken van alle functies.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="text-center text-gray-300 text-sm">
            <p>Geen email ontvangen?</p>
            <ul className="mt-2 space-y-1">
              <li>• Check je spam/junk map</li>
              <li>• Controleer of het emailadres correct is</li>
              <li>• Het kan enkele minuten duren</li>
            </ul>
          </div>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar inloggen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationNotice;
