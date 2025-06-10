
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Minimaal 2 karakters'),
  email: z.string().email('Ongeldig emailadres'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Minimaal 8 karakters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'Vereist'),
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
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange', // This ensures real-time validation
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    }
  });

  const termsValue = watch('terms');
  const watchedValues = watch();

  // Check if all required fields are filled and valid
  const isFormValid = () => {
    const { name, email, password, confirmPassword, terms } = watchedValues;
    
    return !!(
      name && name.length >= 2 &&
      email && email.includes('@') &&
      password && password.length >= 8 &&
      confirmPassword && confirmPassword === password &&
      terms === true &&
      Object.keys(errors).length === 0
    );
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    setStep('processing');

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        setError('Dit emailadres is al in gebruik');
        setStep('input');
        setLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/auth?type=signup`;
      
      // Create auth user
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

      if (authError) {
        if (authError.message.includes('User already registered')) {
          setError('Dit emailadres is al geregistreerd');
        } else if (authError.message.includes('Invalid email')) {
          setError('Ongeldig emailadres');
        } else if (authError.message.includes('Password')) {
          setError('Wachtwoord voldoet niet aan de eisen');
        } else {
          setError(authError.message);
        }
        setStep('input');
        return;
      }

      if (!authData.user) {
        setError('Account kon niet worden aangemaakt');
        setStep('input');
        return;
      }

      // Wait for trigger
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify user in database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', authData.user.id)
        .single();

      // Manual insert if trigger failed
      if (!dbUser && dbError?.code === 'PGRST116') {
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
          setError(`Database fout: ${insertError.message}`);
          setStep('input');
          return;
        }
      }

      setStep('success');
      
      setTimeout(() => {
        toast({
          title: "Account aangemaakt",
          description: "Check je email voor de bevestigingslink.",
        });
        onEmailSent();
      }, 1500);

    } catch (error: any) {
      setError(`Onverwachte fout: ${error.message}`);
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const getFieldValidationState = (fieldName: keyof RegisterFormData) => {
    const hasError = errors[fieldName];
    const hasValue = watchedValues[fieldName];
    
    if (hasError) return 'error';
    if (!hasError && hasValue) return 'success';
    return 'default';
  };

  const getInputClassName = (fieldName: keyof RegisterFormData) => {
    const baseClasses = "h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:bg-white/10 transition-all duration-200";
    const state = getFieldValidationState(fieldName);
    
    switch (state) {
      case 'error':
        return `${baseClasses} border-red-500/50 focus:border-red-500`;
      case 'success':
        return `${baseClasses} border-green-500/50 focus:border-green-500`;
      default:
        return baseClasses;
    }
  };

  if (step === 'processing') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Account wordt aangemaakt...</h3>
            <p className="text-white/60">Een moment geduld terwijl we alles voor je klaarzetten.</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Account succesvol aangemaakt!</h3>
            <p className="text-white/60">Check je email voor de bevestigingslink.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert className="border-red-500/20 bg-red-500/10 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-white/90">
            Volledige naam
          </Label>
          <div className="relative">
            <Input
              id="name"
              placeholder="Je volledige naam"
              {...register('name')}
              disabled={loading}
              className={getInputClassName('name')}
            />
            {getFieldValidationState('name') === 'success' && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/90">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="je@email.com"
              {...register('email')}
              disabled={loading}
              className={getInputClassName('email')}
            />
            {getFieldValidationState('email') === 'success' && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-white/60">
            Telefoonnummer <span className="text-xs">(optioneel)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            {...register('phone')}
            disabled={loading}
            className={getInputClassName('phone')}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-white/90">
            Wachtwoord
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimaal 8 karakters"
              {...register('password')}
              disabled={loading}
              className={`${getInputClassName('password')} pr-12`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white/40 hover:text-white/80 hover:bg-white/5"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">
            Bevestig wachtwoord
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Herhaal je wachtwoord"
              {...register('confirmPassword')}
              disabled={loading}
              className={`${getInputClassName('confirmPassword')} pr-12`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white/40 hover:text-white/80 hover:bg-white/5"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={termsValue}
            onCheckedChange={(checked) => setValue('terms', checked as boolean)}
            disabled={loading}
            className="mt-1 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
          />
          <Label
            htmlFor="terms"
            className="text-sm leading-relaxed text-white/80 cursor-pointer"
          >
            Ik ga akkoord met de{' '}
            <a href="#" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
              algemene voorwaarden
            </a>{' '}
            en{' '}
            <a href="#" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
              privacybeleid
            </a>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-400 ml-7">{errors.terms.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={loading || !isFormValid()}
        className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Account aanmaken...
          </div>
        ) : (
          'Account aanmaken'
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-white/60">
          Heb je al een account?{' '}
          <button 
            type="button"
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            onClick={() => {/* Switch to login */}}
          >
            Inloggen
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
