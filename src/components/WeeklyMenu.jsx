import { useState, useEffect } from "react";
import { weeklyMenu, rajrasConfig } from "../config/rajrasConfig";

export default function WeeklyMenu({ onOrder }) {
  const [menuList, setMenuList] = useState(() => {
    const saved = localStorage.getItem("rajrass_weekly_menu");
    return saved ? JSON.parse(saved) : weeklyMenu;
  });
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    // Detect day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const todayCode = new Date().getDay();
    const foundIndex = menuList.findIndex((m) => m.dayCode === todayCode);
    if (foundIndex !== -1) {
      setCurrentDayIndex(foundIndex);
    }
  }, [menuList]);

  const activeDay = menuList[currentDayIndex];

  return (
    <section id="menu" className="py-20 md:py-28 bg-cream">
      <div className="container-content">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto reveal">
          <p className="eyebrow mb-3">Weekly Menu</p>
          <h2 className="text-[34px] sm:text-[42px] font-semibold text-ink leading-[1.08]">
            This Week at RAJRASS
          </h2>
          <p className="mt-4 text-[16px] text-ink-soft leading-relaxed">
            Six days. Six comforting menus. One simple promise — ghar jaisa khana.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-saffron/10 border border-saffron/30 text-saffron px-3.5 py-1 rounded-full text-xs font-semibold">
            <span>⏰ Same-Day Order Cutoff: 6:30 PM daily</span>
          </div>
        </div>

        {/* Day Selector Tabs (Swipeable / Scrollable on mobile) */}
        <div className="mt-10 reveal">
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
            {menuList.map((m, index) => {
              const isToday = m.dayCode === new Date().getDay();
              const isSelected = index === currentDayIndex;

              return (
                <button
                  key={m.day}
                  onClick={() => setCurrentDayIndex(index)}
                  className={`snap-start relative shrink-0 px-5 py-2.5 rounded-full text-[14.5px] font-medium transition-all duration-300 ${
                    isSelected
                      ? "bg-rajras-red text-cream shadow-md scale-105"
                      : "bg-cream-soft/80 text-ink-soft hover:bg-cream-line/60 hover:text-ink"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {m.day}
                    {isToday && (
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          isSelected ? "bg-saffron" : "bg-rajras-red animate-pulse"
                        }`}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Feature Box */}
        <div className="mt-8 max-w-4xl mx-auto reveal">
          <div className="bg-cream border border-cream-line rounded-2xl shadow-card overflow-hidden grid md:grid-cols-12">
            {/* Left/Top Image & Badges */}
            <div className="md:col-span-5 relative bg-cream-soft min-h-[260px] md:min-h-full flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-cream-line">
              <img
                src={activeDay.image || "/images/hero_thali.png"}
                alt={`${activeDay.day} Meal`}
                className="w-full h-56 md:h-64 object-cover rounded-tiffin shadow-md transition-all duration-500 hover:scale-[1.02]"
              />

              {activeDay.dayCode === new Date().getDay() && (
                <div className="absolute top-4 left-4 bg-rajras-red text-cream font-semibold text-[11px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  TODAY'S MENU
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-cream/95 backdrop-blur border border-cream-line px-3.5 py-1.5 rounded-tiffin shadow-sm">
                <span className="font-display font-semibold text-rajras-red text-lg">
                  ₹{rajrasConfig.price}
                </span>
                <span className="text-[11px] text-ink-faint uppercase font-semibold ml-1.5">
                  Free Delivery
                </span>
              </div>
            </div>

            {/* Right/Bottom Details */}
            <div className="md:col-span-7 p-7 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="eyebrow">{activeDay.day.toUpperCase()}</span>
                  <span className="text-[13px] font-semibold text-saffron uppercase tracking-wider">
                    {activeDay.isRestDay ? "Rest Day" : "Ghar Jaisa Khana"}
                  </span>
                </div>

                <h3 className="font-display text-[26px] sm:text-[32px] font-semibold text-ink leading-tight mb-3">
                  {activeDay.title}
                </h3>

                <p className="text-[15px] text-ink-soft mb-6">{activeDay.description}</p>

                {/* Items List or Special Friday Options */}
                {activeDay.isRestDay ? (
                  <div className="bg-cream-soft/60 border border-cream-line rounded-tiffin p-5 text-center my-4">
                    <p className="font-display text-lg text-ink font-semibold">{activeDay.message}</p>
                    <p className="mt-1 text-[13.5px] text-ink-soft">Our kitchen rests on Sunday to bring you fresh food every weekday.</p>
                  </div>
                ) : activeDay.isSpecial ? (
                  <div className="space-y-3 mb-6">
                    <p className="text-[12px] uppercase font-semibold tracking-widest2 text-ink-faint">
                      Choose Your Friday Combination:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {activeDay.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="bg-cream-soft/80 border border-cream-line rounded-tiffin px-3.5 py-2.5 text-[14px] font-semibold text-ink"
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-[12px] uppercase font-semibold tracking-widest2 text-ink-faint mb-3">
                      Included in this ₹120 Meal:
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {activeDay.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2.5 bg-cream-soft/60 border border-cream-line/80 px-3.5 py-2 rounded-tiffin text-[14.5px] text-ink font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rajras-red" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {!activeDay.isRestDay && (
                <div className="pt-4 border-t border-cream-line flex items-center justify-between gap-4">
                  <div>
                    <span className="font-display text-3xl font-semibold text-rajras-red">
                      ₹{rajrasConfig.price}
                    </span>
                    <span className="block text-[11px] text-ink-faint uppercase font-semibold">
                      Complete Meal • Free Delivery
                    </span>
                  </div>
                  <button
                    onClick={() => onOrder(activeDay)}
                    className="btn-primary !px-7 !py-3"
                  >
                    ORDER {activeDay.day.toUpperCase()}'S TIFFIN
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full 6-Day Grid Overview for desktop */}
        <div className="mt-16">
          <h3 className="font-display text-xl font-semibold text-ink text-center mb-8">
            Full Week Overview
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuList.map((m) => {
              const isToday = m.dayCode === new Date().getDay();
              return (
                <div
                  key={m.day}
                  className={`reveal bg-cream border transition-all duration-300 rounded-tiffin p-6 flex flex-col justify-between ${
                    isToday
                      ? "border-rajras-red shadow-card ring-1 ring-rajras-red/30"
                      : "border-cream-line hover:border-ink/20 hover:shadow-card"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display text-lg font-semibold text-ink">
                        {m.day}
                      </span>
                      {isToday && (
                        <span className="bg-rajras-red text-cream text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          TODAY
                        </span>
                      )}
                    </div>

                    {m.isRestDay ? (
                      <div className="py-4 text-center">
                        <p className="font-semibold text-ink-soft text-[15px]">{m.title}</p>
                        <p className="text-[13px] text-ink-faint mt-1">{m.message}</p>
                      </div>
                    ) : m.isSpecial ? (
                      <div className="py-2">
                        <p className="font-semibold text-rajras-red text-[15px] mb-2">{m.title}</p>
                        <ul className="text-[13.5px] text-ink-soft space-y-1">
                          {m.options.map((opt) => (
                            <li key={opt.id} className="flex items-center gap-1.5">
                              <span className="text-saffron">•</span> {opt.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="py-2">
                        <p className="font-display text-[17px] font-semibold text-ink mb-2">
                          {m.items.slice(0, 2).join(" + ")}
                        </p>
                        <p className="text-[13.5px] text-ink-soft leading-relaxed">
                          {m.items.join(" • ")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-cream-line flex items-center justify-between">
                    <span className="font-display text-xl font-semibold text-rajras-red">
                      {m.isRestDay ? "—" : `₹${m.price}`}
                    </span>
                    {!m.isRestDay && (
                      <button
                        onClick={() => onOrder(m)}
                        className="text-[13px] font-semibold text-rajras-red hover:text-rajras-red-dark underline underline-offset-4"
                      >
                        Order {m.day} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
