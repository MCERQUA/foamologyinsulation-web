import React from 'react';

interface CTABlockProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: 'primary' | 'secondary';
}

const CTABlock: React.FC<CTABlockProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  variant = 'primary'
}) => {
  const isPrimary = variant === 'primary';

  return (
    <div className="my-10">
      <div
        className="relative overflow-hidden rounded-3xl p-8 md:p-10"
        style={{
          backgroundColor: isPrimary ? 'rgba(193, 119, 103, 0.15)' : 'rgba(139, 157, 131, 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${isPrimary ? 'rgba(193, 119, 103, 0.3)' : 'rgba(139, 157, 131, 0.3)'}`,
          boxShadow: '0 8px 32px rgba(74, 63, 54, 0.1)'
        }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
          style={{
            background: isPrimary
              ? 'radial-gradient(circle, rgba(193, 119, 103, 0.6), transparent 70%)'
              : 'radial-gradient(circle, rgba(139, 157, 131, 0.6), transparent 70%)'
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-espresso mb-4">
            {title}
          </h3>
          <p className="text-lg text-warm-gray mb-6">
            {description}
          </p>

          {/* CTA Button */}
          <a
            href={buttonLink}
            className="inline-block relative group"
          >
            <button
              className={`relative px-8 py-4 rounded-full font-semibold text-white border backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-1`}
              style={{
                backgroundColor: isPrimary ? 'rgba(193, 119, 103, 0.8)' : 'rgba(139, 157, 131, 0.8)',
                borderColor: isPrimary ? 'rgba(193, 119, 103, 0.3)' : 'rgba(139, 157, 131, 0.3)',
                boxShadow: isPrimary
                  ? '0 4px 20px rgba(193, 119, 103, 0.3), 0 0 30px rgba(193, 119, 103, 0.2)'
                  : '0 4px 20px rgba(139, 157, 131, 0.3), 0 0 30px rgba(139, 157, 131, 0.2)',
                filter: isPrimary
                  ? 'drop-shadow(0 0 20px rgba(193, 119, 103, 0.4))'
                  : 'drop-shadow(0 0 20px rgba(139, 157, 131, 0.4))'
              }}
            >
              {/* Glass light effect */}
              <div
                className="absolute inset-0 z-0 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
                }}
              />

              {/* Button text */}
              <span className="relative z-10">{buttonText}</span>
            </button>
          </a>

          {/* Contact info */}
          <div className="mt-6 text-sm text-warm-gray">
            Or call us directly: <a href="tel:+19073103000" className="font-semibold text-terra-cotta hover:text-terra-cotta/80 transition-colors">(907) 310-3000</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTABlock;
