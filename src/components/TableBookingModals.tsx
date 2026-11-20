import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import type { SeatingOption, BookingRecord } from '../types/restaurant';
import { SEATING_OPTIONS } from '../data/restaurantData';
import { generateQrCodeUrl, saveBookingToStorage, buildBookingMailtoLink } from '../utils/qrCode';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface TableBookingModalsProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTableId?: string;
}

export const TableBookingModals: React.FC<TableBookingModalsProps> = ({
  isOpen,
  onClose,
  preselectedTableId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTable, setSelectedTable] = useState<SeatingOption>(
    SEATING_OPTIONS.find((t) => t.id === preselectedTableId) || SEATING_OPTIONS[0]
  );

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+92 3');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('08:00 PM');
  const [guests, setGuests] = useState('4 Guests');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 3 QR & Simulation
  const [bookingRecord, setBookingRecord] = useState<BookingRecord | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsProcessing(false);
    setIsSuccess(false);
    setBookingRecord(null);
    setQrDataUrl('');
    setFormErrors({});
    if (preselectedTableId) {
      const found = SEATING_OPTIONS.find((t) => t.id === preselectedTableId);
      if (found) {
        setSelectedTable(found);
        setStep(2);
        return;
      }
    }
    setStep(1);
  }, [isOpen, preselectedTableId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const handleSelectTable = (table: SeatingOption) => {
    setSelectedTable(table);
    setStep(2);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name';
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please provide a valid phone number';
    }

    if (!date) {
      errors.date = 'Please pick a booking date';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const ref = `YASIR-TBL-${Math.floor(100000 + Math.random() * 900000)}`;
    const record: BookingRecord = {
      bookingReference: ref,
      tableId: selectedTable.id,
      tableName: selectedTable.name,
      tableImage: selectedTable.image,
      fullName: fullName.trim(),
      email: email.trim() || 'guest@yasirrestaurant.pk',
      phone: phone.trim(),
      location: `Plot 45-C Gulberg III (${selectedTable.name})`,
      date,
      time,
      guests,
      specialInstructions: specialInstructions.trim(),
      createdAt: new Date().toISOString(),
      status: 'PENDING DEMO PAYMENT',
    };

    setBookingRecord(record);

    const payload = JSON.stringify({
      app: 'Yasir Restaurant & Grill House - Table Reservation DEMO',
      ref: record.bookingReference,
      table: record.tableName,
      date: record.date,
      time: record.time,
      guests: record.guests,
      name: record.fullName,
      phone: record.phone,
      demoNote: 'DEMO ONLY - NOT A REAL PAYMENT',
    });

    const qr = await generateQrCodeUrl(payload);
    setQrDataUrl(qr);
    setStep(3);
  };

  const handleSimulatePayment = () => {
    if (!bookingRecord) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const updated: BookingRecord = {
        ...bookingRecord,
        status: 'DEMO BOOKING REQUEST RECEIVED',
      };
      setBookingRecord(updated);
      saveBookingToStorage(updated);
    }, 1200);
  };

  const whatsappBookingUrl = bookingRecord
    ? buildWhatsAppUrl(
        `Hello Yasir Restaurant! I would like to reserve a table:
🔖 Booking Ref: ${bookingRecord.bookingReference}
🪑 Seating: ${bookingRecord.tableName}
📅 Date: ${bookingRecord.date}
⏰ Time: ${bookingRecord.time}
👥 Party Size: ${bookingRecord.guests}
👤 Reserved By: ${bookingRecord.fullName}
📞 Phone: ${bookingRecord.phone}
${bookingRecord.specialInstructions ? `📝 Requests: ${bookingRecord.specialInstructions}\n` : ''}
Please confirm my table reservation. Thank you!`
      )
    : buildWhatsAppUrl();

  const timeOptions = [
    '12:30 PM',
    '01:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:30 PM',
    '11:30 PM',
    '12:30 AM',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#171717] border border-[#2a2a2a] shadow-2xl shadow-black/90 text-white p-6 sm:p-8">
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#262626] hover:bg-[#F47812] text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Multi-Step Indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6 pb-4 border-b border-white/10 text-xs uppercase font-bold tracking-wider">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#F47812]' : 'text-neutral-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#F47812] text-white' : 'bg-neutral-800'}`}>
              1
            </span>
            <span className="hidden sm:inline">Choose Table</span>
          </div>
          <div className="w-8 h-0.5 bg-neutral-800" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#F47812]' : 'text-neutral-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#F47812] text-white' : 'bg-neutral-800'}`}>
              2
            </span>
            <span className="hidden sm:inline">Reservation Details</span>
          </div>
          <div className="w-8 h-0.5 bg-neutral-800" />
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-[#F47812]' : 'text-neutral-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-[#F47812] text-white' : 'bg-neutral-800'}`}>
              3
            </span>
            <span className="hidden sm:inline">Demo QR Confirmation</span>
          </div>
        </div>

        {/* STEP 1: CHOOSE TABLE */}
        {step === 1 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-[#F47812]">
                Step 1 of 3
              </span>
              <h2 id="booking-modal-title" className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Select Your Desired Seating
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Choose the dining environment that fits your evening at Yasir Restaurant & Grill House.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SEATING_OPTIONS.map((table) => (
                <div
                  key={table.id}
                  className="rounded-2xl bg-[#0f0f0f] border border-white/10 overflow-hidden hover:border-[#F47812]/50 transition-all group flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={table.image}
                      alt={table.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F47812] text-white shadow-md">
                      {table.badge}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{table.name}</h3>
                      <p className="text-xs text-[#F47812] font-medium mb-2">{table.tagline}</p>
                      <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                        {table.description}
                      </p>
                      <div className="space-y-1 mb-5">
                        {table.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F47812]" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectTable(table)}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <span>SELECT {table.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: RESERVATION DETAILS FORM */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-xs font-semibold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Seating Options</span>
              </button>
            </div>

            {/* Selected table pill */}
            <div className="p-3 mb-6 rounded-2xl bg-[#0e0e0e] border border-white/5 flex items-center gap-3">
              <img
                src={selectedTable.image}
                alt={selectedTable.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#F47812]/30"
              />
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-[#F47812]">Selected Ambiance</span>
                <h4 className="text-sm font-bold text-white">{selectedTable.name}</h4>
                <p className="text-xs text-neutral-400">{selectedTable.tagline}</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 id="booking-modal-title" className="text-2xl font-serif font-bold text-white">
                Table Reservation Form
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Reserve your table at Plot 45-C, Main Boulevard, Gulberg III, Lahore.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bilal Ahmed"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm"
                    />
                  </div>
                  {formErrors.fullName && <p className="mt-1 text-xs text-red-400">{formErrors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                    Phone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+92 329 3179587"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm"
                    />
                  </div>
                  {formErrors.phone && <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                    Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm cursor-pointer"
                    >
                      {timeOptions.map((t) => (
                        <option key={t} value={t} className="bg-[#171717] text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                    Party Size *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm cursor-pointer"
                    >
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests (Couple)</option>
                      <option value="3 Guests">3 Guests</option>
                      <option value="4 Guests">4 Guests</option>
                      <option value="5-6 Guests">5 - 6 Guests</option>
                      <option value="7-10 Guests">7 - 10 Guests</option>
                      <option value="10+ Guests (Large Party)">10+ Guests (Large Party)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm"
                  />
                </div>
                {formErrors.email && <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                  Special Arrangements & Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Birthday cake presentation, quiet corner table, baby high-chair needed..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 focus:border-[#F47812] focus:outline-none text-white text-sm resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] text-white flex items-center justify-center gap-2 shadow-xl shadow-[#F47812]/20 transition-all cursor-pointer"
                >
                  <span>CONTINUE TO DEMO BOOKING QR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: DEMO QR PAYMENT & CONFIRMATION */}
        {step === 3 && bookingRecord && (
          <div className="max-w-md mx-auto">
            {/* DEMO NOTICE BANNER */}
            <div className="p-3 mb-5 rounded-2xl bg-amber-950/40 border border-amber-600/40 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#F47812] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-snug">
                <span className="font-extrabold uppercase tracking-wide text-[#F47812] block">
                  DEMO PAYMENT ONLY — NOT A REAL PAYMENT
                </span>
                This demo reservation QR showcases instant table holding at Yasir Restaurant. No real bank transaction is initiated.
              </div>
            </div>

            {!isSuccess ? (
              <div>
                <div className="text-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#F47812]">
                    Booking Reference
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-white mt-1">
                    {bookingRecord.bookingReference}
                  </div>
                </div>

                {/* QR Canvas */}
                <div className="p-5 rounded-2xl bg-white text-black flex flex-col items-center justify-center mx-auto max-w-[260px] shadow-2xl">
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="Booking Demo QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  )}
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-600 mt-2">
                    Scannable Table Booking QR
                  </span>
                </div>

                {/* Details summary */}
                <div className="mt-5 p-4 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-300">
                    <span>Table Selected:</span>
                    <span className="font-bold text-white">{bookingRecord.tableName}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Date & Time:</span>
                    <span className="font-bold text-white">
                      {bookingRecord.date} at {bookingRecord.time}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Party Size:</span>
                    <span className="font-semibold text-white">{bookingRecord.guests}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Customer:</span>
                    <span className="text-white">{bookingRecord.fullName} ({bookingRecord.phone})</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="font-bold text-white uppercase">Table Deposit:</span>
                    <span className="text-base font-extrabold text-[#F47812]">
                      DEMO FREE HOLD (Rs. 0)
                    </span>
                  </div>
                </div>

                {/* Simulate Button */}
                <div className="mt-5">
                  <button
                    disabled={isProcessing}
                    onClick={handleSimulatePayment}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] disabled:opacity-75 text-white flex items-center justify-center gap-2 shadow-xl shadow-[#F47812]/25 cursor-pointer transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Confirming Reservation...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>SIMULATE SUCCESSFUL BOOKING PAYMENT</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success screen */
              <div className="text-center py-4 space-y-5 animate-fadeIn">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-scaleUp">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 mb-2">
                    Reservation Confirmed
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Table Reserved at Yasir!
                  </h3>
                  <p className="mt-1 text-sm text-neutral-300">
                    Your {bookingRecord.tableName} is reserved for {bookingRecord.guests} on {bookingRecord.date} at {bookingRecord.time}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-emerald-500/30 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Mail className="w-4 h-4" />
                    <span>Notification Email Recipient:</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-mono break-all bg-black/50 p-2 rounded-lg border border-white/5">
                    tiktokpakitanmedia344@gmail.com
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={buildBookingMailtoLink(bookingRecord)}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#262626] hover:bg-[#333333] text-white flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#F47812]" />
                    <span>Open Mail Confirmation Fallback</span>
                  </a>

                  <a
                    href={whatsappBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#1EBE5D] text-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 fill-black" />
                    <span>Confirm via WhatsApp Concierge</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Done & Return to Website
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
