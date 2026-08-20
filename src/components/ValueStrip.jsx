import { valueItems } from "../config/rajrasConfig";

export default function ValueStrip() {
  return (
    <section className="bg-cream border-y border-cream-line py-8">
      <div className="container-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {valueItems.map((item, index) => (
            <div
              key={index}
              className="text-center md:text-left flex flex-col justify-center reveal"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <p className="font-display text-3xl md:text-[34px] font-semibold text-rajras-red leading-none mb-1">
                {item.value}
              </p>
              <p className="text-[12px] tracking-widest2 uppercase font-semibold text-ink-faint">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
