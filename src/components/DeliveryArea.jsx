import { rajrasConfig } from "../config/rajrasConfig";

export default function DeliveryArea() {
  return (
    <section className="py-20 md:py-28 bg-cream-soft/60">
      <div className="container-content grid md:grid-cols-2 gap-10 items-center">
        <div className="reveal">
          <p className="eyebrow mb-4">Delivery Area</p>
          <h2 className="text-[30px] md:text-[38px] font-semibold text-ink leading-[1.16]">
            RAJRASS delivers happiness to your doorstep.
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 bg-cream border border-cream-line rounded-tiffin px-4 py-2 text-[14px] font-semibold text-ink">
              <span className="w-2 h-2 rounded-full bg-saffron" />
              Currently delivering in: {rajrasConfig.deliveryArea}
            </span>
            <span className="inline-flex items-center gap-2 bg-rajras-red/10 text-rajras-red rounded-tiffin px-4 py-2 text-[14px] font-semibold">
              Free Delivery
            </span>
          </div>
        </div>

        <div className="reveal h-56 md:h-64 rounded-tiffin border border-cream-line bg-[radial-gradient(circle_at_30%_30%,#F3E9D7_0%,#E7DABE_100%)] flex items-center justify-center">
          <p className="text-ink-faint text-[13px] font-medium tracking-wide">
            Map placeholder — embed a delivery-area map here
          </p>
        </div>
      </div>
    </section>
  );
}
