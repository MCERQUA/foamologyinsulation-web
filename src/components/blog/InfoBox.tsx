import React from 'react';

interface InfoBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'tip' | 'warning' | 'success';
  icon?: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  children,
  variant = 'info',
  icon
}) => {
  const variants = {
    info: {
      bg: 'bg-sky-blue/20',
      border: 'border-sky-blue/30',
      icon: '💡',
      iconBg: 'bg-sky-blue/30'
    },
    tip: {
      bg: 'bg-sage-accent/20',
      border: 'border-sage-accent/30',
      icon: '✓',
      iconBg: 'bg-sage-accent/30'
    },
    warning: {
      bg: 'bg-terra-cotta/20',
      border: 'border-terra-cotta/30',
      icon: '⚠',
      iconBg: 'bg-terra-cotta/30'
    },
    success: {
      bg: 'bg-sage-mist/20',
      border: 'border-sage-mist/30',
      icon: '✓',
      iconBg: 'bg-sage-mist/30'
    }
  };

  const style = variants[variant];

  return (
    <div
      className={`relative my-6 p-6 rounded-2xl border ${style.bg} ${style.border} backdrop-blur-sm`}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 4px 16px rgba(74, 63, 54, 0.05)'
      }}
    >
      {/* Icon */}
      <div className="absolute -top-3 left-6">
        <div className={`${style.iconBg} rounded-full px-3 py-1 text-sm font-medium border ${style.border}`}>
          {icon || style.icon}
        </div>
      </div>

      {/* Content */}
      <div className="pt-2">
        {title && (
          <h4 className="text-lg font-bold text-espresso mb-3">
            {title}
          </h4>
        )}
        <div className="text-warm-gray prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
