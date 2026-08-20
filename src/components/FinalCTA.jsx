import { rajrasConfig } from "../config/rajrasConfig";

export default function FinalCTA({ onOrder }) {
  return (
    <section className="py-24 md:py-32 bg-cream-soft border-t border-cream-line relative overflow-hidden">
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #8C2B1E 0%, transparent 70%)" }}
      />
      <div className="container-content text-center max-w-3xl relative">
        <div className="reveal">
          <p className="eyebrow mb-4">Daily Tiffin Service</p>
          <h2 className="font-display text-[36px] sm:text-[44px] md:text-[52px] font-semibold text-ink leading-tight mb-4">
            Aaj ghar ka khana ho jaaye?
          </h2>
          <p className="text-[17px] text-ink-soft max-w-xl mx-auto leading-relaxed mb-8">
            Choose your meal. Order in seconds. Enjoy Rajras at your doorstep.
          </p>

          <div className="inline-flex items-center gap-6 bg-cream border border-cream-line px-6 py-3 rounded-full mb-8 shadow-sm">
            <span className="font-display font-semibold text-rajras-red text-xl">
              ₹{rajrasConfig.price} / MEAL
            </span>
            <span className="w-px h-6 bg-cream-line" />
            <span className="text-[13px] font-semibold text-saffron uppercase tracking-widest">
              FREE DELIVERY
            </span>
          </div>

          <div>
            <button
              onClick={onOrder}
              className="btn-primary !px-10 !py-4 !text-lg shadow-lift"
            >
              ORDER NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
