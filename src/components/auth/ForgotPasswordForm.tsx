
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Voer een geldig emailadres in'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/auth?type=recovery`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      toast({
        title: "Email verzonden",
        description: "Check je email voor de reset link.",
      });
    } catch (error: any) {
      setError('Er is een onverwachte fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-black text-white mb-2">
            Email verzonden
          </CardTitle>
          <CardDescription className="text-gray-300">
            Check je inbox voor de reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-500/10 border-green-500/20 text-green-300 mb-4">
            <AlertDescription>
              We hebben een link om je wachtwoord te resetten naar je email gestuurd. 
              Klik op de link in de email om een nieuw wachtwoord in te stellen.
            </AlertDescription>
          </Alert>
          
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar inloggen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-black text-white mb-2">
          Wachtwoord vergeten
        </CardTitle>
        <CardDescription className="text-gray-300">
          Voer je emailadres in om je wachtwoord te resetten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="je@email.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
          >
            {loading ? 'Bezig...' : 'Reset link verzenden'}
          </Button>

          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar inloggen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
