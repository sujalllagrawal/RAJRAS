// ─────────────────────────────────────────────────────────
// RAJRAS — BUSINESS CONFIGURATION & EXACT MENU SPECIFICATION
// Single source of truth for business details and menus.
// ─────────────────────────────────────────────────────────

export const rajrasConfig = {
  businessName: "RAJRAS",
  tagline: "Ghar Jaisa Khana. Har Roz.",
  subTagline: "A proper ghar-style meal, delivered to your doorstep.",
  headline: "Ghar Jaisa Khana. Sirf ₹120.",
  supportingText:
    "Fresh, delicious and comforting Indian meals, prepared with the feeling of home and delivered straight to your doorstep.",

  // Digits only, with country code, no + or spaces. Example: 916350054008
  whatsappNumber: "916350054008",

  // Shown in footer/contact
  phoneNumber: "+91 63500 54008",

  price: 120,
  deliveryCharge: 0,

  deliveryArea: "Civil Lines, Malviya Nagar & Raja Park, Jaipur",
  deliveryTimings: "Lunch: 12:00 PM – 2:30 PM | Dinner: 7:30 PM – 9:30 PM",

  instagramUrl: "https://instagram.com",
};

// ─────────────────────────────────────────────────────────
// EXACT WEEKLY MENU (Monday – Sunday)
// ─────────────────────────────────────────────────────────
export const weeklyMenu = [
  {
    day: "Monday",
    dayCode: 1,
    title: "Monday Special",
    items: ["Chole", "Moong Dal", "Rice", "5 Roti", "Pickle"],
    price: 120,
    image: "/images/monday_chole.png",
    description: "Rich spiced Chole paired with light yellow Moong Dal and fresh rotis.",
  },
  {
    day: "Tuesday",
    dayCode: 2,
    title: "Tuesday Special",
    items: ["Rajma", "Aloo", "Rice", "5 Roti", "Pickle"],
    price: 120,
    image: "/images/hero_thali.png",
    description: "Classic comforting Rajma masala with spiced Aloo sabzi and rice.",
  },
  {
    day: "Wednesday",
    dayCode: 3,
    title: "Wednesday Special",
    items: ["Gatta", "Dal", "Rice", "5 Roti"],
    price: 120,
    image: "/images/hero_thali.png",
    description: "Authentic Rajasthani Gatta curry served with warm home-style dal.",
  },
  {
    day: "Thursday",
    dayCode: 4,
    title: "Thursday Special",
    items: ["Dal Makhani", "Matar Paneer", "Rice", "5 Roti"],
    price: 120,
    image: "/images/hero_thali.png",
    description: "Slow-cooked velvety Dal Makhani accompanied by fresh Matar Paneer.",
  },
  {
    day: "Friday",
    dayCode: 5,
    isSpecial: true,
    title: "FRIDAY SPECIAL",
    price: 120,
    image: "/images/friday_dal_baati.png",
    description: "A festive Friday feast. Choose your preferred combination.",
    options: [
      { id: "db_churma", label: "Dal Baati + Churma", detail: "4 Baati + Churma" },
      { id: "db_kheer", label: "Dal Baati + Kheer", detail: "4 Baati + Kheer" },
      { id: "puri_halwa", label: "Puri Sabzi + Halwa", detail: "Puri Sabzi + Halwa" },
      { id: "chole_halwa", label: "Chole Puri + Halwa", detail: "Chole Puri + Halwa" },
    ],
  },
  {
    day: "Saturday",
    dayCode: 6,
    title: "Saturday Special",
    items: ["Seasonal Sabzi", "Kadhi Chawal", "5 Chapati"],
    price: 120,
    image: "/images/hero_thali.png",
    description: "Tangy Indian Kadhi Chawal with fresh seasonal sabzi and chapati.",
  },
  {
    day: "Sunday",
    dayCode: 0,
    title: "Sunday Special",
    items: ["Bhindi", "Dal Makhani", "5 Roti", "Rice"],
    price: 120,
    image: "/images/hero_thali.png",
    description: "Crispy spiced Bhindi stir-fry with slow-cooked Dal Makhani, 5 soft rotis & steamed rice.",
  },
];

// Value Strip
export const valueItems = [
  { value: `₹${rajrasConfig.price}`, label: "Every Meal" },
  { value: "FREE", label: "Doorstep Delivery" },
  { value: "FRESH", label: "Prepared Daily" },
  { value: "GHAR JAISA", label: "Taste & Comfort" },
];

// Meal Highlights Component section
export const mealComponents = [
  {
    id: "dal",
    name: "Dal & Curry",
    description: "Slow-cooked slow-simmered home-style dal with pure ghee tadka.",
  },
  {
    id: "sabzi",
    name: "Fresh Sabzi",
    description: "Handpicked seasonal vegetables prepared fresh daily without heavy oils.",
  },
  {
    id: "roti",
    name: "Soft Roti",
    description: "5 fresh whole wheat rotis baked hot and wrapped immediately.",
  },
  {
    id: "rice",
    name: "Steamed Rice",
    description: "Fluffy, long-grain basmati rice portioned for a complete meal.",
  },
  {
    id: "pickle",
    name: "Salad & Pickle",
    description: "Homemade traditional achaar and crisp salad for genuine ghar taste.",
  },
];

// Why Rajras
export const whyRajras = [
  {
    title: "Ghar Jaisa Taste",
    description: "Simple, comforting food that feels familiar and easy on the stomach.",
  },
  {
    title: "₹120 Every Meal",
    description: "A complete home-style meal without the restaurant price tag.",
  },
  {
    title: "Freshly Prepared",
    description: "Meals prepared fresh for the day in a clean, home kitchen environment.",
  },
  {
    title: "Free Doorstep Delivery",
    description: "No additional delivery charge within our active service area.",
  },
  {
    title: "Easy Ordering",
    description: "No account. No signup. No password. Just order directly on WhatsApp.",
  },
];

// How it works
export const howItWorks = [
  {
    step: "01",
    title: "Pick Your Meal",
    description: "See what's cooking today or pick any day from our weekly menu.",
  },
  {
    step: "02",
    title: "Place Your Order",
    description: "Enter your name and delivery address in under 15 seconds.",
  },
  {
    step: "03",
    title: "Enjoy",
    description: "Your hot Rajras meal reaches your doorstep with free delivery.",
  },
];

// Authentic Customer Reviews
export const testimonials = [
  {
    quote:
      "The food is simple but exactly what I wanted. Feels much more like ghar ka khana than regular mess food.",
    name: "Ankit Sharma",
    role: "Software Developer, Staying in PG",
  },
  {
    quote:
      "₹120 with free delivery is really convenient for daily meals. The rotis are soft and dal tastes authentic.",
    name: "Pooja Verma",
    role: "Working Professional",
  },
  {
    quote:
      "The dal and roti are my favourite. Perfect for someone staying away from home in Jaipur.",
    name: "Rohan Pareek",
    role: "Student",
  },
];

// FAQs
export const faqs = [
  {
    q: "What is included in the ₹120 tiffin?",
    a: "The menu varies by day. For example, Monday includes Chole, Moong Dal, Rice, 5 Roti, and Pickle, while Sunday features Bhindi, Dal Makhani, 5 Roti, and Rice. Check our weekly menu above for each day's exact menu.",
  },
  {
    q: "Is delivery really free?",
    a: `Yes, delivery is completely free within our service area (${rajrasConfig.deliveryArea}).`,
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can order directly through WhatsApp without any signup or password.",
  },
  {
    q: "Can I order multiple meals?",
    a: "Yes. You can select your quantity (e.g. 2, 3, 4 meals) during the quick checkout process.",
  },
  {
    q: "Can I select a Friday option?",
    a: "Yes! Friday has 4 delicious options (Dal Baati + Churma, Dal Baati + Kheer, Puri Sabzi + Halwa, or Chole Puri + Halwa). You choose your preference when ordering Friday's meal.",
  },
  {
    q: "Can I add special instructions?",
    a: "Yes. You can add notes like 'Less spicy', 'No onion', or 'Call when arriving' in the order modal.",
  },
  {
    q: "What areas do you deliver to?",
    a: `We currently serve: ${rajrasConfig.deliveryArea}.`,
  },
  {
    q: "What are the delivery timings?",
    a: `Our delivery windows are ${rajrasConfig.deliveryTimings}.`,
  },
];
