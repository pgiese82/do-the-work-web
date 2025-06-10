
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
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
  const [debugInfo, setDebugInfo] = useState<string>('');
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
    setDebugInfo('Starting registration process...');

    try {
      console.log('🚀 Starting user registration for:', data.email);
      
      // First, check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        setError('Er bestaat al een account met dit emailadres');
        setLoading(false);
        return;
      }

      setDebugInfo('Creating auth user...');

      const redirectUrl = `${window.location.origin}/auth?type=signup`;
      
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      console.log('📧 Auth signup result:', { user: authData.user?.id, error: authError });

      if (authError) {
        console.error('❌ Auth error:', authError);
        
        if (authError.message.includes('User already registered')) {
          setError('Er bestaat al een account met dit emailadres');
        } else if (authError.message.includes('Invalid email')) {
          setError('Ongeldig emailadres');
        } else if (authError.message.includes('Password')) {
          setError('Wachtwoord voldoet niet aan de eisen');
        } else {
          setError(`Registratie fout: ${authError.message}`);
        }
        return;
      }

      if (!authData.user) {
        setError('Gebruiker kon niet worden aangemaakt');
        return;
      }

      setDebugInfo('Auth user created, checking database...');

      // Wait a moment for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify that the user was created in the database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', authData.user.id)
        .single();

      console.log('🔍 Database user check:', { user: dbUser, error: dbError });

      if (dbError && dbError.code !== 'PGRST116') {
        console.error('❌ Database error:', dbError);
        setError(`Database error: ${dbError.message}`);
        return;
      }

      // If user doesn't exist in database, create manually
      if (!dbUser) {
        setDebugInfo('Creating user in database manually...');
        console.log('📝 Creating user in database manually...');
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            phone: data.phone || null,
            role: 'client',
            client_status: 'active',
            subscription_status: 'trial',
          });

        if (insertError) {
          console.error('❌ Manual insert error:', insertError);
          setError(`Database error saving new user: ${insertError.message}`);
          return;
        }

        console.log('✅ User created in database manually');
      }

      // Success!
      console.log('✅ Registration completed successfully');
      
      toast({
        title: "Registratie succesvol",
        description: "Check je email voor de bevestigingslink.",
      });

      onEmailSent();

    } catch (error: any) {
      console.error('💥 Unexpected registration error:', error);
      setError(`Onverwachte fout: ${error.message}`);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="name">Volledige naam *</Label>
        <Input
          id="name"
          {...register('name')}
          disabled={loading}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={loading}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefoonnummer</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          disabled={loading}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Wachtwoord *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            disabled={loading}
            className={errors.password ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Bevestig wachtwoord *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            disabled={loading}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsValue}
            onCheckedChange={(checked) => setValue('terms', checked as boolean)}
            disabled={loading}
          />
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ik ga akkoord met de{' '}
            <a href="#" className="text-primary hover:underline">
              algemene voorwaarden
            </a>{' '}
            en{' '}
            <a href="#" className="text-primary hover:underline">
              privacybeleid
            </a>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Account aanmaken...
          </>
        ) : (
          'Account aanmaken'
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
