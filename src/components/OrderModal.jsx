import { useState, useEffect } from "react";
import { rajrasConfig } from "../config/rajrasConfig";
import { buildOrderMessage, buildWhatsAppUrl } from "../utils/whatsapp";
import { saveOrderToSupabase } from "../utils/supabase";
import { getCutoffStatus } from "../utils/cutoff";

export default function OrderModal({ open, onClose, selectedDay }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedFridayOption, setSelectedFridayOption] = useState("");
  
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (open) {
      setName("");
      setPhone("");
      setAddress("");
      setQuantity(1);
      setSpecialInstructions("");
      setCouponInput("");
      setAppliedCoupon(null);
      setCouponError("");
      setFormErrors({});
      setIsSubmitting(false);
      setIsSuccess(false);

      if (selectedDay?.isSpecial && selectedDay?.options?.length > 0) {
        setSelectedFridayOption(selectedDay.options[0].label);
      } else {
        setSelectedFridayOption("");
      }
    }
  }, [open, selectedDay]);

  if (!open || !selectedDay) return null;

  const unitPrice = selectedDay.price || rajrasConfig.price;
  const subtotal = unitPrice * quantity;
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "FLAT") {
      discount = appliedCoupon.discount_value;
    } else if (appliedCoupon.discount_type === "PERCENT") {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
    }
  }
  const totalAmount = Math.max(0, subtotal + rajrasConfig.deliveryCharge - discount);

  // Coupon verification
  async function handleApplyCoupon(e) {
    e.preventDefault();
    setCouponError("");

    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const phoneDigits = phone.trim().replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) {
      setCouponError("Please enter your 10-digit Phone Number first to apply coupon.");
      return;
    }

    const savedCoupons = localStorage.getItem("rajrass_coupons");
    const couponsList = savedCoupons
      ? JSON.parse(savedCoupons)
      : [
          { id: 1, code: "FIRST10", discount_type: "PERCENT", discount_value: 10, min_order_amount: 120, first_time_only: true, active: true },
          { id: 2, code: "WELCOME10", discount_type: "PERCENT", discount_value: 10, min_order_amount: 120, active: true },
          { id: 3, code: "FLAT20", discount_type: "FLAT", discount_value: 20, min_order_amount: 120, active: true },
        ];

    const match = couponsList.find((c) => c.code === code && c.active);
    if (!match) {
      setCouponError("Invalid or expired coupon code.");
      setAppliedCoupon(null);
      return;
    }

    if (match.code === "FIRST10" || match.first_time_only) {
      let isExisting = false;
      try {
        const localOrders = JSON.parse(localStorage.getItem("rajrass_orders") || "[]");
        isExisting = localOrders.some((o) => (o.phone_number || "").replace(/\D/g, "") === phoneDigits);
      } catch (err) {
        // ignore
      }

      if (isExisting) {
        setCouponError("Coupon 'FIRST10' is valid for 1st-time customers only. Phone number already registered.");
        setAppliedCoupon(null);
        return;
      }
    }

    if (match.min_order_amount && subtotal < match.min_order_amount) {
      setCouponError(`Minimum order amount of ₹${match.min_order_amount} required.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(match);
    setCouponError("");
  }

  function validate() {
    const errors = {};
    if (!name.trim()) errors.name = "Enter your name";
    if (!/^[0-9+\s-]{8,15}$/.test(phone.trim())) errors.phone = "Enter a valid 10-digit phone number";
    if (!address.trim() || address.trim().length < 4) errors.address = "Enter your full delivery address";

    if (selectedDay.isSpecial && !selectedFridayOption) {
      errors.fridayOption = "Select one Friday meal option";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Cutoff validation for same day meal after 6:30 PM
    const cutoffInfo = getCutoffStatus(selectedDay.dayCode);
    if (cutoffInfo.isClosed) {
      alert(`⏰ ORDER CLOSED FOR TODAY:\n\nSame-day orders for ${selectedDay.day} close at 6:30 PM.\n\nPlease pick another upcoming day from our weekly menu to order!`);
      return;
    }

    setIsSubmitting(true);

    let mealText = "";
    if (selectedDay.isSpecial && selectedFridayOption) {
      mealText = `Friday Special — ${selectedFridayOption}`;
    } else if (selectedDay.items && selectedDay.items.length > 0) {
      mealText = `${selectedDay.day} (${selectedDay.items.join(" + ")})`;
    } else {
      mealText = `${selectedDay.day} RAJRASS Tiffin`;
    }

    // Save order data
    await saveOrderToSupabase({
      name,
      phone,
      address,
      day: selectedDay.day,
      meal: mealText,
      fridayOption: selectedFridayOption || null,
      quantity,
      unitPrice,
      total: totalAmount,
      instructions: specialInstructions,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
    });

    // Build WhatsApp URL
    const message = buildOrderMessage({
      dayData: selectedDay,
      selectedFridayOption,
      name,
      phone,
      address,
      quantity,
      instructions: specialInstructions,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discount,
      total: totalAmount,
    });

    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setIsSuccess(true);
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-sm">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Premium Order Card */}
      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-cream-line">
        
        {/* Header */}
        <div className="bg-cream border-b border-cream-line px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-rajras-red uppercase bg-rajras-red/10 px-2 py-0.5 rounded">
              RAJRASS TIFFIN ORDER
            </span>
            <h3 className="font-display text-xl font-bold text-ink mt-0.5">
              {selectedDay.day} Meal Order
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-soft border border-cream-line flex items-center justify-center text-ink-soft hover:text-ink font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Cutoff Warning Banner if order closed for same day */}
          {getCutoffStatus(selectedDay.dayCode).isClosed && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-xl text-xs font-semibold space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-800 text-sm">
                ⏰ Same-Day Order Closed (Cutoff: 6:30 PM)
              </p>
              <p className="text-amber-900/90 font-medium">
                Orders for {selectedDay.day}'s meal close at 6:30 PM. You can browse or order for upcoming days from the weekly menu!
              </p>
            </div>
          )}

          {/* Meal Details Box */}
          <div className="bg-cream-soft border border-cream-line p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-ink text-base">{selectedDay.title}</p>
              <p className="text-xs text-ink-soft mt-0.5">
                {selectedDay.items ? selectedDay.items.join(" • ") : "Home cooked delicious thali"}
              </p>
            </div>
            <span className="font-display text-2xl font-bold text-rajras-red">₹{unitPrice}</span>
          </div>

          {/* Friday Special Options */}
          {selectedDay.isSpecial && selectedDay.options && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Choose Friday Combination <span className="text-rajras-red">*</span>
              </label>
              <div className="grid gap-2">
                {selectedDay.options.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedFridayOption(opt.label)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedFridayOption === opt.label
                        ? "border-rajras-red bg-rajras-red/5 font-semibold"
                        : "border-cream-line bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedFridayOption === opt.label ? "border-rajras-red bg-rajras-red" : "border-gray-400"
                      }`}>
                        {selectedFridayOption === opt.label && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm text-ink">{opt.label}</p>
                        <p className="text-[11px] text-ink-faint">{opt.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rajras-red">₹120</span>
                  </div>
                ))}
              </div>
              {formErrors.fridayOption && <p className="text-xs text-rajras-red font-semibold">{formErrors.fridayOption}</p>}
            </div>
          )}

          {/* Form Controls */}
          <form id="tiffinForm" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                Your Full Name <span className="text-rajras-red">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (e.g. Rahul Sharma)"
                className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm text-ink font-medium focus:outline-none focus:border-rajras-red focus:ring-1 focus:ring-rajras-red"
              />
              {formErrors.name && <p className="text-xs text-rajras-red mt-1 font-semibold">{formErrors.name}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                Phone Number <span className="text-rajras-red">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-white border border-cream-line rounded-xl px-4 py-3 text-sm text-ink font-medium focus:outline-none focus:border-rajras-red focus:ring-1 focus:ring-rajras-red"
              />
              {formErrors.phone && <p className="text-xs text-rajras-red mt-1 font-semibold">{formErrors.phone}</p>}
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                Delivery Address <span className="text-rajras-red">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No., Landmark, Area details"
                className="w-full bg-white border border-cream-line rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:border-rajras-red focus:ring-1 focus:ring-rajras-red resize-none"
              />
              {formErrors.address && <p className="text-xs text-rajras-red mt-1 font-semibold">{formErrors.address}</p>}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-cream-soft border border-cream-line p-3 rounded-xl">
              <div>
                <p className="text-xs font-bold text-ink uppercase tracking-wider">Number of Tiffins</p>
                <p className="text-xs text-ink-soft">₹{unitPrice} per meal</p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-cream-line rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded flex items-center justify-center font-bold text-ink hover:bg-cream-soft"
                >
                  −
                </button>
                <span className="font-bold text-base text-ink w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(15, q + 1))}
                  className="w-8 h-8 rounded flex items-center justify-center font-bold text-ink hover:bg-cream-soft"
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                Special Instructions <span className="text-ink-faint font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Less spicy / No onion / Call on arrival"
                className="w-full bg-white border border-cream-line rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:border-rajras-red focus:ring-1 focus:ring-rajras-red"
              />
            </div>
          </form>

          {/* Coupon Code Input */}
          <div className="pt-2 border-t border-cream-line">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">Have a Coupon?</label>
              <span className="text-[10px] font-bold text-rajras-red bg-rajras-red/10 px-2 py-0.5 rounded">
                1st Order Code: FIRST10
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code (e.g. FIRST10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-cream-line rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-rajras-red"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-cream border border-cream-line text-ink hover:border-rajras-red hover:text-rajras-red text-xs font-bold px-4 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-rajras-red mt-1 font-semibold">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-xs text-green-700 mt-1 font-semibold">
                ✓ Coupon "{appliedCoupon.code}" applied successfully!
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-cream-soft border border-cream-line rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-ink-soft">
              <span>{selectedDay.day} Tiffin × {quantity}</span>
              <span className="font-bold text-ink">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-green-700 font-bold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-ink-soft">
              <span>Doorstep Delivery</span>
              <span className="text-saffron font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-cream-line">
              <span className="font-bold text-ink text-sm">Total Payable</span>
              <span className="font-display font-bold text-2xl text-rajras-red">₹{totalAmount}</span>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-xl text-center text-xs font-semibold">
              Order registered successfully! Opening WhatsApp...
            </div>
          )}

        </div>

        {/* Sticky Submit Button Footer */}
        <div className="bg-white border-t border-cream-line p-4">
          <button
            type="submit"
            form="tiffinForm"
            disabled={isSubmitting}
            className="btn-primary w-full !py-3.5 text-base font-bold shadow-lift"
          >
            {isSubmitting ? "PROCESSING ORDER..." : "ORDER ON WHATSAPP"}
          </button>
        </div>

      </div>
    </div>
  );
}
