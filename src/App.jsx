import { useState, useEffect } from "react";

const SUPABASE_URL = "https://vqhhwukvheezunccehzm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aMDffSz8hpfjHjsD7_jq3g_ux_IKJKV";

// ── Combo definitions ─────────────────────────────────────────────────────────
const COMBO_TIERS = [
  { id: "3x3", label: "3 Entrées + 3 Sides", entrees: 3, sides: 3, discount: 0.05, badge: "5% OFF", color: "#F4A261" },
  { id: "4x4", label: "4 Entrées + 4 Sides", entrees: 4, sides: 4, discount: 0.06, badge: "6% OFF", color: "#52B788" },
  { id: "5x5", label: "5 Entrées + 5 Sides", entrees: 5, sides: 5, discount: 0.07, badge: "7% OFF", color: "#CDB4DB" },
];

const PLACEHOLDERS = {
  "Herb-Crusted Salmon Bowl": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
  "Mediterranean Chicken":   "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/IMG-20260501-WA0021.jpg",
  "Teriyaki Salmon":         "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Turkey Meatballs":                    "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_125551213.png",
  "Not Your Mama\u2019s Turkey Meatballs": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_125551213.png",
  "Not Your Mama's Turkey Meatballs":    "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_125551213.png",
  "Deluxe Burgers":          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Shrimp Stir Fry":         "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/IMG-20260501-WA0022.jpg",
  "Chicken Tikka Masala":    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Beef & Broccoli":         "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/IMG-20260501-WA0018.jpg",
  "Seafood Boil Experience": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/IMG-20260501-WA0019.jpg",
  "Mediterranean Mezze":     "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/IMG-20260501-WA0020.jpg",
  "Southern Comfort Spread": "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
  "Asian Fusion Banquet":    "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
  "Holiday Feast Package":   "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/IMG-20260501-WA0017.jpg",
  "Vegan Lentil Curry":      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
  "Silken Tofu Simple Stir Fry": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_114235232.png",
  "BBQ Feast Package":       "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  "Elegant Brunch Spread":   "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80",
  "Taco & Tequila Bar":      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Date Night for Two":      "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/1000070275%20(1).jpg",
  "Dinner Party Experience": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
  "Garlic Roasted Potatoes": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_102739586.png",
  "Steamed Jasmine Rice":    "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80",
  "Sautéed Garlic Broccolini": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_102909005.png",
  "Mac & Cheese":            "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_102344979.png",
  "Roasted Sweet Potatoes":  "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/Photoroom-20260502_103112725.png",
  "Garden Side Salad":       "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Almond Lavender Cookies - 6 Pack":  "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 12 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 18 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 24 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 30 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 36 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 42 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 48 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 54 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
  "Almond Lavender Cookies - 60 Pack": "https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg",
};
const FALLBACK = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80";

const tagColors = {
  "GF": "#52B788", "Vegan": "#52B788", "High Protein": "#E76F51",
  "Popular": "#E9C46A", "Crowd Fave": "#E9C46A", "Romantic": "#CDB4DB",
  "Custom Menu": "#BDE0FE", "Premium": "#BDE0FE",
  "Vegetarian Option": "#52B788", "GF Option": "#52B788",
};

const CATEGORIES = ["All", "Meal Prep", "Catering", "Private Dinners", "🍪 Cookies", "🍱 Combos", "🏢 Workplace Lunch", "🍔 Build a Burger"];

function getImage(item) { return item.image_url || PLACEHOLDERS[item.name] || FALLBACK; }

const inputStyle = {
  width: "100%", padding: "11px 14px", border: "1.5px solid #D4C9B8",
  borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
  color: "#1A1208", background: "#FEFAF4", outline: "none", transition: "border-color 0.2s",
};
const labelStyle = {
  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
  letterSpacing: "0.06em", textTransform: "uppercase", color: "#B5A48C",
  marginBottom: "6px", display: "block",
};
function Field({ label, children }) {
  return <div style={{ marginBottom: "18px" }}><label style={labelStyle}>{label}</label>{children}</div>;
}

// ── Combo Builder ─────────────────────────────────────────────────────────────
function ComboBuilder({ menuItems, onAddCombo }) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedEntrees, setSelectedEntrees] = useState([]);
  const [selectedSides, setSelectedSides]     = useState([]);
  const [added, setAdded] = useState(false);

  const entrees = menuItems.filter((i) => i.category === "Meal Prep");
  const sides   = menuItems.filter((i) => i.category === "Sides");

  const tier = COMBO_TIERS.find((t) => t.id === selectedTier);

  const toggleItem = (item, list, setList, max) => {
    const exists = list.find((i) => i.id === item.id);
    if (exists) { setList(list.filter((i) => i.id !== item.id)); return; }
    if (list.length >= max) return;
    setList([...list, item]);
  };

  const rawTotal = [
    ...selectedEntrees.map((i) => Number(i.price)),
    ...selectedSides.map((i) => Number(i.price)),
  ].reduce((s, p) => s + p, 0);

  const discountedTotal = tier ? rawTotal * (1 - tier.discount) : rawTotal;
  const savings = rawTotal - discountedTotal;

  const isComplete = tier &&
    selectedEntrees.length === tier.entrees &&
    selectedSides.length === tier.sides;

  const handleAdd = () => {
    if (!isComplete) return;
    onAddCombo({
      id: `combo-${Date.now()}`,
      type: "combo",
      label: tier.label,
      entrees: selectedEntrees,
      sides: selectedSides,
      rawTotal,
      discountedTotal,
      savings,
      discount: tier.discount,
      badge: tier.badge,
    });
    setSelectedTier(null);
    setSelectedEntrees([]);
    setSelectedSides([]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const SelectableCard = ({ item, selected, onToggle, disabled }) => (
    <div onClick={() => !disabled && onToggle(item)}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "12px", borderRadius: "12px", cursor: disabled && !selected ? "not-allowed" : "pointer",
        border: `2px solid ${selected ? "#1A1208" : "#EEE8DF"}`,
        background: selected ? "#1A120808" : "#fff",
        opacity: disabled && !selected ? 0.45 : 1,
        transition: "all 0.2s",
      }}>
      <img src={getImage(item)} alt={item.name} onError={(e) => { e.target.src = FALLBACK; }}
        style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, lineHeight: 1.2 }}>{item.name}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C" }}>${item.price} / serving</div>
      </div>
      <div style={{
        width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${selected ? "#1A1208" : "#D4C9B8"}`,
        background: selected ? "#1A1208" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "12px",
      }}>{selected ? "✓" : ""}</div>
    </div>
  );

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #1A1208 0%, #3D2B1A 100%)", borderRadius: "20px", padding: "36px 40px", marginBottom: "36px", color: "#FEFAF4", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6, marginBottom: "8px" }}>Save more, eat better</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 300, lineHeight: 1.1, marginBottom: "10px" }}>Build your <em>perfect combo</em></div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", opacity: 0.75, lineHeight: 1.6 }}>Pick a combo size, choose your entrées and sides, and save up to 7% automatically.</div>
        </div>
        <div style={{ fontSize: "64px" }}>🍱</div>
      </div>

      {/* Step 1 — Choose Tier */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, marginBottom: "4px" }}>Step 1 — Choose your combo size</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", marginBottom: "20px" }}>Bigger combos save more!</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {COMBO_TIERS.map((t) => (
            <div key={t.id} onClick={() => { setSelectedTier(t.id); setSelectedEntrees([]); setSelectedSides([]); }}
              style={{
                borderRadius: "16px", padding: "20px", cursor: "pointer",
                border: `2px solid ${selectedTier === t.id ? "#1A1208" : "#EEE8DF"}`,
                background: selectedTier === t.id ? "#1A120808" : "#fff",
                transition: "all 0.2s", position: "relative", overflow: "hidden",
              }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", background: t.color, color: "#fff", borderRadius: "100px", padding: "2px 10px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700 }}>{t.badge}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, marginBottom: "4px", marginTop: "8px" }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps 2 & 3 — only show after tier selected */}
      {tier && (
        <>
          {/* Step 2 — Choose Entrées */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600 }}>Step 2 — Choose {tier.entrees} entrée{tier.entrees > 1 ? "s" : ""}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: selectedEntrees.length === tier.entrees ? "#52B788" : "#B5A48C", fontWeight: 500 }}>
                {selectedEntrees.length} / {tier.entrees} selected
              </div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", marginBottom: "16px" }}>Pick from Heather's meal prep menu</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {entrees.length === 0
                ? <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#B5A48C", fontSize: "14px" }}>No entrées available right now.</div>
                : entrees.map((item) => (
                  <SelectableCard key={item.id} item={item}
                    selected={!!selectedEntrees.find((i) => i.id === item.id)}
                    onToggle={(i) => toggleItem(i, selectedEntrees, setSelectedEntrees, tier.entrees)}
                    disabled={selectedEntrees.length >= tier.entrees && !selectedEntrees.find((i) => i.id === item.id)} />
                ))}
            </div>
          </div>

          {/* Step 3 — Choose Sides */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600 }}>Step 3 — Choose {tier.sides} side{tier.sides > 1 ? "s" : ""}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: selectedSides.length === tier.sides ? "#52B788" : "#B5A48C", fontWeight: 500 }}>
                {selectedSides.length} / {tier.sides} selected
              </div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", marginBottom: "16px" }}>Complete your combo with sides</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sides.length === 0
                ? <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#B5A48C", fontSize: "14px" }}>No sides available right now.</div>
                : sides.map((item) => (
                  <SelectableCard key={item.id} item={item}
                    selected={!!selectedSides.find((i) => i.id === item.id)}
                    onToggle={(i) => toggleItem(i, selectedSides, setSelectedSides, tier.sides)}
                    disabled={selectedSides.length >= tier.sides && !selectedSides.find((i) => i.id === item.id)} />
                ))}
            </div>
          </div>

          {/* Summary + Add to Order */}
          <div style={{ background: isComplete ? "#1A1208" : "#F5F0E8", borderRadius: "16px", padding: "24px", marginBottom: "12px", transition: "background 0.3s" }}>
            {isComplete ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#FEFAF4" }}>{tier.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C", marginTop: "2px" }}>
                      {tier.entrees} entrées + {tier.sides} sides
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C", textDecoration: "line-through" }}>${rawTotal.toFixed(2)}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#FEFAF4" }}>${discountedTotal.toFixed(2)}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#52B788", fontWeight: 600 }}>You save ${savings.toFixed(2)}!</div>
                  </div>
                </div>
                <button onClick={handleAdd} style={{ width: "100%", background: "#E76F51", color: "#fff", border: "none", borderRadius: "10px", padding: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.03em", transition: "background 0.2s" }}>
                  {added ? "✓ Added to Order!" : "Add Combo to Order →"}
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", padding: "8px 0" }}>
                {selectedEntrees.length < tier.entrees
                  ? `Choose ${tier.entrees - selectedEntrees.length} more entrée${tier.entrees - selectedEntrees.length !== 1 ? "s" : ""} to continue`
                  : `Choose ${tier.sides - selectedSides.length} more side${tier.sides - selectedSides.length !== 1 ? "s" : ""} to complete your combo`}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Order Form ────────────────────────────────────────────────────────────────
function OrderForm({ cartItems, comboItems, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    event_date: "", event_time: "",
    guest_count: "", entree_count: "", appetizer_count: "", side_count: "",
    gluten_free: false, organic: false,
    dietary_notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim()) e.customer_name = "Name is required";
    if (!form.customer_email.trim()) e.customer_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.customer_email)) e.customer_email = "Enter a valid email";
    if (!form.event_date) e.event_date = "Please choose a date";
    if (!form.guest_count || Number(form.guest_count) < 1) e.guest_count = "Enter number of guests";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const regularItems = cartItems.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }));
      const combosSummary = comboItems.map((c) => ({
        type: "combo", label: c.label, badge: c.badge,
        entrees: c.entrees.map((i) => i.name),
        sides: c.sides.map((i) => i.name),
        rawTotal: c.rawTotal, discountedTotal: c.discountedTotal, savings: c.savings,
      }));
      const payload = {
        customer_name: form.customer_name.trim(), customer_email: form.customer_email.trim(),
        customer_phone: form.customer_phone.trim() || null, event_date: form.event_date,
        event_time: form.event_time || null, guest_count: Number(form.guest_count) || null,
        entree_count: Number(form.entree_count) || null, appetizer_count: Number(form.appetizer_count) || null,
        side_count: Number(form.side_count) || null, dietary_notes: form.dietary_notes.trim() || null,
        items: [...regularItems, ...combosSummary],
        status: "new",
      };
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      onSuccess(form.customer_name);
    } catch { setErrors({ submit: "Something went wrong. Please try again or contact us directly." }); }
    finally { setSubmitting(false); }
  };

  const err = (k) => errors[k] ? <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#E76F51", marginTop: "4px" }}>{errors[k]}</div> : null;

  const allItems = [
    ...cartItems.map((i) => ({ key: i.id, thumb: getImage(i), name: i.name, sub: `$${i.price} × ${i.qty}` })),
    ...comboItems.map((c) => ({ key: c.id, thumb: null, name: c.label, sub: `${c.entrees.map(i=>i.name).join(", ")} + ${c.sides.map(i=>i.name).join(", ")} — $${c.discountedTotal.toFixed(2)} (${c.badge})` })),
  ];

  return (
    <div style={{ padding: "32px 24px", background: "#fff" }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, marginBottom: "6px" }}>Request a Quote</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", lineHeight: 1.6 }}>Fill in your details and Heather will be in touch to confirm pricing.</div>
      </div>

      {allItems.length > 0 && (
        <div style={{ background: "#FEFAF4", borderRadius: "12px", border: "1px solid #EEE8DF", padding: "16px", marginBottom: "24px" }}>
          <div style={{ ...labelStyle, marginBottom: "12px" }}>Your Order</div>
          {allItems.map((item) => (
            <div key={item.key} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
              {item.thumb
                ? <img src={item.thumb} alt={item.name} onError={(e) => { e.target.src = FALLBACK; }} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                : <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#1A1208", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🍱</div>
              }
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B5A48C", lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid #EEE8DF" }}>Contact Information</div>
      <Field label="Full Name *"><input style={inputStyle} placeholder="Jane Smith" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} />{err("customer_name")}</Field>
      <Field label="Email Address *"><input style={inputStyle} type="email" placeholder="jane@email.com" value={form.customer_email} onChange={(e) => set("customer_email", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} />{err("customer_email")}</Field>
      <Field label="Phone Number"><input style={inputStyle} type="tel" placeholder="(555) 123-4567" value={form.customer_phone} onChange={(e) => set("customer_phone", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>

      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, margin: "24px 0 16px", paddingBottom: "8px", borderBottom: "1px solid #EEE8DF" }}>Order Details</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Field label="Preferred Date *"><input style={inputStyle} type="date" value={form.event_date} min={new Date().toISOString().split("T")[0]} onChange={(e) => set("event_date", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} />{err("event_date")}</Field>
        <Field label="Preferred Time"><input style={inputStyle} type="time" value={form.event_time} onChange={(e) => set("event_time", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>
      </div>
      <Field label="Number of Guests *"><input style={inputStyle} type="number" min="1" placeholder="e.g. 25" value={form.guest_count} onChange={(e) => set("guest_count", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} />{err("guest_count")}</Field>



      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, margin: "24px 0 16px", paddingBottom: "8px", borderBottom: "1px solid #EEE8DF" }}>Dietary Notes & Allergies</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, margin: "24px 0 16px", paddingBottom: "8px", borderBottom: "1px solid #EEE8DF" }}>Dietary Preferences</div>
      <div style={{ background: "#FEFAF0", borderRadius: "12px", padding: "16px", marginBottom: "16px", border: "1px solid #EEE8DF" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.gluten_free || false} onChange={(e) => set("gluten_free", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#1A1208", cursor: "pointer" }} />
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1208" }}>🌾 Gluten-Free</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C" }}>May increase price depending on ingredients required</div>
            </div>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <input type="checkbox" checked={form.organic || false} onChange={(e) => set("organic", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#1A1208", cursor: "pointer" }} />
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1208" }}>🌿 Organic Ingredients</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C" }}>Organic sourcing may increase the final price</div>
            </div>
          </label>
        </div>
      </div>
      <Field label="Any allergies or dietary restrictions?"><textarea style={{ ...inputStyle, height: "100px", resize: "vertical" }} placeholder="e.g. 3 guests are gluten-free, 1 is allergic to shellfish…" value={form.dietary_notes} onChange={(e) => set("dietary_notes", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>

      {errors.submit && <div style={{ background: "#FEF0ED", border: "1px solid #E76F51", borderRadius: "10px", padding: "12px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#E76F51", marginBottom: "16px" }}>{errors.submit}</div>}

      {/* Pricing Transparency Notice */}
      <div style={{ background: "#FEFAF0", borderRadius: "12px", padding: "16px", marginTop: "16px", marginBottom: "8px", border: "1px solid #EEE8DF" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B5A48C", marginBottom: "8px" }}>💡 Pricing Info</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B5E4E", lineHeight: 1.7, margin: "0 0 8px 0" }}>
          Prices shown cover all food and ingredients. <strong>In-home services</strong> (Private Dinners, Catering & Dinner Parties) include a chef service fee of <strong>$45/hr</strong> (3-hr minimum) in your final quote. Meal prep has no service fee. Substitutions & custom requests may affect the final price.
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B5E4E", lineHeight: 1.7, margin: 0 }}>
          🚗 <strong>Delivery:</strong> Within 10 miles $10 · 10–35 miles $18 · <strong>Free on meal prep orders over $150!</strong>
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "14px", border: "1.5px solid #D4C9B8", borderRadius: "12px", background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, color: "#6B5E4E", cursor: "pointer" }}>← Back</button>
        <button onClick={submit} disabled={submitting} style={{ flex: 2, padding: "14px", border: "none", borderRadius: "12px", background: submitting ? "#B5A48C" : "#1A1208", color: "#FEFAF4", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", letterSpacing: "0.03em", transition: "background 0.2s" }}>
          {submitting ? "Sending…" : "Submit Order Request ✓"}
        </button>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B5A48C", textAlign: "center", marginTop: "14px", lineHeight: 1.6 }}>No payment required now. Heather will contact you to confirm details.</div>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ name, onReset }) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎉</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, marginBottom: "12px" }}>Thank you, {name}!</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6B5E4E", lineHeight: 1.7, marginBottom: "32px" }}>
        Your order request has been sent to Heather.<br />She'll be in touch soon to confirm all the details.<br /><br />
        <em style={{ color: "#B5A48C" }}>Food is Life. Life is Good.™ 🍽️</em>
      </div>
      <button onClick={onReset} style={{ background: "#1A1208", color: "#FEFAF4", border: "none", borderRadius: "12px", padding: "14px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Back to Menu</button>
    </div>
  );
}

// ── Privacy Policy Modal ──────────────────────────────────────────────────────
function PrivacyPolicy({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,18,8,0.6)", zIndex: 200, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ background: "#FEFAF4", borderRadius: "20px", maxWidth: "720px", width: "100%", padding: "48px 40px", position: "relative", boxShadow: "0 24px 80px rgba(26,18,8,0.2)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#6B5E4E" }}>✕</button>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B5A48C", marginBottom: "12px" }}>Legal</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 600, color: "#1A1208", marginBottom: "8px" }}>Privacy Policy</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C", marginBottom: "32px" }}>Effective Date: May 1, 2025 · Last Updated: May 1, 2025</p>
        {[
          { title: "1. Who We Are", body: 'Flavor Fuzion by Heather Janey ("we," "us," or "our") is a sole proprietorship operating in Massachusetts, transitioning to an LLC. We operate the Flavor Fuzion ordering platform at flavorfuzion.com.' },
          { title: "2. Information We Collect", body: "We collect information you provide directly when placing an order or inquiry, including: your name, email address, phone number, event date, guest count, dietary notes, and order details. We do not collect payment information directly — all payment processing is handled by secure third-party processors." },
          { title: "3. How We Use Your Information", body: "We use the information you provide to: respond to your order requests, communicate with you about your event, improve our services, and comply with legal obligations. We do not sell, rent, or share your personal information with third parties for marketing purposes." },
          { title: "4. Data Storage", body: "Your order information is stored securely using Supabase, a third-party database service. Data is stored on servers located in the United States. We retain your information only as long as necessary to fulfill your order and comply with applicable law." },
          { title: "5. Cookies", body: "Our website may use cookies or similar technologies to improve your browsing experience. You can disable cookies in your browser settings, though some features of the site may not function properly as a result." },
          { title: "6. Your Rights (Massachusetts Residents)", body: "Under Massachusetts law, you have the right to request access to, correction of, or deletion of your personal information. To exercise these rights, please contact us at the email below." },
          { title: "7. Children's Privacy", body: "Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children." },
          { title: "8. Changes to This Policy", body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the effective date at the top of this page." },
          { title: "9. Contact Us", body: "If you have questions about this Privacy Policy, please contact us at: FlavorFuzionbHJ@Outlook.com | 131 Samoset Street #1027, Plymouth, MA 02360" },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#1A1208", marginBottom: "8px" }}>{title}</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6B5E4E", lineHeight: 1.75 }}>{body}</p>
          </div>
        ))}
        <button onClick={onClose} style={{ background: "#1A1208", color: "#FEFAF4", border: "none", borderRadius: "100px", padding: "12px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer", marginTop: "8px" }}>Close</button>
      </div>
    </div>
  );
}

// ── Terms of Service Modal ────────────────────────────────────────────────────
function TermsOfService({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,18,8,0.6)", zIndex: 200, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ background: "#FEFAF4", borderRadius: "20px", maxWidth: "720px", width: "100%", padding: "48px 40px", position: "relative", boxShadow: "0 24px 80px rgba(26,18,8,0.2)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#6B5E4E" }}>✕</button>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B5A48C", marginBottom: "12px" }}>Legal</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 600, color: "#1A1208", marginBottom: "8px" }}>Terms of Service</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C", marginBottom: "32px" }}>Effective Date: May 1, 2025 · Last Updated: May 1, 2025</p>
        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using the Flavor Fuzion ordering platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
          { title: "2. Services Provided", body: "Flavor Fuzion by Heather Janey provides personal chef services including weekly meal preparation, catering, private dinners, and baked goods. All orders are subject to availability and confirmation by Heather Janey." },
          { title: "3. Order Requests & Confirmation", body: "Submitting an order through our platform constitutes a request only — not a confirmed booking. Orders become confirmed only after Heather Janey contacts you to review details, confirm pricing, and arrange payment. No payment is collected at the time of submission." },
          { title: "4. Pricing", body: "Prices shown on the menu cover food and ingredient costs. Private dinners, catering, and in-home services include a chef service fee of $45/hr (3-hour minimum), which will be included in your confirmed quote. Delivery fees apply based on distance. Custom requests and substitutions may affect the final price." },
          { title: "5. Cancellations & Deposits", body: "Cancellation and deposit policies will be communicated during booking confirmation. For large events or catering bookings, a deposit may be required to secure your date. Deposits are generally non-refundable within 48 hours of the event." },
          { title: "6. Dietary & Allergen Responsibility", body: "While we make every effort to accommodate dietary needs and allergies disclosed at the time of ordering, Flavor Fuzion cannot guarantee a completely allergen-free environment. Customers must disclose all known allergies and dietary restrictions at the time of ordering. Flavor Fuzion is not liable for reactions resulting from undisclosed allergens." },
          { title: "7. Intellectual Property", body: 'The phrase "Food is Life. Life is Good.™" is a trademark of Flavor Fuzion by Heather Janey. All content on this platform, including menus, images, and branding, is the property of Flavor Fuzion by Heather Janey and may not be used without written permission.' },
          { title: "8. Limitation of Liability", body: "To the fullest extent permitted by Massachusetts law, Flavor Fuzion by Heather Janey shall not be liable for any indirect, incidental, or consequential damages arising from use of our services." },
          { title: "9. Governing Law", body: "These Terms of Service are governed by the laws of the Commonwealth of Massachusetts. Any disputes shall be resolved in the courts of Massachusetts." },
          { title: "10. Changes to These Terms", body: "We reserve the right to update these Terms at any time. Continued use of our platform after changes constitutes acceptance of the updated Terms." },
          { title: "11. Contact Us", body: "If you have questions about these Terms, please contact us at: FlavorFuzionbHJ@Outlook.com | 131 Samoset Street #1027, Plymouth, MA 02360" },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#1A1208", marginBottom: "8px" }}>{title}</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6B5E4E", lineHeight: 1.75 }}>{body}</p>
          </div>
        ))}
        <button onClick={onClose} style={{ background: "#1A1208", color: "#FEFAF4", border: "none", borderRadius: "100px", padding: "12px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer", marginTop: "8px" }}>Close</button>
      </div>
    </div>
  );
}

// ── Burger Builder ────────────────────────────────────────────────────────────
const BURGER_OPTIONS = {
  proteins: ["Chicken", "Turkey", "Beef", "Lamb", "Salmon", "Black Bean"],
  cheeses:  ["Pepper Jack", "American", "Muenster", "Mozzarella", "Cheddar", "Colby Jack", "Vegan Cheese"],
  sauces:   ["Mushroom Sauce", "Lemon Dill", "Spicy Garlic Aioli", "Broccoli Pesto", "Super Secret FFbyHJ Sauce"],
};
const BURGER_PRICE = 16;

function BurgerBuilder({ onAddToCart }) {
  const [protein, setProtein] = useState("");
  const [cheese, setCheese]   = useState("");
  const [sauce, setSauce]     = useState("");
  const [added, setAdded]     = useState(false);
  const isVegan = protein === "Black Bean";
  const isComplete = protein && cheese && sauce;
  const handleAdd = () => {
    if (!isComplete) return;
    const name = `Deluxe Burger — ${protein}, ${cheese}, ${sauce}`;
    onAddToCart({ id: `burger-${Date.now()}`, name, price: BURGER_PRICE, qty: 1, category: "Burger",
      description: `${protein} patty · ${cheese} · ${isVegan ? "No bacon (vegan)" : "Lettuce, Tomato & Bacon"} · ${sauce}` });
    setProtein(""); setCheese(""); setSauce("");
    setAdded(true); setTimeout(() => setAdded(false), 2500);
  };
  const OptionGrid = ({ options, selected, onSelect, label }) => (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {options.map((opt) => (
          <button key={opt} onClick={() => onSelect(opt)}
            style={{ padding: "9px 18px", borderRadius: "100px", border: `2px solid ${selected === opt ? "#1A1208" : "#D4C9B8"}`,
              background: selected === opt ? "#1A1208" : "#fff", color: selected === opt ? "#FEFAF4" : "#6B5E4E",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #1A1208 0%, #3D2B1A 100%)", borderRadius: "20px", padding: "36px 40px", marginBottom: "36px", color: "#FEFAF4", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6, marginBottom: "8px" }}>Made your way</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 300, lineHeight: 1.1, marginBottom: "10px" }}>Build Your <em>Deluxe Burger</em></div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", opacity: 0.75, lineHeight: 1.6 }}>All burgers come with lettuce, tomatoes & bacon (vegan option excludes bacon). Served on a brioche bun.</div>
        </div>
        <div style={{ fontSize: "64px" }}>🍔</div>
      </div>
      <OptionGrid label="Step 1 — Choose Your Protein" options={BURGER_OPTIONS.proteins} selected={protein} onSelect={setProtein} />
      {isVegan && <div style={{ background: "#52B78820", border: "1px solid #52B788", borderRadius: "10px", padding: "10px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#2D8A5E", marginBottom: "20px" }}>🌱 Vegan option selected — bacon will be omitted.</div>}
      <OptionGrid label="Step 2 — Choose Your Cheese" options={BURGER_OPTIONS.cheeses} selected={cheese} onSelect={setCheese} />
      <OptionGrid label="Step 3 — Choose Your Sauce" options={BURGER_OPTIONS.sauces} selected={sauce} onSelect={setSauce} />
      {isComplete && (
        <div style={{ background: "#FEFAF4", border: "1px solid #EEE8DF", borderRadius: "16px", padding: "20px 24px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B5A48C", marginBottom: "8px" }}>Your Burger</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#1A1208", marginBottom: "4px" }}>{protein} Deluxe Burger</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B5E4E", lineHeight: 1.7 }}>{cheese} · {isVegan ? "No bacon" : "Lettuce, Tomato & Bacon"} · {sauce}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, marginTop: "12px" }}>${BURGER_PRICE} <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", fontWeight: 400 }}>/ burger</span></div>
        </div>
      )}
      <button onClick={handleAdd} disabled={!isComplete} className="add-btn"
        style={{ width: "100%", padding: "14px", fontSize: "15px", opacity: isComplete ? 1 : 0.4, cursor: isComplete ? "pointer" : "not-allowed", background: added ? "#52B788" : "#1A1208", transition: "background 0.3s" }}>
        {added ? "🍔 Added to Order!" : isComplete ? "+ Add Burger to Order" : "Complete all steps above"}
      </button>
    </div>
  );
}

// ── Workplace Lunch ───────────────────────────────────────────────────────────
function WorkplaceLunch() {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #1A1208 0%, #3D2B1A 100%)", borderRadius: "20px", padding: "36px 40px", marginBottom: "36px", color: "#FEFAF4", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6, marginBottom: "8px" }}>Feed your team</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 300, lineHeight: 1.1, marginBottom: "10px" }}>Workplace <em>Lunch</em></div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", opacity: 0.75, lineHeight: 1.6 }}>Fresh, chef-prepared lunches delivered to your office. Heather is curating this menu — check back soon!</div>
        </div>
        <div style={{ fontSize: "64px" }}>🏢</div>
      </div>
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #EEE8DF", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>👩‍🍳</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, marginBottom: "12px", color: "#1A1208" }}>Coming Soon</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6B5E4E", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 24px" }}>Heather is curating a special menu just for workplace lunches. In the meantime, reach out directly!</p>
        <a href="tel:7742053071" style={{ display: "inline-block", background: "#1A1208", color: "#FEFAF4", borderRadius: "100px", padding: "12px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>📞 Call Heather</a>
      </div>
    </div>
  );
}

// ── Reusable Menu Item Card ───────────────────────────────────────────────────
function MealCard({ item, onAdd }) {
  return (
    <div className="menu-card">
      <div className="img-wrap">
        <img src={getImage(item)} alt={item.name} className="food-img" onError={(e) => { e.target.src = FALLBACK; }} />
        <div className="cat-badge">{item.category?.toUpperCase()}</div>
      </div>
      <div style={{ padding: "20px 20px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, lineHeight: 1.2, flex: 1, paddingRight: "12px", color: "#1A1208" }}>{item.name}</h2>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600 }}>${item.price}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B5A48C" }}>{item.unit}</div>
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.65, color: "#6B5E4E", marginBottom: "14px" }}>{item.description}</p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
          {(item.tags || []).map((tag) => (
            <span key={tag} className="tag" style={{ background: (tagColors[tag] || "#D4C9B8") + "30", color: tagColors[tag] || "#6B5E4E", border: `1px solid ${(tagColors[tag] || "#D4C9B8")}60` }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #EEE8DF", paddingTop: "14px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C" }}>📦 {item.servings}</div>
          <button className="add-btn" onClick={onAdd}>+ Add to Order</button>
        </div>
      </div>
    </div>
  );
}

// ── Deluxe Burger Card ────────────────────────────────────────────────────────
function DeluxeBurgerCard({ onBuildBurger }) {
  return (
    <div className="menu-card" style={{ cursor: "pointer" }} onClick={onBuildBurger}>
      <div className="img-wrap">
        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" alt="Deluxe Burgers" className="food-img" />
        <div className="cat-badge">MEAL PREP</div>
      </div>
      <div style={{ padding: "20px 20px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, lineHeight: 1.2, flex: 1, paddingRight: "12px", color: "#1A1208" }}>Build Your Deluxe Burger</h2>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600 }}>$16</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B5A48C" }}>/ burger</div>
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.65, color: "#6B5E4E", marginBottom: "14px" }}>Choose your protein, cheese & sauce. All burgers come with lettuce, tomatoes & bacon on a brioche bun.</p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
          {["Chicken", "Beef", "Salmon", "Vegan Option"].map(tag => (
            <span key={tag} className="tag" style={{ background: "#D4C9B830", color: "#6B5E4E", border: "1px solid #D4C9B860" }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #EEE8DF", paddingTop: "14px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C" }}>🍔 Fully customizable</div>
          <button className="add-btn" onClick={(e) => { e.stopPropagation(); onBuildBurger(); }}>Build Now →</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function MenuApp() {
  const [menuItems, setMenuItems]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCookie, setSelectedCookie] = useState("");
  const [cartItems, setCartItems]       = useState([]);
  const [comboItems, setComboItems]     = useState([]);
  const [showCart, setShowCart]         = useState(false);
  const [view, setView]                 = useState("cart");
  const [successName, setSuccessName]   = useState("");
  const [showPrivacy, setShowPrivacy]   = useState(false);
  const [showTerms, setShowTerms]       = useState(false);

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/menu?active=eq.true&order=created_at.asc`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (!res.ok) throw new Error();
      setMenuItems(await res.json());
    } catch { setError("Couldn't load the menu right now. Please try again shortly."); }
    finally { setLoading(false); }
  };

  const isCombosTab    = activeCategory === "🍱 Combos";
  const isBurgerTab    = activeCategory === "🍔 Build a Burger";
  const isWorkplaceTab = activeCategory === "🏢 Workplace Lunch";
  const categoryKey = activeCategory.replace(/^\p{Emoji}\s*/u, "").trim();
  const CATEGORY_ORDER = ["Meal Prep", "Sides", "Catering", "Private Dinners", "Cookies"];
  const filtered = (isCombosTab || isBurgerTab || isWorkplaceTab) ? [] : (activeCategory === "All"
    ? menuItems.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category))
    : activeCategory === "Meal Prep"
      ? menuItems.filter((i) => i.category === "Meal Prep" || i.category === "Sides").sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category))
      : menuItems.filter((i) => i.category === categoryKey));

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const addCombo = (combo) => {
    setComboItems((prev) => [...prev, combo]);
  };

  const removeFromCart   = (id) => setCartItems((prev) => prev.filter((c) => c.id !== id));
  const removeCombo      = (id) => setComboItems((prev) => prev.filter((c) => c.id !== id));
  const totalItems       = cartItems.reduce((s, c) => s + c.qty, 0) + comboItems.length;

  const handleSuccess = (name) => { setSuccessName(name); setView("success"); };
  const handleReset   = () => { setCartItems([]); setComboItems([]); setView("cart"); setShowCart(false); };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#FEFAF4", minHeight: "100vh", color: "#1A1208" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .menu-card { background: #fff; border-radius: 20px; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; border: 1px solid #EEE8DF; }
        .menu-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(26,18,8,0.13); }
        .food-img { width: 100%; height: 200px; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .menu-card:hover .food-img { transform: scale(1.04); }
        .img-wrap { overflow: hidden; position: relative; height: 200px; }
        .cat-badge { position: absolute; top: 12px; right: 12px; background: rgba(254,250,244,0.92); backdrop-filter: blur(8px); border-radius: 8px; padding: 4px 10px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.06em; color: #1A1208; }
        .cat-btn { border: 1.5px solid #D4C9B8; background: transparent; padding: 8px 20px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.04em; cursor: pointer; transition: all 0.2s ease; color: #6B5E4E; }
        .cat-btn:hover { border-color: #1A1208; color: #1A1208; }
        .cat-btn.active { background: #1A1208; border-color: #1A1208; color: #FEFAF4; }
        .cat-btn.combo-btn { border-color: #E76F51; color: #C4400A; }
        .cat-btn.combo-btn.active { background: #E76F51; border-color: #E76F51; color: #fff; }
        .add-btn { background: #1A1208; color: #FEFAF4; border: none; padding: 10px 18px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; letter-spacing: 0.03em; white-space: nowrap; }
        .add-btn:hover { background: #3D2B1A; }
        .tag { display: inline-block; padding: 3px 9px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.04em; }
        .section-label { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #B5A48C; }
        .spinner { width: 36px; height: 36px; border: 3px solid #EEE8DF; border-top-color: #1A1208; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .hero-title { font-size: 48px !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "linear-gradient(135deg, #0F1A0F 0%, #4A1B6B 100%)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <img src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/noBgColor.png" alt="Flavor Fuzion by Heather Janey" style={{ height: "48px", width: "auto", display: "block", objectFit: "contain" }} />
        </div>
        <button onClick={() => { setShowCart(true); setView("cart"); }} style={{ background: "linear-gradient(135deg, #8B6914 0%, #DAA520 30%, #F5D060 50%, #DAA520 70%, #8B6914 100%)", color: "#0F1A0F", border: "none", borderRadius: "100px", padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🛒</span><span>Order</span>
          {totalItems > 0 && <span style={{ background: "#E76F51", color: "#fff", borderRadius: "100px", padding: "2px 8px", fontSize: "11px" }}>{totalItems}</span>}
        </button>
      </nav>

      {/* Hero */}
      <div style={{ padding: "72px 32px 56px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div className="section-label" style={{ marginBottom: "16px" }}>Food is Life. Life is Good.™</div>
        <h1 className="hero-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "72px", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "20px", color: "#1A1208" }}>
          Bold flavors,<br /><em>made with love</em>
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#6B5E4E", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
          Welcome to Flavor Fuzion by Heather Janey — fresh weekly meal prep, bespoke catering, and exclusive private dinner experiences, all made to order.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", padding: "0 32px 48px" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat}
            className={`cat-btn${cat === "🍱 Combos" ? " combo-btn" : ""}${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* 🧊 Fresh Never Frozen Banner */}
      {(activeCategory === "All" || activeCategory === "Meal Prep") && (
        <div style={{ background: "linear-gradient(135deg, #1A1208 0%, #3D2B1A 100%)", margin: "0 32px 32px", borderRadius: "16px", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "28px" }}>🧊</span>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", color: "#FEFAF4", textAlign: "center" }}>Frozen is for ice cream. Not your meals.</div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C", letterSpacing: "0.1em", textTransform: "uppercase" }}>— Always Fresh</span>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px 80px" }}>
        {isCombosTab && <ComboBuilder menuItems={menuItems} onAddCombo={(combo) => { addCombo(combo); setShowCart(true); setView("cart"); }} />}
        {isBurgerTab && <BurgerBuilder onAddToCart={(item) => { addToCart(item); setShowCart(true); setView("cart"); }} />}
        {isWorkplaceTab && <WorkplaceLunch />}
        {!isCombosTab && !isBurgerTab && !isWorkplaceTab && (
          <>
            {loading && <div style={{ textAlign: "center", paddingTop: "60px" }}><div className="spinner" /><div style={{ fontFamily: "'DM Sans', sans-serif", color: "#B5A48C", fontSize: "14px" }}>Loading the menu…</div></div>}
            {error && <div style={{ textAlign: "center", paddingTop: "60px" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>😔</div><div style={{ fontFamily: "'DM Sans', sans-serif", color: "#E76F51", fontSize: "15px", marginBottom: "16px" }}>{error}</div><button className="add-btn" onClick={fetchMenu}>Try Again</button></div>}
            {!loading && !error && filtered.length === 0 && <div style={{ textAlign: "center", paddingTop: "60px" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div><div style={{ fontFamily: "'DM Sans', sans-serif", color: "#B5A48C", fontSize: "15px" }}>No items in this category right now.<br />Check back soon!</div></div>}
            {!loading && !error && filtered.length > 0 && categoryKey === "Cookies" && (
              <div style={{ maxWidth: "500px", margin: "0 auto", background: "#fff", borderRadius: "20px", padding: "32px", border: "1px solid #EEE8DF", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "64px", marginBottom: "12px" }}>🍪</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#1A1208", marginBottom: "8px" }}>Almond Lavender Cookies</h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B5E4E", lineHeight: 1.6 }}>Organic & Gluten-Free. Made with love by Chef Heather Janey.</p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B5A48C", display: "block", marginBottom: "8px" }}>Select Pack Size</label>
                  <select
                    value={selectedCookie}
                    onChange={(e) => setSelectedCookie(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #D4C9B8", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", background: "#FEFAF4", outline: "none", cursor: "pointer" }}>
                    <option value="" disabled>Choose a pack size...</option>
                    {filtered.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name.replace("Almond Lavender Cookies - ", "")} — ${item.price}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={!selectedCookie}
                  onClick={() => {
                    const selected = filtered.find(i => i.id === selectedCookie);
                    if (selected) { addToCart(selected); setSelectedCookie(""); }
                  }}
                  className="add-btn"
                  style={{ width: "100%", opacity: selectedCookie ? 1 : 0.4, cursor: selectedCookie ? "pointer" : "not-allowed" }}>
                  + Add to Order
                </button>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C", textAlign: "center", marginTop: "12px" }}>
                  💡 Bigger packs = better savings!
                </p>
              </div>
            )}
            {!loading && !error && filtered.length > 0 && categoryKey !== "Cookies" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>

                {/* Meal Prep & Sides items with burger card injected at position 4 */}
                {(() => {
                  const mealPrepItems = filtered.filter(i => i.category === "Meal Prep" || i.category === "Sides");
                  const burgerCard = (activeCategory === "All" || activeCategory === "Meal Prep")
                    ? [<DeluxeBurgerCard key="burger-card" onBuildBurger={() => setActiveCategory("🍔 Build a Burger")} />]
                    : [];
                  const insertAt = 3; // 0-indexed, so position 4
                  const before = mealPrepItems.slice(0, insertAt);
                  const after = mealPrepItems.slice(insertAt);
                  return [
                    ...before.map((item) => <MealCard key={item.id} item={item} onAdd={() => addToCart(item)} />),
                    ...burgerCard,
                    ...after.map((item) => <MealCard key={item.id} item={item} onAdd={() => addToCart(item)} />),
                  ];
                })()}

                {/* All other categories (Catering, Private Dinners) */}
                {filtered.filter(i => i.category !== "Meal Prep" && i.category !== "Sides" && i.category !== "Cookies").map((item) => (
                  <MealCard key={item.id} item={item} onAdd={() => addToCart(item)} />
                ))}

                {/* Cookies Dropdown Card — shows in All tab only */}
                {activeCategory === "All" && filtered.some(i => i.category === "Cookies") && (
                  <div className="menu-card">
                    <div className="img-wrap">
                      <img src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/20260501_083105(2).jpg" alt="Almond Lavender Cookies" className="food-img" onError={(e) => { e.target.src = FALLBACK; }} />
                      <div className="cat-badge">COOKIES</div>
                    </div>
                    <div style={{ padding: "20px 20px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, lineHeight: 1.2, flex: 1, paddingRight: "12px", color: "#1A1208" }}>Almond Lavender Cookies</h2>
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.65, color: "#6B5E4E", marginBottom: "14px" }}>Organic & Gluten-Free. Made with love by Chef Heather Janey.</p>
                      <div style={{ marginBottom: "14px" }}>
                        <select value={selectedCookie} onChange={(e) => setSelectedCookie(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D4C9B8", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", background: "#FEFAF4", outline: "none", cursor: "pointer" }}>
                          <option value="" disabled>Choose a pack size...</option>
                          {filtered.filter(i => i.category === "Cookies").map((item) => (
                            <option key={item.id} value={item.id}>{item.name.replace("Almond Lavender Cookies - ", "")} — ${item.price}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #EEE8DF", paddingTop: "14px" }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C" }}>💡 Bigger packs = better savings!</div>
                        <button disabled={!selectedCookie} className="add-btn"
                          style={{ opacity: selectedCookie ? 1 : 0.4, cursor: selectedCookie ? "pointer" : "not-allowed" }}
                          onClick={() => { const s = filtered.find(i => i.id === selectedCookie); if (s) { addToCart(s); setSelectedCookie(""); } }}>
                          + Add to Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #EEE8DF", padding: "40px 32px", textAlign: "center", background: "#1A1208", color: "#FEFAF4" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, marginBottom: "8px" }}>Planning a large event?</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#B5A48C", marginBottom: "20px" }}>Get in touch for custom menus, tastings, and deposit-based bookings.</p>
        <button onClick={() => { setShowCart(true); setView("form"); }} style={{ background: "#E76F51", color: "#fff", border: "none", borderRadius: "100px", padding: "12px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em" }}>Contact Us →</button>
        <div style={{ marginTop: "28px", display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap" }}>
          <a href="https://instagram.com/flavorfuzionbyhj" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", textDecoration: "none" }}>📸 @flavorfuzionbyhj</a>
          <a href="tel:7742053071" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", textDecoration: "none" }}>📞 774-205-3071</a>
        </div>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B5E4E", cursor: "pointer", textDecoration: "underline", padding: 0 }}>Privacy Policy</button>
          <button onClick={() => setShowTerms(true)} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B5E4E", cursor: "pointer", textDecoration: "underline", padding: 0 }}>Terms of Service</button>
        </div>
        <div style={{ marginTop: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#4A3D30" }}>© {new Date().getFullYear()} Flavor Fuzion by Heather Janey. All rights reserved. "Food is Life. Life is Good.™"</div>
      </div>

      {/* Cart Overlay */}
      {showCart && <div onClick={() => setShowCart(false)} style={{ position: "fixed", inset: 0, background: "rgba(26,18,8,0.4)", zIndex: 99 }} />}

      {/* Side Drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "420px", maxWidth: "100vw", background: "#fff", boxShadow: "-8px 0 40px rgba(26,18,8,0.12)", zIndex: 100, overflowY: "auto", transform: showCart ? "translateX(0)" : "translateX(100%)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <button onClick={() => setShowCart(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6B5E4E", zIndex: 1 }}>✕</button>

        {/* Cart View */}
        {view === "cart" && (
          <div style={{ padding: "32px 24px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, marginBottom: "28px" }}>Your Order</h2>

            {cartItems.length === 0 && comboItems.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: "60px", fontFamily: "'DM Sans', sans-serif", color: "#B5A48C" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
                <div style={{ fontSize: "15px" }}>Your order is empty.</div>
                <div style={{ fontSize: "13px", marginTop: "8px" }}>Browse the menu and add items!</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                  {/* Regular items */}
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "#FEFAF4", borderRadius: "12px", border: "1px solid #EEE8DF" }}>
                      <img src={getImage(item)} alt={item.name} onError={(e) => { e.target.src = FALLBACK; }} style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#B5A48C" }}>${item.price} × {item.qty}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#B5A48C", cursor: "pointer", fontSize: "16px" }}>✕</button>
                    </div>
                  ))}

                  {/* Combo items */}
                  {comboItems.map((combo) => (
                    <div key={combo.id} style={{ padding: "14px", background: "#1A120808", borderRadius: "12px", border: "2px solid #1A1208" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                            <span style={{ fontSize: "18px" }}>🍱</span>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600 }}>{combo.label}</div>
                          </div>
                          <div style={{ background: "#E76F51", color: "#fff", display: "inline-block", borderRadius: "100px", padding: "1px 8px", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, marginBottom: "8px" }}>{combo.badge}</div>
                        </div>
                        <button onClick={() => removeCombo(combo.id)} style={{ background: "none", border: "none", color: "#B5A48C", cursor: "pointer", fontSize: "16px" }}>✕</button>
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#6B5E4E", lineHeight: 1.6 }}>
                        <div>🍽️ {combo.entrees.map(i => i.name).join(", ")}</div>
                        <div>🥗 {combo.sides.map(i => i.name).join(", ")}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #EEE8DF" }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#52B788", fontWeight: 600 }}>You save ${combo.savings.toFixed(2)}</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600 }}>${combo.discountedTotal.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #EEE8DF", paddingTop: "20px" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#B5A48C", lineHeight: 1.6, marginBottom: "20px" }}>
                    Final pricing confirmed by Heather before any payment is needed.
                  </div>
                  <button onClick={() => setView("form")} style={{ width: "100%", background: "#1A1208", color: "#FEFAF4", border: "none", borderRadius: "12px", padding: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.03em" }}>
                    Request a Quote →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {view === "form" && <OrderForm cartItems={cartItems} comboItems={comboItems} onSuccess={handleSuccess} onCancel={() => setView("cart")} />}
        {view === "success" && <SuccessScreen name={successName} onReset={handleReset} />}
      </div>

      {/* Privacy Policy & Terms of Service Modals */}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
    </div>
  );
}
