import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Loader2,
  Share2,
  Mail,
  Copy,
  Check,
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import type { OrderRecord } from '../types/restaurant';
import { generateQrCodeUrl, saveOrderToStorage, buildOrderMailtoLink } from '../utils/qrCode';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface DemoPaymentModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onPaymentSuccess?: (order: OrderRecord) => void;
}

export const DemoPaymentModal: React.FC<DemoPaymentModalProps> = ({
  order,
  onClose,
  onPaymentSuccess,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    setIsProcessing(false);
    setIsSuccess(false);
    setCopiedRef(false);
    if (!order) {
      setQrDataUrl('');
      return;
    }
    const payload = JSON.stringify({
      app: 'Yasir Restaurant & Grill House - DEMO',
      ref: order.referenceId,
      item: order.itemName,
      qty: order.quantity,
      totalPKR: order.totalAmount,
      customer: order.customer.fullName,
      phone: order.customer.phone,
      address: order.customer.address,
      demoNote: 'DEMO ONLY - NOT A REAL PAYMENT',
    });

    generateQrCodeUrl(payload).then(setQrDataUrl);
  }, [order]);

  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, isProcessing, onClose]);

  if (!order) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const updatedOrder: OrderRecord = {
        ...order,
        status: 'DEMO PAYMENT SUCCESSFUL',
      };
      saveOrderToStorage(updatedOrder);
      if (onPaymentSuccess) {
        onPaymentSuccess(updatedOrder);
      }
    }, 1200);
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(order.referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const whatsappOrderUrl = buildWhatsAppUrl(
    `Hello Yasir Restaurant! I have placed an order:
🔖 Order Ref: ${order.referenceId}
🍽️ Item: ${order.itemName} x ${order.quantity}
💰 Total: Rs. ${order.totalAmount.toLocaleString()}
👤 Name: ${order.customer.fullName}
📞 Phone: ${order.customer.phone}
📍 Address: ${order.customer.address}
${order.customer.specialInstructions ? `📝 Note: ${order.customer.specialInstructions}\n` : ''}
Payment Status: Verified Demo Payment`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-payment-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[94vh] overflow-y-auto rounded-3xl bg-[#171717] border border-[#2e2e2e] shadow-2xl shadow-black/90 text-white p-6 sm:p-8">
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#262626] hover:bg-[#F47812] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* DEMO NOTICE BANNER (CRITICAL) */}
        <div className="p-3 mb-5 rounded-2xl bg-amber-950/40 border border-amber-600/40 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-[#F47812] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 leading-snug">
            <span className="font-extrabold uppercase tracking-wide text-[#F47812] block">
              DEMO PAYMENT ONLY — NOT A REAL PAYMENT
            </span>
            This is an interactive demonstration showcase for Yasir Restaurant. No real bank or credit card charge will occur.
          </div>
        </div>

        {!isSuccess ? (
          <div>
            <div className="text-center mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F47812]">
                Order Reference
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-white">
                  {order.referenceId}
                </span>
                <button
                  onClick={handleCopyRef}
                  className="p-1 rounded-md bg-[#262626] hover:bg-[#333] text-neutral-300"
                  title="Copy Reference"
                >
                  {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* QR Code Canvas Card */}
            <div className="p-6 rounded-2xl bg-white text-black flex flex-col items-center justify-center mx-auto max-w-[280px] shadow-2xl">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Demo Payment QR Code"
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-neutral-400">
                  <QrCode className="w-16 h-16 animate-pulse" />
                </div>
              )}
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-neutral-600 mt-2 text-center">
                Scan with any mobile QR reader
              </span>
            </div>

            {/* Order Details Summary */}
            <div className="mt-5 p-4 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Selected Item:</span>
                <span className="font-bold text-white text-right">
                  {order.itemName} x {order.quantity}
                </span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Customer:</span>
                <span className="font-semibold text-white">{order.customer.fullName}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Contact Phone:</span>
                <span className="font-mono text-white">{order.customer.phone}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Destination:</span>
                <span className="text-white text-right truncate max-w-[200px]">
                  {order.customer.address}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-white uppercase">Amount Payable:</span>
                <span className="text-lg font-extrabold text-[#F47812]">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* SIMULATE PAYMENT BUTTON */}
            <div className="mt-6">
              <button
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider bg-[#F47812] hover:bg-[#D96509] disabled:opacity-75 text-white flex items-center justify-center gap-2 shadow-xl shadow-[#F47812]/25 cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Demo QR Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>SIMULATE SUCCESSFUL PAYMENT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* SUCCESS ANIMATION VIEW */
          <div className="text-center py-4 space-y-5 animate-fadeIn">
            {/* Green Checkmark Circle */}
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-scaleUp">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 mb-2">
                Payment Simulated & Verified
              </span>
              <h2 id="demo-payment-title" className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Order Confirmed!
              </h2>
              <p className="mt-1 text-sm text-neutral-300 max-w-sm mx-auto">
                Thank you! Your demo food order has been logged under reference #{order.referenceId}.
              </p>
            </div>

            {/* Email Notification Status */}
            <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-emerald-500/30 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Mail className="w-4 h-4" />
                <span>Notification Email Recipient:</span>
              </div>
              <p className="text-xs text-neutral-300 font-mono break-all bg-black/50 p-2 rounded-lg border border-white/5">
                tiktokpakitanmedia344@gmail.com
              </p>
              <p className="text-[11px] text-neutral-400">
                A mock kitchen docket with your item, delivery address, and contact details is generated.
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={buildOrderMailtoLink(order)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#262626] hover:bg-[#333333] text-white flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#F47812]" />
                <span>Open Mail Confirmation Fallback</span>
              </a>

              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#1EBE5D] text-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 fill-black" />
                <span>Send Order Summary via WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                Back to Menu & Specials
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
