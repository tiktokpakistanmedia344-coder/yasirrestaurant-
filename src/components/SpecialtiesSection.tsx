import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { SPECIALTIES } from '../data/restaurantData';

interface SpecialtiesSectionProps {
  onSelectSpecialtyCategory: (categoryId: string) => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({
  onSelectSpecialtyCategory,
}) => {
  const categoryMap: Record<string, string> = {
    bbq: 'tikka_bbq',
    steak: 'steaks_grills',
    burger: 'burgers',
  };

  return (
    <section id="specialties" className="py-24 bg-[#0d0d0d] relative border-t border-b border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 text-[#F47812] text-xs uppercase font-extrabold tracking-[0.25em] mb-2">
            <span className="w-8 h-[1px] bg-[#F47812]" />
            <span>SIGNATURE CRAFT</span>
            <span className="w-8 h-[1px] bg-[#F47812]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Our Culinary Specialties
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Three signature domains perfected through years of passion, master flame craft, and secret spices in Gulberg III, Lahore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPECIALTIES.map((spec) => (
            <div
              key={spec.id}
              onClick={() => onSelectSpecialtyCategory(categoryMap[spec.category] || 'burgers')}
              className="group rounded-3xl bg-[#171717] border border-[#2a2a2a] hover:border-[#F47812] overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={spec.image}
                  alt={spec.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-black/60 pointer-events-none" />

                <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F47812] text-white shadow-lg flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Signature Specialty
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#F47812] transition-colors">
                    {spec.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                    {spec.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#F47812] group-hover:text-white transition-colors">
                  <span>Browse 20+ Varieties</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
