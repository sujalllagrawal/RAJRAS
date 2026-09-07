import { rajrasConfig } from "../config/rajrasConfig";

export default function TheplaSection({ onOrderThepla }) {
  const { specialThepla } = rajrasConfig;

  return (
    <section id="thepla" className="py-16 bg-gradient-to-r from-amber-50 via-cream to-amber-50 border-y border-cream-line relative overflow-hidden">
      {/* Decorative background glow */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-2xl"
        style={{ background: "radial-gradient(circle, #C98A2C 0%, transparent 70%)" }}
      />

      <div className="container-content">
        <div className="bg-white border-2 border-saffron/30 rounded-3xl p-6 sm:p-10 shadow-card relative overflow-hidden grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Top Badge */}
          <div className="absolute top-4 right-4 bg-saffron text-cream text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
            ⚡ DAILY SPECIAL 12 PM - 12 AM
          </div>

          {/* Content */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-saffron/10 border border-saffron/30 px-3 py-1 rounded-full text-xs font-bold text-saffron uppercase tracking-wider">
              <span>🫓 ALL DAY SNACK & MEAL</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              3 Fresh Methi Thepla + Homemade Achar
            </h2>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-xl">
              {specialThepla.description} Hot, fresh, and delivered right to your doorstep continuously from <strong className="text-ink">12:00 PM to 12:00 AM daily</strong>!
            </p>

            {/* Price & Add-on Tag */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="bg-cream border border-cream-line px-4 py-2.5 rounded-xl flex items-center gap-2">
                <span className="text-xs text-ink-faint uppercase font-bold">Price:</span>
                <span className="font-display text-2xl font-bold text-rajras-red">₹59</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <span className="text-emerald-700 font-bold text-xs uppercase">🌶️ Optional Add-on:</span>
                <span className="text-xs font-bold text-emerald-800">
                  Bharva Mirch (+₹10 extra)
                </span>
              </div>
            </div>
          </div>

          {/* Action Callout */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <div className="text-center lg:text-right space-y-3 w-full sm:w-auto">
              <button
                onClick={onOrderThepla}
                className="btn-primary w-full sm:w-auto !py-4 !px-8 !text-base shadow-lift"
              >
                ORDER THEPLA (₹59)
              </button>
              <p className="text-[11px] text-ink-faint">Free Doorstep Delivery • Freshly Prepared</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
