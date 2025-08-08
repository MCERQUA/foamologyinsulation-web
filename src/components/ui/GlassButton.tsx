import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-terra-cotta/60 text-soft-white hover:bg-terra-cotta/70 border-terra-cotta/20',
    secondary: 'bg-khaki/60 text-soft-white hover:bg-khaki/70 border-khaki/20',
    outline: 'bg-transparent border-2 border-espresso text-espresso hover:bg-espresso/10'
  };

  const buttonContent = (
    <button
      onClick={onClick}
      className={`
        relative font-semibold overflow-hidden cursor-pointer 
        transition-all duration-300 rounded-full
        backdrop-blur-md border
        shadow-glass hover:shadow-xl hover:shadow-terra-cotta/20
        transform hover:-translate-y-1 hover:scale-105
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
      style={{
        filter: 'drop-shadow(0 0 20px rgba(123, 167, 217, 0.4)) drop-shadow(0 0 40px rgba(123, 167, 217, 0.2))',
        boxShadow: '0 0 30px rgba(123, 167, 217, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Enhanced glass light effect overlay */}
      <div
        className="absolute inset-0 z-0 rounded-full"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full">
        {children}
      </div>
    </button>
  );

  return href ? (
    <a href={href} className="inline-block">
      {buttonContent}
    </a>
  ) : (
    buttonContent
  );
};

export default GlassButton;
