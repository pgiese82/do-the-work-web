
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappNumber = "31612345678"; // Replace with actual WhatsApp number
  const message = "Hoi Dominique, ik wil meer weten over personal training!";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-subtle min-h-[60px] min-w-[60px] flex items-center justify-center"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
};

export default WhatsAppButton;
