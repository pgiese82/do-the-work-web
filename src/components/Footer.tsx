
import React from 'react';
import { Dumbbell } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <Dumbbell className="w-8 h-8 text-orange-500 mr-3" />
          <span className="text-xl md:text-2xl font-black">DO THE WORK</span>
        </div>
        <p className="text-slate-400 text-sm md:text-base">
          © 2024 Do The Work. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
