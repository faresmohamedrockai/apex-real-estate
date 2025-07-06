'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CircularImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  size?: string;
  className?: string;
}

const CircularImageWithFallback = ({
  src,
  alt,
  fallbackSrc = '/images/no-image.png',
  size = 'w-32 h-32',
  className = '',
}: CircularImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <div className={`${size} rounded-full border-4 border-white/30 shadow-lg overflow-hidden relative ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
      />
    </div>
  );
};

export default CircularImageWithFallback; 