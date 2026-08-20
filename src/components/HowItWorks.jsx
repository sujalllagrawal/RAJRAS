import { howItWorks } from "../config/rajrasConfig";

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-28">
      <div className="container-content">
        <div className="max-w-xl reveal">
          <p className="eyebrow mb-4">How It Works</p>
          <h2 className="text-[34px] md:text-[42px] font-semibold text-ink leading-[1.12]">
            From craving to doorstep, in three steps.
          </h2>
        </div>

        <div className="mt-14 relative grid sm:grid-cols-3 gap-10 sm:gap-6">
          <div className="hidden sm:block absolute top-[26px] left-[16%] right-[16%] h-px bg-cream-line" />
          {howItWorks.map((item, i) => (
            <div key={item.step} className="reveal relative" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="relative z-10 inline-flex items-center justify-center w-[52px] h-[52px] rounded-full bg-cream border border-rajras-red/25 font-display text-rajras-red font-semibold text-lg">
                {item.step}
              </span>
              <h3 className="mt-5 font-display text-[20px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-[14px] text-ink-soft leading-relaxed max-w-[240px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
