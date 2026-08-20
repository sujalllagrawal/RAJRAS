import { rajrasConfig } from "../config/rajrasConfig";

export default function Footer() {
  return (
    <footer className="bg-rajras-red-deep text-cream/85 pt-16 pb-28 md:pb-14">
      <div className="container-content grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-2xl font-semibold text-cream">
            {rajrasConfig.businessName.toUpperCase()}
          </p>
          <p className="mt-2 text-[14px] text-cream/70">{rajrasConfig.tagline}</p>
          <p className="mt-4 text-[13.5px] text-cream/60 leading-relaxed max-w-[220px]">
            Home-style tiffins, freshly prepared and delivered to your doorstep every day.
          </p>
        </div>

        <div>
          <p className="text-[12px] tracking-widest2 uppercase font-semibold text-cream/50 mb-4">
            Explore
          </p>
          <ul className="space-y-2.5 text-[14px]">
            <li><a href="#home" className="hover:text-cream transition-colors">Home</a></li>
            <li><a href="#menu" className="hover:text-cream transition-colors">Menu</a></li>
            <li><a href="#why" className="hover:text-cream transition-colors">Why Rajras</a></li>
            <li><a href="#faq" className="hover:text-cream transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[12px] tracking-widest2 uppercase font-semibold text-cream/50 mb-4">
            Contact
          </p>
          <ul className="space-y-2.5 text-[14px] text-cream/80">
            <li>{rajrasConfig.phoneNumber}</li>
            <li>{rajrasConfig.deliveryArea}</li>
            <li>{rajrasConfig.deliveryTimings}</li>
          </ul>
        </div>

        <div>
          <p className="text-[12px] tracking-widest2 uppercase font-semibold text-cream/50 mb-4">
            Order
          </p>
          <p className="text-[14px] text-cream/80 leading-relaxed">
            Ordering is simple — no account needed. Tap "Order Now" anywhere on the site.
          </p>
        </div>
      </div>

      <div className="container-content mt-14 pt-6 border-t border-cream/15 text-[12.5px] text-cream/50">
        © 2026 {rajrasConfig.businessName}. All rights reserved.
      </div>
    </footer>
  );
}
