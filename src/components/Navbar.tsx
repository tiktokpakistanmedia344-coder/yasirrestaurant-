import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, UtensilsCrossed, Sparkles } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/restaurantData';

interface NavbarProps {
  onOpenBooking: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, activeSection = 'home' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About Us', href: '#about' },
    { label: 'Our Specialties', href: '#specialties' },
    { label: 'Big Deals', href: '#deals' },
    { label: 'Reservation', href: '#reservation' },
    { label: 'Visit Us', href: '#visit' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090909]/95 backdrop-blur-md py-3 shadow-xl shadow-black/60 border-b border-white/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo matching reference style */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D96509] to-[#F47812] flex items-center justify-center text-white shadow-lg shadow-[#F47812]/30 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-script text-3xl sm:text-4xl text-[#F47812] leading-none tracking-wide drop-shadow-md">
              Yasir
            </span>
            <span className="text-[9px] uppercase tracking-[0.24em] text-neutral-300 font-semibold mt-0.5">
              RESTAURANT & FAST FOOD
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-xs uppercase font-semibold tracking-wider transition-colors relative py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-[#F47812]'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {link.label}
                {link.label === 'Big Deals' && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F47812] text-white animate-pulse">
                    HOT
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47812] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Button matching reference image */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white shadow-lg shadow-[#F47812]/25 hover:shadow-xl hover:shadow-[#F47812]/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            BOOK A TABLE
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-xl bg-[#171717] border border-white/10 text-white hover:text-[#F47812] transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#121212]/98 border-b border-[#262626] backdrop-blur-xl animate-fadeIn">
          <div className="px-6 py-5 space-y-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between text-sm uppercase tracking-wider font-semibold py-2 border-b border-white/5 transition-colors ${
                    isActive ? 'text-[#F47812]' : 'text-neutral-300 hover:text-[#F47812]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.label === 'Big Deals' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F47812] text-white">
                      5 DEALS
                    </span>
                  )}
                </a>
              );
            })}
            <div className="pt-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#F47812] text-white flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>BOOK A TABLE NOW</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
