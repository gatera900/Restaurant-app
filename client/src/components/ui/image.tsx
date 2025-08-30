import React, { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackEmoji?: string;
  fallbackBg?: string;
}

export function Image({ 
  src, 
  alt, 
  className = "", 
  fallbackEmoji = "🌱",
  fallbackBg = "bg-gradient-to-br from-sage-100 to-green-100"
}: ImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={`w-full h-full ${fallbackBg} flex items-center justify-center ${className}`}>
        <span className="text-4xl">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {imageLoading && (
        <div className={`absolute inset-0 ${fallbackBg} flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
