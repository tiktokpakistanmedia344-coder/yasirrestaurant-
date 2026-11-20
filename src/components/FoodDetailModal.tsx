import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, MessageSquare, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import type { MenuItem } from '../types/restaurant';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onProceedToOrder: (item: MenuItem, quantity: number) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  onProceedToOrder,
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const totalPrice = item.price * quantity;
  const descriptionLines = item.description.split('\n').filter((l) => l.trim().length > 0);

  const whatsappDirectUrl = buildWhatsAppUrl(
    `Hello Yasir Restaurant! I would like to order:
🍽️ Item: ${item.name}
🔢 Quantity: ${quantity}
💰 Total: Rs. ${totalPrice.toLocaleString()}
📍 Please deliver to my address. Please confirm order!`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#171717] border border-[#2a2a2a] shadow-2xl shadow-black/80 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-[#F47812] text-white flex items-center justify-center transition-all duration-200 border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Food Image & Highlights */}
          <div className="relative min-h-[300px] md:min-h-[460px] bg-[#121212] overflow-hidden flex flex-col justify-between p-6">
            <img
              src={item.image}
              alt={item.alt}
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallbackApplied) return;
                img.dataset.fallbackApplied = '1';
                img.src =
                  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
              }}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.92] hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-black/60 pointer-events-none" />

            {/* Badges on Top */}
            <div className="relative z-10 flex flex-wrap gap-2 items-start">
              {item.badge && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F47812] text-white shadow-lg">
                  <Flame className="w-3.5 h-3.5" />
                  {item.badge}
                </span>
              )}
              {item.isChefSpecial && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C9A45C] text-black shadow-lg">
                  Chef's Special
                </span>
              )}
            </div>

            {/* Price Badge on Bottom */}
            <div className="relative z-10 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-[#F47812]/40 inline-flex flex-col max-w-fit shadow-xl">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Single Portion Price
              </span>
              <span className="text-3xl font-extrabold text-[#F47812]">
                {item.priceDisplay}
              </span>
            </div>
          </div>

          {/* Right Column: Title, 5-Line Description, Qty, Order Buttons */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                <span className="text-[#F47812]">
                  {item.category.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1 text-[#C9A45C]">
                  <Star className="w-4 h-4 fill-[#C9A45C]" />
                  <span className="font-bold text-white">{item.rating}</span>
                  <span className="text-neutral-400">({item.reviews} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2
                id="food-modal-title"
                className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight"
              >
                {item.name}
              </h2>

              {/* Short tagline */}
              <p className="mt-1 text-sm text-[#F47812] font-medium">
                {item.shortDescription}
              </p>

              {/* 5-Line Description Box */}
              <div className="mt-4 p-4 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Culinary Profile & Ingredients:
                </p>
                {descriptionLines.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F47812] mt-2 flex-shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Live Total */}
            <div className="pt-2 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 uppercase font-semibold">Quantity</span>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 rounded-xl bg-[#262626] hover:bg-[#F47812] disabled:opacity-40 disabled:hover:bg-[#262626] text-white flex items-center justify-center font-bold transition-all cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-lg font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      aria-label="Increase quantity"
                      className="w-9 h-9 rounded-xl bg-[#262626] hover:bg-[#F47812] text-white flex items-center justify-center font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-400 uppercase font-semibold">Total Price</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F47812]">
                    Rs. {totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Order Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onProceedToOrder(item, quantity)}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#F47812]/20 transition-all cursor-pointer"
                >
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-[#25D366] hover:bg-[#1EBE5D] text-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-black" />
                  <span>ORDER ON WHATSAPP</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Prepared fresh to order in Gulberg III kitchen</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
