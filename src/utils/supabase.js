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
  try {
    const { data, error } = await supabase.from("orders").insert([
      {
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
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn("Supabase order insert notice (orders table may need SQL setup):", error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn("Supabase connection notice:", err);
    return { success: false, error: err };
  }
}
