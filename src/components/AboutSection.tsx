import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ABOUT_IMAGE } from '../data/restaurantData';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-24 bg-[#090909] relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Image with "10+ Years of Experience" orange badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={ABOUT_IMAGE}
                alt="Yasir Restaurant dining hall ambiance in Gulberg Lahore"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Orange 10+ Years Badge matching reference image */}
              <div className="absolute bottom-6 left-6 p-5 sm:p-6 rounded-2xl bg-[#F47812] text-white shadow-2xl flex flex-col justify-center min-w-[140px] sm:min-w-[160px]">
                <span className="text-3xl sm:text-4xl font-black leading-none">
                  10+
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/90 mt-1">
                  Years of Experience
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, description, CTA, and script signature matching reference */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#F47812] block mb-2">
                ABOUT US
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                A Place Where <br />
                <span className="text-[#F47812]">Good Food & Great Times</span> <br />
                Come Together
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              At Yasir Restaurant & Grill House, we believe that every meal is an unforgettable experience. From our warm, inviting ambiance to our masterfully prepared continental steaks and smoky charcoal BBQ, we're here to make your moments truly memorable in the heart of Gulberg III, Lahore.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <CheckCircle2 className="w-5 h-5 text-[#F47812] flex-shrink-0" />
                <span>Prime halal certified meat cuts, marinated for 24+ hours</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <CheckCircle2 className="w-5 h-5 text-[#F47812] flex-shrink-0" />
                <span>Live coal hearth pitmasters with traditional and modern expertise</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <CheckCircle2 className="w-5 h-5 text-[#F47812] flex-shrink-0" />
                <span>Spacious family, outdoor terrace & VIP private dining suites</span>
              </div>
            </div>

            {/* Button & Script Signature */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-6 border-t border-white/10">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center gap-2 shadow-xl shadow-[#F47812]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>BOOK A TABLE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Script Signature matching reference image */}
              <div className="flex items-center gap-2">
                <span className="font-script text-4xl sm:text-5xl text-[#F47812] tracking-wide">
                  Yasir
                </span>
                <span className="text-[#F47812] text-xl">♡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
