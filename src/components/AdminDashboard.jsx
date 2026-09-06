import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { weeklyMenu as initialWeeklyMenu, rajrasConfig } from "../config/rajrasConfig";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "coupons" | "menu"

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState("FLAT"); // FLAT | PERCENT
  const [newCouponValue, setNewCouponValue] = useState("");
  const [newCouponMinOrder, setNewCouponMinOrder] = useState("0");
  const [couponMsg, setCouponMsg] = useState("");

  // Menu State
  const [menuList, setMenuList] = useState(() => {
    const saved = localStorage.getItem("rajrass_weekly_menu");
    return saved ? JSON.parse(saved) : initialWeeklyMenu;
  });
  const [editingDayIndex, setEditingDayIndex] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", price: 120, items: "" });
  const [menuMsg, setMenuMsg] = useState("");

  // Load orders from Supabase (or localStorage fallback)
  async function fetchOrders() {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase orders error, loading local fallback:", error.message);
        const local = localStorage.getItem("rajrass_orders");
        setOrders(local ? JSON.parse(local) : []);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      const local = localStorage.getItem("rajrass_orders");
      setOrders(local ? JSON.parse(local) : []);
    } finally {
      setLoadingOrders(false);
    }
  }

  // Update order status in Supabase / Local
  async function updateOrderStatus(orderId, newStatus) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        console.warn("Could not update status on Supabase:", error.message);
      }
    } catch (e) {
      console.warn("Supabase status update failed:", e);
    }
    
    // Update local state UI
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }

  // Load Coupons from Supabase (or localStorage fallback)
  async function fetchCoupons() {
    setLoadingCoupons(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        const local = localStorage.getItem("rajrass_coupons");
        const defaultCoupons = [
          { id: 1, code: "WELCOME10", discount_type: "PERCENT", discount_value: 10, min_order_amount: 120, active: true },
          { id: 2, code: "FLAT20", discount_type: "FLAT", discount_value: 20, min_order_amount: 120, active: true }
        ];
        setCoupons(local ? JSON.parse(local) : defaultCoupons);
      } else {
        setCoupons(data || []);
      }
    } catch (err) {
      const local = localStorage.getItem("rajrass_coupons");
      setCoupons(local ? JSON.parse(local) : []);
    } finally {
      setLoadingCoupons(false);
    }
  }

  // Add Coupon
  async function handleAddCoupon(e) {
    e.preventDefault();
    setCouponMsg("");
    if (!newCouponCode.trim() || !newCouponValue) {
      setCouponMsg("Please enter coupon code and discount value.");
      return;
    }

    const newC = {
      code: newCouponCode.trim().toUpperCase(),
      discount_type: newCouponType,
      discount_value: parseFloat(newCouponValue),
      min_order_amount: parseFloat(newCouponMinOrder || 0),
      active: true,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from("coupons").insert([newC]).select();
      if (!error && data && data.length > 0) {
        setCoupons((prev) => [data[0], ...prev]);
      } else {
        const created = { id: Date.now(), ...newC };
        const updated = [created, ...coupons];
        setCoupons(updated);
        localStorage.setItem("rajrass_coupons", JSON.stringify(updated));
      }
    } catch (err) {
      const created = { id: Date.now(), ...newC };
      const updated = [created, ...coupons];
      setCoupons(updated);
      localStorage.setItem("rajrass_coupons", JSON.stringify(updated));
    }

    setNewCouponCode("");
    setNewCouponValue("");
    setNewCouponMinOrder("0");
    setCouponMsg("Coupon created successfully!");
    setTimeout(() => setCouponMsg(""), 3000);
  }

  // Toggle Coupon Active Status
  async function toggleCoupon(id, currentActive) {
    try {
      await supabase.from("coupons").update({ active: !currentActive }).eq("id", id);
    } catch (e) {
      // ignore
    }
    const updated = coupons.map((c) => (c.id === id ? { ...c, active: !currentActive } : c));
    setCoupons(updated);
    localStorage.setItem("rajrass_coupons", JSON.stringify(updated));
  }

  // Delete Coupon
  async function deleteCoupon(id) {
    try {
      await supabase.from("coupons").delete().eq("id", id);
    } catch (e) {
      // ignore
    }
    const updated = coupons.filter((c) => c.id !== id);
    setCoupons(updated);
    localStorage.setItem("rajrass_coupons", JSON.stringify(updated));
  }

  // Edit Menu Day
  function startEditMenu(index) {
    const item = menuList[index];
    setEditingDayIndex(index);
    setEditForm({
      title: item.title,
      description: item.description,
      price: item.price,
      items: item.items ? item.items.join(", ") : "",
    });
  }

  function saveMenuEdit(index) {
    const updated = [...menuList];
    updated[index] = {
      ...updated[index],
      title: editForm.title,
      description: editForm.description,
      price: Number(editForm.price),
      items: editForm.items ? editForm.items.split(",").map((s) => s.trim()).filter(Boolean) : updated[index].items,
    };
    setMenuList(updated);
    localStorage.setItem("rajrass_weekly_menu", JSON.stringify(updated));
    setEditingDayIndex(null);
    setMenuMsg("Menu updated live on website!");
    setTimeout(() => setMenuMsg(""), 3000);
  }

  useEffect(() => {
    fetchOrders();
    fetchCoupons();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "ALL") return true;
    return (o.status || "Pending").toUpperCase() === statusFilter;
  });

  return (
    <div className="min-h-screen bg-cream font-body selection:bg-rajras-red selection:text-cream">
      {/* Top Navbar */}
      <header className="bg-ink text-cream px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="bg-rajras-red text-cream text-xs font-bold px-2.5 py-1 rounded tracking-wider">ADMIN</span>
          <h1 className="font-display text-xl font-semibold text-cream">RAJRASS Control Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-cream/70 hover:text-white transition-colors">
            🌐 View Main Site
          </a>
          <button
            onClick={onLogout}
            className="bg-cream/10 hover:bg-cream/20 text-cream text-xs font-semibold px-3 py-1.5 rounded transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-cream-line mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-rajras-red text-rajras-red"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            📦 Track Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === "coupons"
                ? "border-rajras-red text-rajras-red"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            🏷️ Manage Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === "menu"
                ? "border-rajras-red text-rajras-red"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            🍱 Change Weekly Menu
          </button>
        </div>

        {/* TAB 1: ORDERS TRACKING */}
        {activeTab === "orders" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">Live Customer Orders</h2>
                <p className="text-xs text-ink-soft mt-0.5">Real-time orders submitted by customers</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-cream-line text-xs font-semibold px-3 py-2 rounded-tiffin focus:outline-none focus:ring-1 focus:ring-rajras-red"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <button
                  onClick={fetchOrders}
                  className="btn-primary !py-1.5 !px-3 text-xs"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {loadingOrders ? (
              <div className="text-center py-16 text-ink-soft font-medium">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-cream-soft border border-cream-line p-8 rounded-tiffin text-center text-ink-soft">
                No orders found for selected filter.
              </div>
            ) : (
              <div className="overflow-x-auto border border-cream-line rounded-tiffin bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-cream-soft text-ink font-display border-b border-cream-line text-xs uppercase tracking-wider">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Meal / Details</th>
                      <th className="p-3.5">Qty</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Address</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-line text-ink-soft">
                    {filteredOrders.map((o) => {
                      const currentStatus = o.status || "Pending";
                      return (
                        <tr key={o.id} className="hover:bg-cream/40 transition-colors">
                          <td className="p-3.5 font-mono font-semibold text-rajras-red">#{o.id}</td>
                          <td className="p-3.5 whitespace-nowrap text-xs">
                            {o.created_at ? new Date(o.created_at).toLocaleString("en-IN") : "Just now"}
                          </td>
                          <td className="p-3.5 font-semibold text-ink">{o.customer_name}</td>
                          <td className="p-3.5 font-mono">
                            <a href={`tel:${o.phone_number}`} className="text-rajras-red hover:underline">
                              {o.phone_number}
                            </a>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-ink block">{o.meal}</span>
                            {o.special_instructions && (
                              <span className="text-xs italic text-ink-faint block">Note: {o.special_instructions}</span>
                            )}
                          </td>
                          <td className="p-3.5 font-semibold text-ink">{o.quantity}</td>
                          <td className="p-3.5 font-display font-semibold text-rajras-red text-base">
                            ₹{o.total_price}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                                currentStatus === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : currentStatus === "Confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : currentStatus === "Preparing"
                                  ? "bg-amber-100 text-amber-800"
                                  : currentStatus === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {currentStatus}
                            </span>
                          </td>
                          <td className="p-3.5 max-w-xs truncate text-xs" title={o.delivery_address}>
                            {o.delivery_address}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={currentStatus}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                              className="bg-cream border border-cream-line text-xs font-medium px-2 py-1 rounded focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COUPONS MANAGEMENT */}
        {activeTab === "coupons" && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Create Coupon Form */}
            <div className="lg:col-span-4 bg-white p-6 rounded-tiffin border border-cream-line shadow-sm h-fit">
              <h3 className="font-display text-xl font-semibold text-ink mb-4">Add New Coupon</h3>
              
              {couponMsg && (
                <div className={`p-3 mb-4 rounded-tiffin text-xs font-semibold ${
                  couponMsg.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {couponMsg}
                </div>
              )}

              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RAJRASS20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-cream/50 border border-cream-line px-3 py-2 rounded text-sm uppercase font-mono font-bold focus:outline-none focus:border-rajras-red"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                      Type
                    </label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full bg-cream/50 border border-cream-line px-3 py-2 rounded text-sm focus:outline-none"
                    >
                      <option value="FLAT">Flat Discount (₹)</option>
                      <option value="PERCENT">Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      placeholder={newCouponType === "FLAT" ? "20" : "15"}
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(e.target.value)}
                      className="w-full bg-cream/50 border border-cream-line px-3 py-2 rounded text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Min Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(e.target.value)}
                    className="w-full bg-cream/50 border border-cream-line px-3 py-2 rounded text-sm focus:outline-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full mt-2">
                  Create Coupon
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-ink">Active & Inactive Coupons</h3>
                <span className="text-xs text-ink-soft font-medium">Applied instantly at checkout</span>
              </div>

              {loadingCoupons ? (
                <div className="text-center py-12 text-ink-soft">Loading coupons...</div>
              ) : coupons.length === 0 ? (
                <div className="bg-cream-soft border border-cream-line p-8 rounded-tiffin text-center text-ink-soft">
                  No coupons created yet. Add one using the form!
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 rounded-tiffin border transition-all flex items-center justify-between bg-white ${
                        c.active ? "border-cream-line" : "border-gray-200 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-rajras-red/10 text-rajras-red flex items-center justify-center font-bold text-lg font-mono">
                          %
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-ink text-base tracking-wider">{c.code}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              c.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                            }`}>
                              {c.active ? "ACTIVE" : "DISABLED"}
                            </span>
                          </div>
                          <p className="text-xs text-ink-soft mt-0.5">
                            {c.discount_type === "FLAT" ? `Flat ₹${c.discount_value} OFF` : `${c.discount_value}% OFF`}
                            {c.min_order_amount > 0 ? ` on orders above ₹${c.min_order_amount}` : " (No minimum order)"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCoupon(c.id, c.active)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                            c.active ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {c.active ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => deleteCoupon(c.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MENU MANAGEMENT */}
        {activeTab === "menu" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">Change Weekly Menu</h2>
                <p className="text-xs text-ink-soft mt-0.5">Edits take effect immediately on the live website</p>
              </div>
              {menuMsg && (
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-4 py-2 rounded-tiffin animate-bounce">
                  {menuMsg}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuList.map((m, index) => {
                const isEditing = editingDayIndex === index;

                return (
                  <div
                    key={m.day}
                    className="bg-white border border-cream-line rounded-tiffin p-6 shadow-sm flex flex-col justify-between"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="font-bold text-rajras-red font-display">{m.day}</span>
                          <span className="text-xs text-ink-soft">Editing</span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-ink uppercase mb-0.5">Title</label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full border border-cream-line p-1.5 text-xs rounded focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-ink uppercase mb-0.5">Price (₹)</label>
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="w-full border border-cream-line p-1.5 text-xs rounded focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-ink uppercase mb-0.5">Items (comma separated)</label>
                          <textarea
                            value={editForm.items}
                            onChange={(e) => setEditForm({ ...editForm, items: e.target.value })}
                            rows={2}
                            className="w-full border border-cream-line p-1.5 text-xs rounded focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-ink uppercase mb-0.5">Description</label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={2}
                            className="w-full border border-cream-line p-1.5 text-xs rounded focus:outline-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => saveMenuEdit(index)}
                            className="btn-primary !py-1.5 text-xs flex-1"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingDayIndex(null)}
                            className="bg-gray-200 text-ink text-xs font-semibold px-3 py-1.5 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-bold text-lg text-ink">{m.day}</span>
                            <span className="font-display font-semibold text-rajras-red text-base">₹{m.price}</span>
                          </div>

                          <h4 className="font-semibold text-sm text-rajras-red mb-2">{m.title}</h4>
                          <p className="text-xs text-ink-soft mb-3">{m.description}</p>

                          {m.items && m.items.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {m.items.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="bg-cream border border-cream-line text-[11px] font-medium px-2 py-0.5 rounded text-ink"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}

                          {m.isSpecial && (
                            <span className="inline-block bg-saffron/10 text-saffron font-bold text-[10px] uppercase px-2 py-0.5 rounded mb-4">
                              Special Custom Options Available
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => startEditMenu(index)}
                          className="w-full mt-4 bg-cream border border-cream-line text-ink hover:border-rajras-red hover:text-rajras-red text-xs font-semibold py-2 rounded-tiffin transition-all"
                        >
                          ✏️ Edit {m.day} Menu
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
