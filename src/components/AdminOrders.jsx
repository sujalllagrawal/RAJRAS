import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      setError("Failed to connect to Supabase");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-cream p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-line">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">RAJRAS Orders Dashboard</h1>
            <p className="text-sm text-ink-soft mt-1">Live customer orders stored in Supabase</p>
          </div>
          <button
            onClick={fetchOrders}
            className="btn-primary !py-2 !px-4 text-sm"
          >
            Refresh Orders
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-ink-soft font-medium">Loading orders from Supabase...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-tiffin text-sm">
            Error loading orders: {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-cream-soft border border-cream-line p-8 rounded-tiffin text-center text-ink-soft">
            No orders submitted yet. Test placing an order on the main page!
          </div>
        ) : (
          <div className="overflow-x-auto border border-cream-line rounded-tiffin bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-cream-soft text-ink font-display border-b border-cream-line">
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Meal / Special Option</th>
                  <th className="p-3.5">Qty</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Address</th>
                  <th className="p-3.5">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-line text-ink-soft">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/40 transition-colors">
                    <td className="p-3.5 font-mono font-semibold text-rajras-red">#{o.id}</td>
                    <td className="p-3.5 whitespace-nowrap text-xs">
                      {new Date(o.created_at).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 font-semibold text-ink">{o.customer_name}</td>
                    <td className="p-3.5 font-mono">
                      <a href={`tel:${o.phone_number}`} className="text-rajras-red hover:underline">
                        {o.phone_number}
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-ink">{o.meal}</span>
                      {o.friday_option && (
                        <span className="block text-xs text-saffron font-semibold">
                          Option: {o.friday_option}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-ink">{o.quantity}</td>
                    <td className="p-3.5 font-display font-semibold text-rajras-red text-base">
                      ₹{o.total_price}
                    </td>
                    <td className="p-3.5 max-w-xs truncate" title={o.delivery_address}>
                      {o.delivery_address}
                    </td>
                    <td className="p-3.5 italic text-xs text-ink-faint">
                      {o.special_instructions || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/" className="text-sm font-semibold text-rajras-red hover:underline">
            ← Back to RAJRAS Website
          </a>
        </div>
      </div>
    </div>
  );
}
