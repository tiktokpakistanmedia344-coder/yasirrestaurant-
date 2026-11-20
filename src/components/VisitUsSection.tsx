import React from 'react';
import { MapPin, Clock, Phone, Navigation, Star, MessageSquare } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/restaurantData';
import { isRestaurantOpenNow, buildWhatsAppUrl } from '../utils/whatsapp';

export const VisitUsSection: React.FC = () => {
  const openStatus = isRestaurantOpenNow();

  return (
    <section id="visit" className="py-24 bg-[#090909] relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 text-[#F47812] text-xs uppercase font-extrabold tracking-[0.25em] mb-2">
            <span className="w-8 h-[1px] bg-[#F47812]" />
            <span>FIND US IN GULBERG</span>
            <span className="w-8 h-[1px] bg-[#F47812]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Visit Yasir Restaurant & Grill House
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Conveniently situated on Main Boulevard, Gulberg III — Lahore’s premier culinary destination with valet parking and elegant dining spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Rating Box */}
            <div className="p-6 rounded-3xl bg-[#171717] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#F47812] tracking-wider block">
                  CUSTOMER SATISFACTION
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-black text-white">4.7 / 5</span>
                  <div className="flex text-[#C9A45C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C9A45C]" />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-neutral-400 mt-1 block">
                  Based on {BUSINESS_DETAILS.reviewsCount} verified customer reviews
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    openStatus.isOpen
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {openStatus.statusText}
                </span>
                <span className="text-[11px] text-neutral-400 block mt-1">
                  {openStatus.nextTransition}
                </span>
              </div>
            </div>

            {/* Address Box */}
            <div className="p-6 rounded-3xl bg-[#171717] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F47812]">
                <MapPin className="w-4 h-4" />
                <span>Restaurant Location</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Plot 45-C, Main Boulevard, Gulberg III
              </h3>
              <p className="text-sm text-neutral-400">
                Lahore, Punjab, Pakistan (Next to prominent commercial landmarks)
              </p>
              <div className="pt-2">
                <a
                  href={BUSINESS_DETAILS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F47812] hover:text-white transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <Navigation className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Operating Hours Box */}
            <div className="p-6 rounded-3xl bg-[#171717] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F47812]">
                <Clock className="w-4 h-4" />
                <span>Operating Hours</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Monday – Sunday: 12:30 PM – 01:00 AM
              </h3>
              <p className="text-sm text-neutral-400">
                Serving hot lunch, afternoon snacks, evening dinner, and late-night grills 7 days a week.
              </p>
            </div>

            {/* Direct WhatsApp Call */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1f1610] to-[#171717] border border-[#F47812]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#F47812] tracking-wider block">
                  ORDER & RESERVATION HELPLINE
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {BUSINESS_DETAILS.phoneDisplay}
                </span>
              </div>
              <a
                href={BUSINESS_DETAILS.primaryWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#25D366] text-black flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Chat</span>
              </a>
            </div>
          </div>

          {/* Right Map Embed */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[380px] bg-[#121212]">
            <iframe
              title="Yasir Restaurant Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13606.376885375536!2d74.34005!3d31.5085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a27863155%3A0x6b1b4b62db189bc9!2sGulberg%20III%2C%20Lahore!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '440px', filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-[#F47812]/40 text-xs">
              <span className="font-bold text-white block">📍 Main Boulevard, Gulberg III</span>
              <span className="text-neutral-400 text-[11px]">Free valet & parking available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
