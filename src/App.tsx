import React, { useState, useEffect } from 'react';
import type { MenuItem, MenuCategoryId, DealItem, OrderCustomerInfo, OrderRecord } from './types/restaurant';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureStrip } from './components/FeatureStrip';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { SpecialtiesSection } from './components/SpecialtiesSection';
import { BigDealsSection } from './components/BigDealsSection';
import { TableBookingSection } from './components/TableBookingSection';
import { VisitUsSection } from './components/VisitUsSection';
import { BottomOrangeStrip } from './components/BottomOrangeStrip';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Modals
import { FoodDetailModal } from './components/FoodDetailModal';
import { CustomerOrderModal } from './components/CustomerOrderModal';
import { DemoPaymentModal } from './components/DemoPaymentModal';
import { TableBookingModals } from './components/TableBookingModals';

const SECTION_IDS = ['home', 'menu', 'about', 'specialties', 'deals', 'reservation', 'visit'];

export default function App() {
  // Active navigation section
  const [activeSection, setActiveSection] = useState<string>('home');
  const [menuExternalCategory, setMenuExternalCategory] = useState<MenuCategoryId | 'all' | undefined>(undefined);

  // Modal states
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [orderStage, setOrderStage] = useState<{
    item: MenuItem | DealItem;
    type: 'menu_item' | 'deal';
    quantity: number;
    totalAmount: number;
  } | null>(null);
  const [activeOrderRecord, setActiveOrderRecord] = useState<OrderRecord | null>(null);

  // Table reservation modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedTableId, setPreselectedTableId] = useState<string | undefined>(undefined);

  // Scroll spy for navbar active state
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      let current = 'home';

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollY) {
            current = id;
          }
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
        current = 'visit';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Open food detail modal
  const handleOpenFoodDetail = (item: MenuItem) => {
    setSelectedMenuItem(item);
  };

  // Convert deal to detail modal
  const handleOpenDealDetail = (deal: DealItem) => {
    // Adapt DealItem to MenuItem structure for consistent 2-column modal
    const adaptedDealItem: MenuItem = {
      id: deal.id,
      name: `${deal.dealNumber}: ${deal.title}`,
      category: 'tikka_bbq',
      price: deal.price,
      priceDisplay: deal.priceDisplay,
      shortDescription: `${deal.servings} • ${deal.savingsDisplay}`,
      description: `${deal.description}\nIncludes:\n${deal.includes.join('\n')}`,
      image: deal.image,
      alt: deal.alt,
      rating: 4.9,
      reviews: 240,
      badge: deal.badge,
      isChefSpecial: true,
    };
    setSelectedMenuItem(adaptedDealItem);
  };

  // Step 1 -> Step 2: From Food Detail to Customer Info Form
  const handleProceedToCustomerForm = (item: MenuItem, quantity: number) => {
    setSelectedMenuItem(null);
    setOrderStage({
      item,
      type: item.name.startsWith('DEAL') ? 'deal' : 'menu_item',
      quantity,
      totalAmount: item.price * quantity,
    });
  };

  // Step 2 -> Step 3: From Customer Form to Demo QR Payment
  const handleSubmitCustomerInfo = (info: OrderCustomerInfo) => {
    if (!orderStage) return;

    const refId = `YASIR-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemName = 'title' in orderStage.item ? orderStage.item.title : orderStage.item.name;
    const newRecord: OrderRecord = {
      referenceId: refId,
      itemType: orderStage.type,
      itemId: orderStage.item.id,
      itemName,
      itemImage: orderStage.item.image,
      category: 'category' in orderStage.item ? orderStage.item.category : 'Big Deals',
      unitPrice: orderStage.item.price,
      quantity: orderStage.quantity,
      totalAmount: orderStage.totalAmount,
      customer: info,
      createdAt: new Date().toISOString(),
      status: 'PENDING DEMO PAYMENT',
    };

    setActiveOrderRecord(newRecord);
    setOrderStage(null);
  };

  // Open booking modal helper
  const handleOpenBooking = (tableId?: string) => {
    setPreselectedTableId(tableId);
    setIsBookingOpen(true);
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white selection:bg-[#F47812] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Sticky Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        activeSection={activeSection}
      />

      {/* Main Content — Ordered strictly top-to-bottom to match Navbar */}
      <main>
        {/* 1. Home / Hero Section */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onExploreMenu={handleScrollToMenu}
        />

        {/* 4-Feature Benefit Strip matching reference */}
        <FeatureStrip />

        {/* 2. Menu — Complete 140+ Dishes Menu Catalog */}
        <MenuSection
          onSelectItem={handleOpenFoodDetail}
          externalCategory={menuExternalCategory}
        />

        {/* 3. About Us matching reference */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* 4. Our Specialties (BBQ, Steaks, Burgers) */}
        <SpecialtiesSection
          onSelectSpecialtyCategory={(catId) => {
            setMenuExternalCategory(catId as MenuCategoryId);
            handleScrollToMenu();
          }}
        />

        {/* 5. Big Deals Section */}
        <BigDealsSection onSelectDeal={handleOpenDealDetail} />

        {/* Multi-Step Table Reservation Section */}
        <TableBookingSection onOpenBooking={handleOpenBooking} />

        {/* 6. Visit Us — Gulberg III Lahore */}
        <VisitUsSection />
      </main>

      {/* Bottom 4-Column Orange Strip matching reference image footer */}
      <BottomOrangeStrip />

      {/* Dark Footer */}
      <Footer />

      {/* Floating WhatsApp Concierge */}
      <FloatingWhatsApp />

      {/* POPUPS & MODALS */}

      {/* 1. Food Detail Modal (2-column: Product on left, details on right) */}
      <FoodDetailModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onProceedToOrder={handleProceedToCustomerForm}
      />

      {/* 2. Customer Information Modal */}
      <CustomerOrderModal
        orderItem={orderStage}
        onClose={() => setOrderStage(null)}
        onBack={() => {
          if (orderStage) {
            setSelectedMenuItem(orderStage.item as MenuItem);
            setOrderStage(null);
          }
        }}
        onSubmitCustomerInfo={handleSubmitCustomerInfo}
      />

      {/* 3. Demo QR Payment Modal */}
      <DemoPaymentModal
        order={activeOrderRecord}
        onClose={() => setActiveOrderRecord(null)}
      />

      {/* 4. Multi-Step Table Booking Modal (Step 1 -> Step 2 -> Step 3) */}
      <TableBookingModals
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedTableId={preselectedTableId}
      />
    </div>
  );
}
