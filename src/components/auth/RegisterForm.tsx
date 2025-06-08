
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Voer een geldig emailadres in'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 karakters bevatten'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'Je moet akkoord gaan met de voorwaarden'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onEmailSent: () => void;
}

const RegisterForm = ({ onEmailSent }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const termsValue = watch('terms');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/auth?type=signup`;
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone || null,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Er bestaat al een account met dit emailadres');
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: "Registratie succesvol",
        description: "Check je email voor de bevestigingslink.",
      });

      onEmailSent();
    } catch (error: any) {
      setError('Er is een onverwachte fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">
          Volledige naam *
        </Label>
        <Input
          {...register('name')}
          id="name"
          placeholder="Je volledige naam"
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500"
        />
        {errors.name && (
          <p className="text-red-400 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email *
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

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white">
          Telefoonnummer
        </Label>
        <Input
          {...register('phone')}
          id="phone"
          type="tel"
          placeholder="06 12345678"
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500"
        />
        {errors.phone && (
          <p className="text-red-400 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Wachtwoord *
        </Label>
        <div className="relative">
          <Input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimaal 8 karakters"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">
          Bevestig wachtwoord *
        </Label>
        <div className="relative">
          <Input
            {...register('confirmPassword')}
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Herhaal je wachtwoord"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsValue}
          onCheckedChange={(checked) => setValue('terms', checked as boolean)}
          className="border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
        />
        <Label htmlFor="terms" className="text-white text-sm">
          Ik ga akkoord met de{' '}
          <a href="#" className="text-orange-400 hover:text-orange-300 underline">
            algemene voorwaarden
          </a>{' '}
          en{' '}
          <a href="#" className="text-orange-400 hover:text-orange-300 underline">
            privacybeleid
          </a>
        </Label>
      </div>
      {errors.terms && (
        <p className="text-red-400 text-sm">{errors.terms.message}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
      >
        {loading ? 'Bezig met registreren...' : 'Account aanmaken'}
      </Button>
    </form>
  );
};

export default RegisterForm;
