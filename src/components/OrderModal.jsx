import { useEffect, useState } from "react";
import { rajrasConfig } from "../config/rajrasConfig";
import { buildOrderMessage, buildWhatsAppUrl } from "../utils/whatsapp";
import { saveOrderToSupabase } from "../utils/supabase";

const emptyForm = { name: "", phone: "", address: "", quantity: 1, instructions: "" };

export default function OrderModal({ open, onClose, selectedDay }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [selectedFridayOption, setSelectedFridayOption] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setForm(emptyForm);
      setErrors({});
      setSubmittedSuccess(false);
      setIsSubmitting(false);

      if (selectedDay?.isSpecial && selectedDay?.options?.length > 0) {
        setSelectedFridayOption(selectedDay.options[0].label);
      } else {
        setSelectedFridayOption("");
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, selectedDay]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const itemTotal = (selectedDay.price || rajrasConfig.price) * form.quantity;
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "FLAT") {
      discount = appliedCoupon.discount_value;
    } else if (appliedCoupon.discount_type === "PERCENT") {
      discount = (itemTotal * appliedCoupon.discount_value) / 100;
    }
  }
  const total = Math.max(0, itemTotal + rajrasConfig.deliveryCharge - discount);

  function handleApplyCoupon() {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    // Load active coupons
    const savedCoupons = localStorage.getItem("rajrass_coupons");
    const couponsList = savedCoupons
      ? JSON.parse(savedCoupons)
      : [
          { id: 1, code: "WELCOME10", discount_type: "PERCENT", discount_value: 10, min_order_amount: 120, active: true },
          { id: 2, code: "FLAT20", discount_type: "FLAT", discount_value: 20, min_order_amount: 120, active: true },
        ];

    const match = couponsList.find((c) => c.code === code && c.active);
    if (!match) {
      setCouponError("Invalid or expired coupon code");
      setAppliedCoupon(null);
      return;
    }

    if (match.min_order_amount && itemTotal < match.min_order_amount) {
      setCouponError(`Minimum order amount of ₹${match.min_order_amount} required`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(match);
    setCouponError("");
  }

  function changeQty(delta) {
    setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity + delta) }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^[0-9+\s-]{8,15}$/.test(form.phone.trim())) next.phone = "Please enter a valid 10-digit phone number";
    if (!form.address.trim() || form.address.trim().length < 5)
      next.address = "Please enter your full delivery address";
    
    if (selectedDay.isSpecial && !selectedFridayOption) {
      next.fridayOption = "Please select one Friday meal option";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    let mealText = "";
    if (selectedDay.isSpecial && selectedFridayOption) {
      mealText = `Friday Special — ${selectedFridayOption}`;
    } else if (selectedDay.items && selectedDay.items.length > 0) {
      mealText = `${selectedDay.day} (${selectedDay.items.join(" + ")})`;
    } else {
      mealText = `${selectedDay.day} RAJRASS Tiffin`;
    }

    // Save order data asynchronously to Supabase
    await saveOrderToSupabase({
      name: form.name,
      phone: form.phone,
      address: form.address,
      day: selectedDay.day,
      meal: mealText,
      fridayOption: selectedFridayOption || null,
      quantity: form.quantity,
      unitPrice: rajrasConfig.price,
      total,
      instructions: form.instructions,
    });

    // Build WhatsApp URL and open chat
    const message = buildOrderMessage({
      dayData: selectedDay,
      selectedFridayOption,
      name: form.name,
      phone: form.phone,
      address: form.address,
      quantity: form.quantity,
      instructions: form.instructions,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discount,
      total,
    });

    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setSubmittedSuccess(true);
  }

  function changeQty(delta) {
    setForm((f) => ({ ...f, quantity: Math.max(1, Math.min(15, f.quantity + delta)) }));
  }

  if (!open || !selectedDay) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet */}
      <div className="relative bg-cream w-full sm:max-w-lg sm:rounded-tiffin rounded-t-2xl shadow-lift max-h-[92vh] flex flex-col overflow-hidden animate-riseIn">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream border-b border-cream-line px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-[22px] font-semibold text-ink">
              Order Your {selectedDay.day} Tiffin
            </h3>
            <p className="text-[12px] text-ink-soft">Fast WhatsApp Ordering • Synced with Supabase</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:bg-cream-soft hover:text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto px-6 py-5 space-y-6">
          {/* Selected Meal Card */}
          <div className="bg-white border border-cream-line rounded-tiffin p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rajras-red/10 text-rajras-red font-semibold text-[11px] uppercase tracking-wider mb-1">
                  {selectedDay.day} Meal
                </span>
                <h4 className="font-display text-lg font-semibold text-ink">
                  {selectedDay.isSpecial ? "Friday Special Menu" : selectedDay.items.slice(0, 2).join(" + ")}
                </h4>
              </div>
              <span className="font-display text-2xl font-semibold text-rajras-red">₹{rajrasConfig.price}</span>
            </div>

            {!selectedDay.isSpecial && selectedDay.items && (
              <p className="mt-2 text-[13.5px] text-ink-soft leading-relaxed">
                Includes: <span className="font-medium text-ink">{selectedDay.items.join(" • ")}</span>
              </p>
            )}
          </div>

          {/* Friday Special Options Selector */}
          {selectedDay.isSpecial && selectedDay.options && (
            <div>
              <label className="block font-display text-[16px] font-semibold text-ink mb-2">
                Choose your Friday meal option <span className="text-rajras-red">*</span>
              </label>
              <div className="space-y-2.5">
                {selectedDay.options.map((opt) => {
                  const isSelected = selectedFridayOption === opt.label;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setSelectedFridayOption(opt.label)}
                      className={`flex items-center justify-between p-3.5 rounded-tiffin border cursor-pointer transition-all ${
                        isSelected
                          ? "border-rajras-red bg-rajras-red/5 shadow-sm"
                          : "border-cream-line bg-white hover:border-ink/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-rajras-red bg-rajras-red" : "border-ink/40 bg-white"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cream" />}
                        </div>
                        <div>
                          <p className="font-semibold text-[14.5px] text-ink">{opt.label}</p>
                          <p className="text-[12px] text-ink-faint">{opt.detail}</p>
                        </div>
                      </div>
                      <span className="font-display font-semibold text-[14px] text-rajras-red">₹120</span>
                    </label>
                  );
                })}
              </div>
              {errors.fridayOption && (
                <p className="mt-1.5 text-[12.5px] text-rajras-red font-medium">{errors.fridayOption}</p>
              )}
            </div>
          )}

          {/* Form fields */}
          <form id="orderForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink-soft mb-1">
                Your Name <span className="text-rajras-red">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-tiffin border border-cream-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-rajras-red/40 focus:border-rajras-red transition-all"
              />
              {errors.name && <p className="mt-1 text-[12.5px] text-rajras-red">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-soft mb-1">
                Phone Number <span className="text-rajras-red">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full rounded-tiffin border border-cream-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-rajras-red/40 focus:border-rajras-red transition-all"
              />
              {errors.phone && <p className="mt-1 text-[12.5px] text-rajras-red">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-soft mb-1">
                Delivery Address <span className="text-rajras-red">*</span>
              </label>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Flat / PG / House no., street, landmark, area"
                rows={2}
                className="w-full rounded-tiffin border border-cream-line bg-white px-4 py-2.5 text-[14.5px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-rajras-red/40 focus:border-rajras-red transition-all resize-none"
              />
              {errors.address && <p className="mt-1 text-[12.5px] text-rajras-red">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-soft mb-1.5">Number of Tiffins</label>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-cream-line bg-white rounded-tiffin overflow-hidden">
                  <button
                    type="button"
                    onClick={() => changeQty(-1)}
                    className="w-10 h-10 flex items-center justify-center text-ink text-lg font-semibold hover:bg-cream-soft transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-display text-lg font-semibold text-ink">
                    {form.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQty(1)}
                    className="w-10 h-10 flex items-center justify-center text-ink text-lg font-semibold hover:bg-cream-soft transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-[13px] text-ink-soft font-medium">
                  = ₹{rajrasConfig.price * form.quantity}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div>
              <label className="block text-[13px] font-semibold text-ink-soft mb-1">
                Have a Coupon Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-tiffin border border-cream-line bg-white px-3 py-2 text-xs uppercase font-mono font-semibold focus:outline-none focus:border-rajras-red"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-cream border border-cream-line text-ink hover:border-rajras-red hover:text-rajras-red text-xs font-semibold px-4 rounded-tiffin transition-all"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="mt-1 text-[12px] text-rajras-red">{couponError}</p>}
              {appliedCoupon && (
                <p className="mt-1 text-[12px] text-green-700 font-semibold">
                  ✓ Coupon "{appliedCoupon.code}" applied!
                </p>
              )}
            </div>
          </form>

          {/* Order Summary Box */}
          <div className="bg-cream-soft/80 border border-cream-line rounded-tiffin p-4 space-y-2">
            <p className="text-[11px] tracking-widest2 uppercase font-semibold text-ink-faint">
              Order Summary
            </p>
            <div className="flex justify-between text-[13.5px] text-ink-soft">
              <span>
                {selectedDay.day} Tiffin × {form.quantity}
              </span>
              <span className="font-semibold text-ink">₹{itemTotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[13.5px] text-green-700 font-semibold">
                <span>Coupon Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-[13.5px] text-ink-soft">
              <span>Doorstep Delivery</span>
              <span className="text-saffron font-semibold">FREE</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-cream-line">
              <span className="font-display font-semibold text-ink text-[16px]">Total Payable</span>
              <span className="font-display text-2xl font-semibold text-rajras-red">₹{total}</span>
            </div>
          </div>

          {/* Success banner */}
          {submittedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-tiffin p-3.5 text-center text-[13.5px]">
              <p className="font-semibold">Order saved & ready on WhatsApp!</p>
              <p className="text-[12.5px] opacity-90">Just press <strong>Send</strong> in WhatsApp to complete your order.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-cream border-t border-cream-line px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button
            type="submit"
            form="orderForm"
            disabled={isSubmitting}
            className="btn-primary w-full !py-3.5 !text-[16px] shadow-lift disabled:opacity-50"
          >
            {isSubmitting ? "SAVING ORDER..." : "ORDER ON WHATSAPP"}
          </button>
        </div>
      </div>
    </div>
  );
}
