import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://folmshmlzrruurqcyqre.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbG1zaG1senJydXVycWN5cXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNDA3MDMsImV4cCI6MjEwMjgxNjcwM30.5BDhM_-MjNEByzeEk229-p-XxnIUA3aYKy7PhPEUh-M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Saves an order to Supabase `orders` table.
 * Fallback-safe so user journey to WhatsApp is never blocked even if table/network fails.
 */
export async function saveOrderToSupabase(orderData) {
  const newOrderObj = {
    id: orderData.id || Date.now(),
    customer_name: orderData.name,
    phone_number: orderData.phone,
    delivery_address: orderData.address,
    day: orderData.day,
    meal: orderData.meal,
    friday_option: orderData.fridayOption || null,
    quantity: orderData.quantity,
    unit_price: orderData.unitPrice || 120,
    total_price: orderData.total,
    special_instructions: orderData.instructions || null,
    coupon_applied: orderData.couponCode || null,
    status: "Pending",
    created_at: new Date().toISOString(),
  };

  // Always append to localStorage for instant local tracking
  try {
    const existing = localStorage.getItem("rajrass_orders");
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newOrderObj);
    localStorage.setItem("rajrass_orders", JSON.stringify(list));
  } catch (e) {
    console.warn("localStorage order save failed:", e);
  }

  try {
    const { data, error } = await supabase.from("orders").insert([newOrderObj]);

    if (error) {
      console.warn("Supabase order insert notice:", error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn("Supabase connection notice:", err);
    return { success: false, error: err };
  }
}
