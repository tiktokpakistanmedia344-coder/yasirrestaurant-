import React from 'react';
import { Calendar, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEATING_OPTIONS } from '../data/restaurantData';

interface TableBookingSectionProps {
  onOpenBooking: (tableId?: string) => void;
}

export const TableBookingSection: React.FC<TableBookingSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="reservation" className="py-24 bg-[#0d0d0d] relative overflow-hidden border-t border-b border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F47812]/20 border border-[#F47812]/40 text-[#F47812] text-xs uppercase font-extrabold tracking-widest">
              <Sparkles className="w-4 h-4 fill-[#F47812]" />
              <span>TABLE RESERVATION SYSTEM</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Your Table Is Waiting For You
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Whether you are planning an intimate romantic dinner under starlight, a vibrant Pakistani family feast, or an executive corporate dinner, reserve your preferred seating in just 3 quick steps.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <ShieldCheck className="w-5 h-5 text-[#F47812]" />
                <span>Zero reservation fees — instant digital holding</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <ShieldCheck className="w-5 h-5 text-[#F47812]" />
                <span>Real scannable QR confirmation & WhatsApp alert</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <ShieldCheck className="w-5 h-5 text-[#F47812]" />
                <span>Complimentary parking on Main Boulevard, Gulberg III</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onOpenBooking()}
                className="px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center gap-2 shadow-2xl shadow-[#F47812]/30 transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <span>BOOK A TABLE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right 4 Seating Options Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEATING_OPTIONS.map((table) => (
              <div
                key={table.id}
                onClick={() => onOpenBooking(table.id)}
                className="group relative rounded-2xl overflow-hidden bg-[#171717] border border-white/5 hover:border-[#F47812] p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                  <img
                    src={table.image}
                    alt={table.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F47812] text-white">
                    {table.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#F47812] transition-colors">
                    {table.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {table.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#F47812]">
                  <span>Reserve Space</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
