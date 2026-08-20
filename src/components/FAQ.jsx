import { useState } from "react";
import { faqs } from "../config/rajrasConfig";

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-cream-line">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-display text-[17px] font-semibold text-ink">{q}</span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-[14.5px] text-ink-soft leading-relaxed max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container-content max-w-3xl">
        <div className="reveal">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="text-[34px] md:text-[42px] font-semibold text-ink leading-[1.12]">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-10 reveal">
          {faqs.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
