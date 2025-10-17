import React from 'react';

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  width?: 'small' | 'medium' | 'large' | 'full';
}

const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
  src,
  alt,
  caption,
  credit,
  width = 'full'
}) => {
  const widthClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-full'
  };

  return (
    <figure className={`my-8 ${widthClasses[width]} mx-auto`}>
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          boxShadow: '0 8px 32px rgba(74, 63, 54, 0.12)'
        }}
      >
        <picture>
          {/* Try WebP first if available */}
          {src.endsWith('.jpg') && (
            <source
              srcSet={src.replace('.jpg', '.webp')}
              type="image/webp"
            />
          )}
          <img
            src={src}
            alt={alt}
            className="w-full h-auto"
            loading="lazy"
          />
        </picture>

        {/* Subtle overlay for better caption visibility */}
        {caption && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-espresso/80 to-transparent p-4"
          >
            <figcaption className="text-white text-sm">
              {caption}
            </figcaption>
          </div>
        )}
      </div>

      {/* Caption and credit below image */}
      {(caption || credit) && (
        <div className="mt-3 text-center">
          {caption && !credit && (
            <figcaption className="text-sm text-warm-gray italic">
              {caption}
            </figcaption>
          )}
          {credit && (
            <p className="text-xs text-warm-gray mt-1">
              {credit}
            </p>
          )}
        </div>
      )}
    </figure>
  );
};

export default ImageWithCaption;
