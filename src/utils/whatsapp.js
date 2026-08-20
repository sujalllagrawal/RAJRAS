import { rajrasConfig } from "../config/rajrasConfig";

export function buildOrderMessage({ dayData, selectedFridayOption, name, phone, address, quantity, instructions }) {
  const total = rajrasConfig.price * quantity + rajrasConfig.deliveryCharge;

  let mealText = "";
  if (dayData.isSpecial && selectedFridayOption) {
    mealText = `Friday Special — ${selectedFridayOption}`;
  } else if (dayData.items && dayData.items.length > 0) {
    mealText = `${dayData.day} (${dayData.items.join(" + ")})`;
  } else {
    mealText = `${dayData.day} Rajras Tiffin`;
  }

  const lines = [
    `Hello ${rajrasConfig.businessName}! I would like to order a tiffin.`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Address: ${address}`,
    `Day: ${dayData.day}`,
    `Meal: ${mealText}`,
    `Quantity: ${quantity}`,
    `Price: ₹${rajrasConfig.price} each`,
    `Delivery: FREE`,
    `Total: ₹${total}`,
  ];

  if (instructions && instructions.trim()) {
    lines.push(`Special Instructions: ${instructions.trim()}`);
  }

  lines.push("", "Please confirm my order.");

  return lines.join("\n");
}

export function buildWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${rajrasConfig.whatsappNumber}?text=${encoded}`;
}
