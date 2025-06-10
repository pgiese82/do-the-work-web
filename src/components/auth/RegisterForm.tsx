
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { RegisterFormFields } from './register/RegisterFormFields';
import { RegisterStatusAlerts } from './register/RegisterStatusAlerts';

interface RegisterFormProps {
  onEmailSent: () => void;
}

const RegisterForm = ({ onEmailSent }: RegisterFormProps) => {
  const {
    form,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    debugInfo,
    onSubmit,
  } = useRegisterForm({ onEmailSent });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const termsValue = watch('terms');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RegisterStatusAlerts 
        error={error} 
        debugInfo={debugInfo} 
        loading={loading} 
      />

      <RegisterFormFields
        register={register}
        errors={errors}
        loading={loading}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        termsValue={termsValue}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        onTermsChange={(checked) => setValue('terms', checked)}
      />

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
