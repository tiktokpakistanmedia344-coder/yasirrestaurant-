import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Star, ArrowRight, X, Utensils, ChevronDown, ChevronUp } from 'lucide-react';
import type { MenuItem, MenuCategoryId } from '../types/restaurant';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';

const ITEMS_PER_PAGE = 20;

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  externalCategory?: MenuCategoryId | 'all';
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectItem, externalCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalCategory) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchQuery]);

  // Filter items by category and search term
  const filteredItems = useMemo(() => {
    let result = MENU_ITEMS;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < filteredItems.length;
  const canShowLess = filteredItems.length > ITEMS_PER_PAGE && !hasMoreItems;
  const nextBatchCount = Math.min(ITEMS_PER_PAGE, filteredItems.length - visibleCount);

  return (
    <section id="menu" className="py-24 bg-[#0d0d0d] relative border-t border-b border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-3 text-[#F47812] text-xs uppercase font-extrabold tracking-[0.25em] mb-2">
            <span className="w-8 h-[1px] bg-[#F47812]" />
            <span>CULINARY EXCELLENCE</span>
            <span className="w-8 h-[1px] bg-[#F47812]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Explore Our Complete Menu
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            From smoky charcoal platters to gourmet smash burgers and Italian pasta, savor 140+ fresh handcrafted creations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search your favorite food... (e.g. Malai Boti, Ribeye, Alfredo, Smash Burger)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-12 pr-10 py-3.5 rounded-full bg-[#171717] border border-[#2e2e2e] focus:border-[#F47812] focus:outline-none text-white text-sm shadow-xl placeholder-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start lg:justify-center">
          <button
            onClick={() => {
              setSelectedCategory('all');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#F47812] text-white shadow-lg shadow-[#F47812]/30'
                : 'bg-[#171717] hover:bg-[#222222] text-neutral-300 border border-white/5'
            }`}
          >
            <span>ALL DISHES</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedCategory === 'all' ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {MENU_ITEMS.length}
            </span>
          </button>

          {MENU_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = MENU_ITEMS.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#F47812] text-white shadow-lg shadow-[#F47812]/30'
                    : 'bg-[#171717] hover:bg-[#222222] text-neutral-300 border border-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Food Items Grid */}
        <div ref={gridTopRef} className="scroll-mt-28" />
        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group rounded-3xl bg-[#171717] border border-[#262626] hover:border-[#F47812]/60 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#111111]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallbackApplied) return;
                      img.dataset.fallbackApplied = '1';
                      img.src =
                        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F47812] text-white shadow-md">
                        {item.badge}
                      </span>
                    )}
                    {item.isChefSpecial && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C9A45C] text-black shadow-md">
                        Special
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="text-[#F47812] uppercase font-semibold">
                        {item.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1 text-[#C9A45C]">
                        <Star className="w-3.5 h-3.5 fill-[#C9A45C]" />
                        <span className="font-bold text-white">{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold font-serif text-white group-hover:text-[#F47812] transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Bottom Row: Price & Buy Button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                        PRICE
                      </span>
                      <span className="text-base sm:text-lg font-black text-[#F47812]">
                        {item.priceDisplay}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center gap-1 shadow-md shadow-[#F47812]/20 transition-all cursor-pointer"
                    >
                      <span>BUY NOW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#171717] rounded-3xl border border-white/5">
            <Utensils className="w-12 h-12 text-[#F47812] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">No dishes found matching your search</h3>
            <p className="text-sm text-neutral-400 mt-1">
              Try searching for "Burger", "Tikka", "Steak", or "Pizza".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F47812] text-white"
            >
              Reset Search & View All
            </button>
          </div>
        )}

        {/* Pagination Controls: Show 20 at a time with More, and Less once all items are shown */}
        {filteredItems.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-xs sm:text-sm text-neutral-400">
              Showing <span className="text-white font-bold">{displayedItems.length}</span> of{' '}
              <span className="text-[#F47812] font-bold">{filteredItems.length}</span> dishes
            </p>

            {hasMoreItems ? (
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length))
                }
                className="px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white shadow-lg shadow-[#F47812]/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>More</span>
                <span className="text-[11px] font-semibold bg-black/25 px-2 py-0.5 rounded-full">
                  +{nextBatchCount}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : canShowLess ? (
              <button
                type="button"
                onClick={() => {
                  setVisibleCount(ITEMS_PER_PAGE);
                  gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#171717] hover:bg-[#222222] text-white border border-[#F47812]/60 hover:border-[#F47812] shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Less</span>
                <ChevronUp className="w-4 h-4 text-[#F47812]" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};
