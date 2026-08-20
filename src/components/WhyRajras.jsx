import { whyRajras } from "../config/rajrasConfig";

export default function WhyRajras() {
  return (
    <section id="why" className="py-20 md:py-28 bg-cream-soft/60">
      <div className="container-content">
        <div className="max-w-xl reveal">
          <p className="eyebrow mb-4">Why Rajras</p>
          <h2 className="text-[34px] md:text-[42px] font-semibold text-ink leading-[1.12]">
            Why Rajras?
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyRajras.map((item, i) => (
            <div
              key={item.title}
              className="reveal bg-cream border border-cream-line rounded-tiffin p-7"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="block w-8 h-8 rounded-full border border-rajras-red/30 relative">
                <span className="absolute inset-[7px] rounded-full bg-saffron" />
              </span>
              <h3 className="mt-4 font-display text-[19px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-[14px] text-ink-soft leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
