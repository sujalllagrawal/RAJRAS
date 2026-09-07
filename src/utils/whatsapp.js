import { rajrasConfig } from "../config/rajrasConfig";

export function buildOrderMessage({ dayData, selectedFridayOption, selectedAddon, name, phone, address, quantity, instructions, couponCode, discount, total: calculatedTotal }) {
  const priceEach = dayData.price || rajrasConfig.price;
  const itemTotal = priceEach * quantity;
  const total = calculatedTotal !== undefined ? calculatedTotal : (itemTotal + rajrasConfig.deliveryCharge);

  let mealText = "";
  if (dayData.isThepla) {
    mealText = selectedAddon ? `Methi Thepla & Achar (+ ${selectedAddon.name})` : "Methi Thepla & Achar";
  } else if (dayData.isSpecial && selectedFridayOption) {
    mealText = `Friday Special — ${selectedFridayOption}`;
  } else if (dayData.items && dayData.items.length > 0) {
    mealText = `${dayData.day} (${dayData.items.join(" + ")})`;
  } else {
    mealText = `${dayData.day} RAJRASS Tiffin`;
  }

  const lines = [
    `Hello ${rajrasConfig.businessName}! I would like to place an order.`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Address: ${address}`,
    `Item: ${mealText}`,
    `Quantity: ${quantity}`,
    `Base Price: ₹${priceEach} each`,
  ];

  if (selectedAddon) {
    lines.push(`Add-on: ${selectedAddon.name} (+₹${selectedAddon.price} each)`);
  }

  lines.push(`Delivery: FREE`);

  if (couponCode && discount > 0) {
    lines.push(`Coupon Applied: ${couponCode} (-₹${discount})`);
  }

  lines.push(`Total Amount: ₹${total}`);

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
