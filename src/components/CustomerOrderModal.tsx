import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, User, Phone, MapPin, Mail, MessageSquare } from 'lucide-react';
import type { MenuItem, DealItem, OrderCustomerInfo } from '../types/restaurant';

interface CustomerOrderModalProps {
  orderItem: {
    item: MenuItem | DealItem;
    type: 'menu_item' | 'deal';
    quantity: number;
    totalAmount: number;
  } | null;
  onClose: () => void;
  onBack: () => void;
  onSubmitCustomerInfo: (info: OrderCustomerInfo) => void;
}

export const CustomerOrderModal: React.FC<CustomerOrderModalProps> = ({
  orderItem,
  onClose,
  onBack,
  onSubmitCustomerInfo,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+92 3');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setErrors({});
  }, [orderItem?.item.id]);

  useEffect(() => {
    if (!orderItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderItem, onClose]);

  if (!orderItem) return null;

  const { item, quantity, totalAmount, type } = orderItem;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (minimum 2 characters)';
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Please provide a valid Pakistani contact phone number (e.g. 0329 3179587)';
    }

    if (!address.trim() || address.trim().length < 5) {
      newErrors.address = 'Please enter delivery address or dining table location';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmitCustomerInfo({
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      email: email.trim() || 'guest@yasirrestaurant.pk',
      specialInstructions: specialInstructions.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-order-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#171717] border border-[#2a2a2a] shadow-2xl shadow-black/80 text-white p-5 sm:p-6">
        {/* Header buttons */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Quantity</span>
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#262626] hover:bg-[#F47812] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="my-3.5 p-3.5 rounded-2xl bg-[#0e0e0e] border border-white/5 flex items-center gap-4">
          <img
            src={item.image}
            alt={'title' in item ? item.title : item.name}
            className="w-14 h-14 rounded-xl object-cover border border-[#F47812]/30"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#F47812]">
              {type === 'deal' ? 'Special Big Deal' : 'A La Carte Menu'}
            </span>
            <h3 className="text-base font-bold text-white truncate">
              {'title' in item ? item.title : item.name}
            </h3>
            <p className="text-xs text-neutral-400">
              Quantity: <span className="text-white font-semibold">{quantity}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400 uppercase block">Amount Due</span>
            <span className="text-lg sm:text-xl font-extrabold text-[#F47812]">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <h2 id="customer-order-title" className="text-xl sm:text-2xl font-serif font-bold text-white mb-0.5">
          Delivery & Contact Details
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mb-4">
          Provide your contact info to generate your instant scannable Demo Payment QR Code.
        </p>

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Yasir"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1">
                Contact Phone (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  required
                  placeholder="+92 329 3179587"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
            </div>
          </div>

          {/* Delivery Address / Location */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1">
              Delivery Address or Table # (in Gulberg & Lahore) *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <textarea
                required
                rows={2}
                placeholder="House/Plot #, Street, Block, Phase or In-Restaurant Table #"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm resize-none"
              />
            </div>
            {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                placeholder="your.email@example.com (Notifications also sent to manager)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1">
              Cooking & Spice Preferences (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <textarea
                rows={2}
                placeholder="e.g. Medium spice, extra mint raita, well-done steak..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm resize-none"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center justify-center gap-2 shadow-xl shadow-[#F47812]/20 transition-all cursor-pointer"
            >
              <span>CONTINUE TO DEMO PAYMENT QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
