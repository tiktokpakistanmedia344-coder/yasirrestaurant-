import React from 'react';
import { Facebook, Instagram, Share2, MessageSquare } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/restaurantData';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#090909] py-8 text-neutral-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-xs text-neutral-500 text-center sm:text-left">
          © {new Date().getFullYear()} Yasir Restaurant & Grill House. All Rights Reserved. Gulberg III, Lahore, Pakistan.
        </p>

        {/* Active WhatsApp Helpline & Social Icons */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-neutral-400">
          <a
            href={BUSINESS_DETAILS.primaryWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#25D366] hover:text-white transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>{BUSINESS_DETAILS.phoneDisplay}</span>
          </a>

          <span className="hidden sm:inline text-white/15">|</span>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-[#F47812] transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-[#F47812] transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
            className="hover:text-[#F47812] transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
