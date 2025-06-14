
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, ArrowLeft, ArrowRight, User, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  firstName: z.string().min(2, 'Voornaam moet minimaal 2 karakters bevatten'),
  lastName: z.string().min(2, 'Achternaam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  phone: z.string().min(10, 'Telefoonnummer moet minimaal 10 cijfers bevatten'),
  goal: z.string().min(1, 'Selecteer je doel'),
  experience: z.string().min(1, 'Selecteer je ervaring'),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      goal: '',
      experience: '',
      message: '',
    },
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof ContactFormData)[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['goal', 'experience'];
      case 3:
        return [];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', data);
      setIsSubmitted(true);
      
      toast({
        title: "Bericht verzonden!",
        description: "We nemen binnen 24 uur contact met je op.",
      });
    } catch (error) {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="animate-scale-in">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Bedankt!</h3>
          <p className="text-slate-800 font-medium mb-8">
            Je bericht is verzonden. We nemen binnen 24 uur contact met je op om je gratis kennismaking in te plannen.
          </p>
          <Button 
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              form.reset();
            }}
            variant="outline"
            className="min-h-[44px]"
          >
            Nieuw bericht
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Gratis kennismaking
        </CardTitle>
        <p className="text-slate-600">
          Stap {currentStep} van {totalSteps}
        </p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Persoonlijke gegevens</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              id="firstName"
                              className="peer pt-6 pb-2 h-14 text-base placeholder-transparent"
                              placeholder=" "
                            />
                            <Label
                              htmlFor="firstName"
                              className="absolute left-3 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs"
                            >
                              Voornaam
                            </Label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              id="lastName"
                              className="peer pt-6 pb-2 h-14 text-base placeholder-transparent"
                              placeholder=" "
                            />
                            <Label
                              htmlFor="lastName"
                              className="absolute left-3 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs"
                            >
                              Achternaam
                            </Label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            className="peer pt-6 pb-2 h-14 text-base placeholder-transparent"
                            placeholder=" "
                          />
                          <Label
                            htmlFor="email"
                            className="absolute left-3 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs"
                          >
                            E-mailadres
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            id="phone"
                            type="tel"
                            className="peer pt-6 pb-2 h-14 text-base placeholder-transparent"
                            placeholder=" "
                          />
                          <Label
                            htmlFor="phone"
                            className="absolute left-3 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs"
                          >
                            Telefoonnummer
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Goals and Experience */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Je doelen</h3>
                </div>

                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-slate-700">
                        Wat is je hoofddoel?
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            'Afvallen',
                            'Aankomen',
                            'Fitter worden',
                            'Sterker worden',
                            'Stressvermindering',
                            'Anders'
                          ].map((goal) => (
                            <button
                              key={goal}
                              type="button"
                              onClick={() => field.onChange(goal)}
                              className={`p-4 text-left border-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                                field.value === goal
                                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {goal}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-slate-700">
                        Hoeveel ervaring heb je met fitness?
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {[
                            'Beginner (0-6 maanden)',
                            'Ervaren (6 maanden - 2 jaar)',
                            'Gevorderd (2+ jaar)'
                          ].map((experience) => (
                            <button
                              key={experience}
                              type="button"
                              onClick={() => field.onChange(experience)}
                              className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                                field.value === experience
                                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {experience}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Message */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Wat moet ik nog meer weten?</h3>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            {...field}
                            id="message"
                            className="peer pt-6 pb-2 min-h-32 text-base placeholder-transparent resize-none"
                            placeholder=" "
                          />
                          <Label
                            htmlFor="message"
                            className="absolute left-3 top-3 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:top-3 peer-focus:text-xs"
                          >
                            Je bericht (optioneel)
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <strong>Wat gebeurt er nu?</strong><br />
                    Na het versturen neem ik binnen 24 uur contact met je op om een gratis kennismaking van 15 minuten in te plannen. Tijdens dit gesprek bespreken we je doelen en kijken we hoe ik je het beste kan helpen.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Vorige
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-orange-600 hover:bg-orange-700 min-h-[44px]"
                >
                  Volgende
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 min-h-[44px]"
                >
                  {form.formState.isSubmitting ? 'Verzenden...' : 'Verstuur bericht'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
