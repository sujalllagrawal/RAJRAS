import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ValueStrip from "./components/ValueStrip";
import WeeklyMenu from "./components/WeeklyMenu";
import TheplaSection from "./components/TheplaSection";
import MealComponents from "./components/MealComponents";
import Emotional from "./components/Emotional";
import WhyRajras from "./components/WhyRajras";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import DeliveryArea from "./components/DeliveryArea";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import OrderModal from "./components/OrderModal";
import StickyMobileCTA from "./components/StickyMobileCTA";
import AdminOrders from "./components/AdminOrders";
import { useReveal } from "./hooks/useReveal";
import { weeklyMenu, rajrasConfig } from "./config/rajrasConfig";

export default function App() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(weeklyMenu[0]);
  const [isAdminView, setIsAdminView] = useState(false);

  const rootRef = useReveal();

  useEffect(() => {
    const checkRoute = () => {
      const isAdmin =
        window.location.hash === "#admin" ||
        window.location.pathname === "/admin" ||
        window.location.pathname.endsWith("/admin");
      setIsAdminView(isAdmin);
    };

    checkRoute();
    window.addEventListener("popstate", checkRoute);
    window.addEventListener("hashchange", checkRoute);

    return () => {
      window.removeEventListener("popstate", checkRoute);
      window.removeEventListener("hashchange", checkRoute);
    };
  }, []);

  const openOrder = (day = null) => {
    if (day && typeof day === "object" && day.isThepla) {
      setSelectedDay(day);
    } else if (day && !day.isRestDay) {
      setSelectedDay(day);
    } else {
      const todayCode = new Date().getDay();
      const current = weeklyMenu.find((m) => m.dayCode === todayCode);
      if (current && !current.isRestDay) {
        setSelectedDay(current);
      } else {
        setSelectedDay(weeklyMenu[0]);
      }
    }
    setOrderOpen(true);
  };

  const openTheplaOrder = () => {
    openOrder({
      isThepla: true,
      day: "Daily Special",
      title: rajrasConfig.specialThepla.title,
      price: rajrasConfig.specialThepla.price,
      items: rajrasConfig.specialThepla.items,
      timings: rajrasConfig.specialThepla.timings,
    });
  };

  const closeOrder = () => setOrderOpen(false);

  if (isAdminView) {
    return <AdminOrders />;
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-cream flex flex-col font-body selection:bg-rajras-red selection:text-cream">
      <Navbar onOrder={() => openOrder()} />

      <main className="flex-1">
        <Hero onOrder={() => openOrder()} />
        <ValueStrip />
        <WeeklyMenu onOrder={openOrder} />
        <TheplaSection onOrderThepla={openTheplaOrder} />
        <MealComponents />
        <Emotional onOrder={() => openOrder()} />
        <WhyRajras />
        <HowItWorks />
        <Testimonials />
        <DeliveryArea />
        <FAQ />
        <FinalCTA onOrder={() => openOrder()} />
      </main>

      <Footer />

      <StickyMobileCTA onOrder={() => openOrder()} />
      <OrderModal open={orderOpen} onClose={closeOrder} selectedDay={selectedDay} />
    </div>
  );
}

