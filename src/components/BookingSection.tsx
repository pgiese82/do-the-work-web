import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

const BookingSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    trainingType: '',
    message: ''
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const trainingTypes = [
    '1-op-1 coaching',
    'Online trainingsschema\'s',
    'Persoonlijke voedingsschema\'s',
    'Boksen voor Parkinson'
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      date: selectedDate,
      time: selectedTime,
      ...formData
    });
    // Here you would typically send the data to your backend
    alert('Afspraak aangevraagd! We nemen zo snel mogelijk contact met je op.');
    setShowForm(false);
    setSelectedTime('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      trainingType: '',
      message: ''
    });
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 xl:py-32 bg-white" id="afspraak-maken">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24">
          <Badge className="mb-4 md:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 min-h-[44px] flex items-center justify-center w-fit mx-auto text-sm md:text-base">
            Afspraak maken
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 lg:mb-8 text-slate-900 px-4">
            Plan je
            <span className="block text-orange-600">gratis kennismaking</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto px-4">
            Kies een datum en tijd die jou uitkomt. We bespreken jouw doelen en maken een plan op maat.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 max-w-7xl mx-auto">
          {/* Calendar Section */}
          <div>
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="flex items-center mb-6 md:mb-8">
                  <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-orange-600 mr-3 md:mr-4" />
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">Kies een datum</h3>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border pointer-events-auto w-full"
                  classNames={{
                    day_selected: "bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-600",
                    day_today: "bg-orange-100 text-orange-800",
                  }}
                />
                
                {selectedDate && (
                  <div className="mt-6 md:mt-8">
                    <div className="flex items-center mb-4 md:mb-6">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600 mr-2 md:mr-3" />
                      <h4 className="font-semibold text-slate-900 text-base md:text-lg lg:text-xl">
                        Beschikbare tijden voor {format(selectedDate, 'dd MMMM yyyy')}
                      </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={`min-h-[44px] md:min-h-[52px] lg:min-h-[60px] text-sm md:text-base lg:text-lg ${
                            selectedTime === time 
                              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                              : 'border-orange-200 hover:border-orange-600 hover:text-orange-600'
                          }`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            {showForm && selectedDate && selectedTime ? (
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6 md:p-8 lg:p-10">
                  <div className="flex items-center mb-6 md:mb-8">
                    <User className="w-6 h-6 md:w-8 md:h-8 text-orange-600 mr-3 md:mr-4" />
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">Jouw gegevens</h3>
                  </div>
                  
                  <div className="bg-orange-50 p-4 md:p-6 rounded-lg mb-6 md:mb-8 border border-orange-100">
                    <p className="text-sm md:text-base text-slate-600 mb-2">
                      <strong>Gekozen datum:</strong> {format(selectedDate, 'dd MMMM yyyy')}
                    </p>
                    <p className="text-sm md:text-base text-slate-600">
                      <strong>Gekozen tijd:</strong> {selectedTime}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-sm md:text-base font-medium text-slate-700 mb-2 block">
                        Volledige naam *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="min-h-[44px] md:min-h-[52px] lg:min-h-[60px] text-sm md:text-base"
                        placeholder="Je volledige naam"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm md:text-base font-medium text-slate-700 mb-2 block">
                        E-mailadres *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="min-h-[44px] md:min-h-[52px] lg:min-h-[60px] text-sm md:text-base"
                        placeholder="je@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm md:text-base font-medium text-slate-700 mb-2 block">
                        Telefoonnummer *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="min-h-[44px] md:min-h-[52px] lg:min-h-[60px] text-sm md:text-base"
                        placeholder="06 12345678"
                      />
                    </div>

                    <div>
                      <Label htmlFor="trainingType" className="text-sm md:text-base font-medium text-slate-700 mb-2 block">
                        Waar ben je in geïnteresseerd? *
                      </Label>
                      <select
                        id="trainingType"
                        name="trainingType"
                        required
                        value={formData.trainingType}
                        onChange={(e) => setFormData({...formData, trainingType: e.target.value})}
                        className="flex h-12 md:h-14 lg:h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm md:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecteer een optie</option>
                        {trainingTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm md:text-base font-medium text-slate-700 mb-2 block">
                        Aanvullende informatie (optioneel)
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Vertel iets over je doelen of vragen..."
                        className="min-h-[100px] md:min-h-[120px] lg:min-h-[140px] text-sm md:text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold min-h-[44px] md:min-h-[52px] lg:min-h-[60px] text-base md:text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-orange-500/25"
                    >
                      Afspraak Bevestigen
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden h-full flex items-center justify-center shadow-lg">
                <CardContent className="p-8 md:p-10 lg:p-12 text-center">
                  <CalendarIcon className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-orange-200 mx-auto mb-4 md:mb-6" />
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 md:mb-4">Selecteer eerst een datum en tijd</h3>
                  <p className="text-slate-600 text-base md:text-lg lg:text-xl">
                    Kies een beschikbare datum en tijd in de kalender om verder te gaan met je afspraak.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
