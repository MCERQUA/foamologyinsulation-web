import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'light' | 'warm' | 'white';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  variant = 'light'
}) => {
  const variantClasses = {
    light: 'bg-soft-white/80',
    warm: 'bg-cream/90',
    white: 'bg-white/95'
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl p-6 sm:p-8
        ${hover ? 'transition-all duration-300 hover:-translate-y-1' : ''}
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(74, 63, 54, 0.08)',
        border: '1px solid rgba(200, 184, 158, 0.2)',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at top right, rgba(250, 247, 242, 0.8), transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
