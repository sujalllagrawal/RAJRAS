import { rajrasConfig } from "../config/rajrasConfig";

export default function Hero({ onOrder }) {
  return (
    <section id="home" className="relative pt-[110px] md:pt-[140px] pb-16 md:pb-20 overflow-hidden bg-cream">
      {/* Background ambient light */}
      <div
        className="pointer-events-none absolute -top-24 -right-20 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #C98A2C 0%, transparent 70%)" }}
      />

      <div className="container-content grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-7 animate-riseIn">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rajras-red/10 border border-rajras-red/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-rajras-red animate-pulse" />
            <p className="text-xs md:text-[13px] font-semibold tracking-widest uppercase text-rajras-red">
              HOME-STYLE TIFFIN • FRESHLY PREPARED
            </p>
          </div>

          <h1 className="text-[44px] leading-[1.05] sm:text-[56px] sm:leading-[1.04] lg:text-[64px] lg:leading-[1.02] font-semibold text-ink">
            Ghar Jaisa Khana.
            <br />
            <span className="text-rajras-red">Sirf ₹{rajrasConfig.price}.</span>
          </h1>

          <p className="mt-6 text-[17px] sm:text-[18px] leading-relaxed text-ink-soft max-w-xl">
            {rajrasConfig.supportingText}
          </p>

          {/* Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="bg-cream-soft border border-cream-line px-5 py-3 rounded-tiffin shadow-sm flex items-center gap-3">
              <span className="font-display text-3xl font-semibold text-rajras-red">
                ₹{rajrasConfig.price}
              </span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-ink-faint border-l border-cream-line pl-3">
                PER MEAL
              </span>
            </div>

            <div className="bg-saffron/10 border border-saffron/30 px-5 py-3 rounded-tiffin shadow-sm flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron" />
              <span className="text-[13px] font-semibold tracking-widest uppercase text-saffron">
                FREE DOORSTEP DELIVERY
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap gap-4 items-center">
            <button onClick={onOrder} className="btn-primary !px-8 !py-4 text-[16px] shadow-lift">
              ORDER NOW
            </button>
            <a href="#menu" className="btn-secondary !px-7 !py-4 text-[15px]">
              VIEW THIS WEEK'S MENU
            </a>
          </div>
        </div>

        {/* Right Food Photo Visual */}
        <div className="lg:col-span-5 relative animate-riseIn [animation-delay:120ms]">
          <div className="relative mx-auto max-w-[460px] lg:max-w-none">
            <div className="relative rounded-2xl overflow-hidden border border-cream-line shadow-[0_25px_60px_-15px_rgba(35,26,21,0.22)] group">
              <img
                src="/images/hero_thali.png"
                alt="Rajras Authentic Indian Home-Style Meal Thali"
                className="w-full h-[400px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-cream/95 backdrop-blur border border-cream-line rounded-tiffin p-4 shadow-lg flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-ink text-[16px]">Today's Fresh Thali</p>
                  <p className="text-[12px] text-ink-soft">Soft Roti • Dal Tadka • Sabzi • Rice • Achaar</p>
                </div>
                <button onClick={onOrder} className="text-[13px] font-semibold text-rajras-red hover:underline">
                  Order →
                </button>
              </div>
            </div>

            {/* Floating Offer Pill */}
            <div className="absolute -top-4 -left-4 bg-cream border border-cream-line shadow-card rounded-tiffin px-4 py-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <p className="font-display font-semibold text-rajras-red text-[15px] leading-none">
                Freshly Cooked Batch
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
