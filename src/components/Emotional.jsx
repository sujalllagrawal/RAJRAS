import { rajrasConfig } from "../config/rajrasConfig";

export default function Emotional({ onOrder }) {
  return (
    <section className="py-24 md:py-32 bg-rajras-red text-cream relative overflow-hidden">
      {/* Soft background glow */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(circle, #FBF5EA 0%, transparent 70%)" }}
      />

      <div className="container-content relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 reveal">
            <span className="inline-block px-3.5 py-1 rounded-full bg-cream/15 text-cream font-semibold text-[12px] uppercase tracking-widest mb-6">
              GHAR KA SWAAD • ROZ KA SUKOON
            </span>

            <h2 className="font-display text-[36px] sm:text-[46px] md:text-[54px] leading-[1.08] font-semibold text-cream mb-6">
              Jab ghar ka khana yaad aaye...
            </h2>

            <div className="space-y-4 text-[17px] sm:text-[18px] leading-relaxed text-cream/90 max-w-xl">
              <p>Kabhi dal-roti ki craving hoti hai.</p>
              <p>Kabhi bas ek simple sa ghar ka khana chahiye.</p>
              <p>Rajras unhi dinon ke liye hai.</p>
              <p className="font-display font-semibold text-2xl text-cream pt-2">
                Ghar ka swaad. Roz ka sukoon.
              </p>
            </div>

            <div className="mt-9">
              <button
                onClick={onOrder}
                className="inline-flex items-center justify-center gap-2 bg-cream text-rajras-red px-8 py-4 rounded-tiffin font-semibold text-[16px] tracking-wide transition-all duration-300 hover:bg-white hover:shadow-lift active:scale-[0.98]"
              >
                ORDER YOUR TIFFIN
              </button>
            </div>
          </div>

          {/* Right Photo */}
          <div className="lg:col-span-5 reveal">
            <div className="relative rounded-2xl overflow-hidden border border-cream/20 shadow-2xl">
              <img
                src="/images/emotional_ghar.png"
                alt="Serving hot fresh home cooked rotis from tiffin"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rajras-red/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-cream/95 backdrop-blur text-ink rounded-tiffin p-4 shadow-lg">
                <p className="font-display font-semibold text-rajras-red text-[16px]">Prepared like home</p>
                <p className="text-[13px] text-ink-soft">Fresh rotis, light dal, zero excess oil.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
