import { mealComponents } from "../config/rajrasConfig";

// Small set of hand-drawn glyphs (no stock icon library) matching each
// meal component, kept intentionally simple and consistent in line weight.
const glyphs = {
  dal: (
    <svg viewBox="0 0 40 40" className="w-9 h-9">
      <circle cx="20" cy="20" r="14" fill="none" stroke="#8C2B1E" strokeWidth="2" />
      <path d="M10 20a10 10 0 0020 0" fill="#C98A2C" />
    </svg>
  ),
  sabzi: (
    <svg viewBox="0 0 40 40" className="w-9 h-9">
      <circle cx="16" cy="18" r="6" fill="#8C2B1E" />
      <circle cx="26" cy="16" r="5" fill="#C98A2C" />
      <circle cx="22" cy="26" r="5" fill="#6C2016" />
    </svg>
  ),
  roti: (
    <svg viewBox="0 0 40 40" className="w-9 h-9">
      <circle cx="20" cy="20" r="14" fill="none" stroke="#8C2B1E" strokeWidth="2" strokeDasharray="2 5" />
      <circle cx="20" cy="20" r="14" fill="#EED9A8" opacity="0.4" />
    </svg>
  ),
  rice: (
    <svg viewBox="0 0 40 40" className="w-9 h-9">
      <path d="M12 26c2-8 4-14 8-14s6 6 8 14" fill="none" stroke="#8C2B1E" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="20" cy="27" rx="10" ry="3" fill="#C98A2C" opacity="0.5" />
    </svg>
  ),
  salad: (
    <svg viewBox="0 0 40 40" className="w-9 h-9">
      <path d="M10 24c4-10 16-10 20 0" fill="none" stroke="#8C2B1E" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="24" r="3" fill="#C98A2C" />
    </svg>
  ),
};

export default function MealComponents() {
  return (
    <section className="py-20 md:py-28 bg-cream-soft/60">
      <div className="container-content">
        <div className="max-w-xl reveal">
          <p className="eyebrow mb-4">What's In Your Tiffin</p>
          <h2 className="text-[34px] md:text-[42px] font-semibold text-ink leading-[1.12]">
            Aaj ka khana, ghar jaisa.
          </h2>
          <p className="mt-4 text-[16px] text-ink-soft leading-relaxed">
            Simple ingredients. Familiar flavours. Food that feels like home.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {mealComponents.map((item, i) => (
            <div
              key={item.id}
              className="reveal bg-cream border border-cream-line rounded-tiffin p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="mb-5">{glyphs[item.id]}</div>
              <h3 className="font-display text-[19px] font-semibold text-ink mb-2">{item.name}</h3>
              <p className="text-[14px] text-ink-soft leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
