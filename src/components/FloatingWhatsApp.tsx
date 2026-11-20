import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/restaurantData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="relative mb-2 px-3.5 py-2 rounded-2xl bg-[#171717] text-white border border-[#2e2e2e] shadow-2xl text-xs flex items-center gap-2 animate-fadeIn max-w-[210px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <span className="text-[11px] leading-tight">
            Order or Reserve on WhatsApp ({BUSINESS_DETAILS.phoneDisplay})
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss message"
            className="text-neutral-400 hover:text-white ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={BUSINESS_DETAILS.primaryWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-black flex items-center justify-center shadow-2xl shadow-[#25D366]/40 hover:scale-110 transition-all cursor-pointer"
      >
        <MessageSquare className="w-7 h-7 fill-black" />
      </a>
    </div>
  );
};
