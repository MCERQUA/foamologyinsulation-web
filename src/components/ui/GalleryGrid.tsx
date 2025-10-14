import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, columns = 3 }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

  // Filter images
  const filteredImages = filter === 'all'
    ? images
    : images.filter(img => img.category === filter);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <>
      {/* Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium
                transition-all duration-300 transform hover:-translate-y-0.5
                backdrop-blur-md border
                ${filter === category
                  ? 'bg-terra-cotta/60 text-white border-terra-cotta/20 shadow-lg'
                  : 'bg-white/40 text-espresso border-white/30 hover:bg-white/60'
                }
              `}
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className={`grid ${columnClasses[columns]} gap-6`}>
        {filteredImages.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
            onClick={() => openLightbox(index)}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(74, 63, 54, 0.08)',
            }}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-soft-white/80">
              <picture>
                {/* WebP version for modern browsers */}
                <source
                  srcSet={image.src.replace('/jpg/', '/webp/').replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                  type="image/webp"
                />
                {/* Fallback to original format */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </picture>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-12 h-12 text-white" style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))'
                    }} />
                  </div>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium" style={{
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                  }}>
                    {image.alt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-md border border-white/20 z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-md border border-white/20 hidden sm:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-md border border-white/20 hidden sm:block"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <picture>
              {/* WebP version for modern browsers */}
              <source
                srcSet={filteredImages[selectedImage].src.replace('/jpg/', '/webp/').replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                type="image/webp"
              />
              {/* Fallback to original format */}
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                className="w-full h-full object-contain rounded-2xl"
                style={{
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
              />
            </picture>

            {/* Image Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal/90 to-transparent rounded-b-2xl">
              <p className="text-white text-lg font-medium text-center" style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
              }}>
                {filteredImages[selectedImage].alt}
              </p>
              <p className="text-white/70 text-sm text-center mt-1">
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>

          {/* Mobile Navigation Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm sm:hidden">
            Swipe or use arrow keys to navigate
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
