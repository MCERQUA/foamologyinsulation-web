import React from 'react';

interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface StatsCardProps {
  stats: Stat[];
  title?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, title }) => {
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-espresso mb-6 text-center">
          {title}
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl p-6 bg-soft-white/80 border border-white/20"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(74, 63, 54, 0.08)'
            }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 z-0 opacity-30"
              style={{
                background: 'radial-gradient(circle at top right, rgba(250, 247, 242, 0.8), transparent 70%)'
              }}
            />

            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="text-4xl font-bold text-terra-cotta mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-espresso mb-1">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-sm text-warm-gray">
                  {stat.description}
                </div>
              )}
            </div>

            {/* Decorative element */}
            <div
              className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, rgba(193, 119, 103, 0.4), transparent 70%)'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
