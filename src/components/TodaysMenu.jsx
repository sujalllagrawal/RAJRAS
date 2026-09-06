import { rajrasConfig, todaysMenu } from "../config/rajrasConfig";
import { TiffinStack } from "./TiffinArt";

export default function TodaysMenu({ onOrder }) {
  return (
    <section id="menu" className="py-20 md:py-28">
      <div className="container-content">
        <div className="text-center max-w-xl mx-auto reveal">
          <p className="eyebrow mb-4">Today's Menu</p>
          <h2 className="text-[34px] md:text-[42px] font-semibold text-ink leading-[1.12]">
            Today's RAJRASS
          </h2>
        </div>

        <div className="mt-12 max-w-md mx-auto reveal">
          <div className="relative bg-cream border border-cream-line rounded-tiffin shadow-card p-8 md:p-10">
            <TiffinStack className="absolute -top-8 right-8 w-10 h-16" />

            <p className="eyebrow !text-ink-faint mb-5">{todaysMenu.name.toUpperCase()}</p>

            <ul className="space-y-3">
              {todaysMenu.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 text-[16px] text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
                  {item.label}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-cream-line flex items-end justify-between">
              <div>
                <p className="font-display text-4xl font-semibold text-rajras-red leading-none">
                  ₹{rajrasConfig.price}
                </p>
                <p className="mt-2 text-[12px] tracking-widest2 uppercase font-semibold text-saffron">
                  Free Delivery
                </p>
              </div>
              <button onClick={onOrder} className="btn-primary !px-6">
                Order This Meal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
