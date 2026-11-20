import React from 'react';
import { MapPin, Clock, Phone, Bike } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/restaurantData';

export const BottomOrangeStrip: React.FC = () => {
  return (
    <div className="w-full bg-[#F47812] text-white py-8 sm:py-10 shadow-2xl relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-white/20">
          {/* 1: OUR LOCATION */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#F47812] flex-shrink-0 shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">
                OUR LOCATION
              </h4>
              <p className="text-xs font-medium text-white/95 leading-snug mt-0.5">
                Plot 45-C, Main Boulevard, Gulberg III, Lahore
              </p>
            </div>
          </div>

          {/* 2: OPENING HOURS */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#F47812] flex-shrink-0 shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">
                OPENING HOURS
              </h4>
              <p className="text-xs font-medium text-white/95 leading-snug mt-0.5">
                Mon - Sun: 12:30 PM - 01:00 AM
              </p>
            </div>
          </div>

          {/* 3: CALL US */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#F47812] flex-shrink-0 shadow-md">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">
                CALL US
              </h4>
              <a
                href={BUSINESS_DETAILS.primaryWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-white/95 hover:text-black hover:underline leading-snug mt-0.5 font-mono block transition-colors"
              >
                {BUSINESS_DETAILS.phoneDisplay}
              </a>
            </div>
          </div>

          {/* 4: FAST DELIVERY */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#F47812] flex-shrink-0 shadow-md">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">
                FAST DELIVERY
              </h4>
              <p className="text-xs font-medium text-white/95 leading-snug mt-0.5">
                Delicious food delivered fast & hot to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
