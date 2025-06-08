
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Download, CheckCircle } from 'lucide-react';

const DownloadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {!isSubmitted ? (
          <div className="p-8">
            <DialogHeader className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                Gratis Download:
                <span className="block text-orange-600 mt-1">
                  De 30-dagen Transformatie Gids
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mb-6">
              <p className="text-slate-600 text-center leading-relaxed">
                Ontdek de exacte stappen die meer dan <strong>500 mensen</strong> hebben gebruikt om hun leven te transformeren in slechts 30 dagen.
              </p>
              
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-bold text-slate-900 mb-2">Deze gids bevat:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>✓ Het exacte 30-dagen trainingsschema</li>
                  <li>✓ Voedingsplan zonder dieet-stress</li>
                  <li>✓ Mindset-technieken voor blijvende resultaten</li>
                  <li>✓ Dagelijkse tracking sheets</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Voer je e-mailadres in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base border-2 border-gray-200 focus:border-orange-500 rounded-xl"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-orange-500/25"
              >
                Download Nu Gratis
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Je ontvangt direct de download link. Geen spam, beloofd!
            </p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Bedankt!</h3>
            <p className="text-slate-600">
              Check je inbox voor de download link van je transformatie gids.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
