
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

export type RegisterFormData = z.infer<typeof registerSchema>;

interface UseRegisterFormProps {
  onEmailSent: () => void;
}

export const useRegisterForm = ({ onEmailSent }: UseRegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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

  return {
    form,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    debugInfo,
    onSubmit,
  };
};
