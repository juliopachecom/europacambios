import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = "+34624377261"; // Reemplaza con tu número de teléfono
  const message = "Hola, estoy interesado en más información.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-button" onClick={handleClick}>
      <FaWhatsapp size={50} />
    </div>
  );
};

export {WhatsAppButton} ;
