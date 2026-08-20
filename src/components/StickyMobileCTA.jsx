import { rajrasConfig } from "../config/rajrasConfig";

export default function StickyMobileCTA({ onOrder }) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/97 backdrop-blur border-t border-cream-line px-4 py-3 flex items-center justify-between shadow-[0_-6px_20px_-8px_rgba(35,26,21,0.18)]">
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-ink">
          ₹{rajrasConfig.price} Tiffin <span className="text-rajras-red">• FREE DELIVERY</span>
        </p>
        <p className="text-[11px] text-ink-faint">Ghar jaisa khana, roz.</p>
      </div>
      <button onClick={onOrder} className="btn-primary !py-2.5 !px-5 !text-[14px] whitespace-nowrap">
        Order Now
      </button>
    </div>
  );
}
