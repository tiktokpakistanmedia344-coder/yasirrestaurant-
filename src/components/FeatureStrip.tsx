import React from 'react';
import { Leaf, Utensils, Bell, Heart } from 'lucide-react';

export const FeatureStrip: React.FC = () => {
  const features = [
    {
      icon: Leaf,
      title: 'FRESH INGREDIENTS',
      description: 'We use only the freshest & finest ingredients sourced daily.',
    },
    {
      icon: Utensils,
      title: 'EXPERT CHEFS',
      description: 'Our master pitmasters craft every dish with passion and expertise.',
    },
    {
      icon: Bell,
      title: 'QUALITY SERVICE',
      description: 'Fast, friendly & professional hospitality on every visit.',
    },
    {
      icon: Heart,
      title: 'MADE WITH LOVE',
      description: 'Every dish is made with care to delight your taste buds.',
    },
  ];

  return (
    <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Light Cream Card Container matching reference image */}
      <div className="rounded-3xl bg-[#F8F5EF] text-[#171717] p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/40 border border-[#E8E2D5]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-neutral-300/60">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex flex-col items-center text-center ${
                  idx > 0 ? 'pt-6 sm:pt-0 lg:pl-6' : ''
                }`}
              >
                {/* Dark circular icon badge */}
                <div className="w-14 h-14 rounded-full bg-[#171717] flex items-center justify-center text-[#F47812] mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#171717] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-[220px]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
