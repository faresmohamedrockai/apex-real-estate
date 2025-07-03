import React from 'react';

const ImageUnderWord = ({ text }: { text: string }) => {
  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      {/* الخلفية المتحركة فقط */}
      <div
        className="absolute inset-0 bg-[url('/images/499559019_122164762280571767_7813678523530159916_n.jpg')] bg-cover bg-center bg-zoom"
        aria-hidden
      />

      {/* طبقة التعتيم */}
      <div className="absolute inset-0 bg-[#b70501]/45" />

      {/* النص */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
          {text}
        </h1>
      </div>
    </div>
  );
};

export default ImageUnderWord;
