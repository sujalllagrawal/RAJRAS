import { testimonials } from "../config/rajrasConfig";

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-content">
        <div className="max-w-xl reveal">
          <p className="eyebrow mb-4">What People Say</p>
          <h2 className="text-[34px] md:text-[42px] font-semibold text-ink leading-[1.12]">
            Loved by people who miss ghar ka khana.
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="reveal bg-cream-soft/70 border border-cream-line rounded-tiffin p-7"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <p className="text-[15.5px] text-ink leading-relaxed">"{t.quote}"</p>
              <footer className="mt-5 text-[13px] font-semibold text-ink-faint tracking-wide">
                {t.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
