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
  "Mediterranean Chicken":   "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  "Vegan Lentil Curry":      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
  "BBQ Feast Package":       "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  "Elegant Brunch Spread":   "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80",
  "Taco & Tequila Bar":      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Date Night for Two":      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "Dinner Party Experience": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
  "Garlic Roasted Potatoes": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
  "Steamed Jasmine Rice":    "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80",
  "Sautéed Garlic Broccolini": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80",
  "Mac & Cheese":            "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&q=80",
  "Roasted Sweet Potatoes":  "https://images.unsplash.com/photo-1596797038530-2c107aa9a5e0?w=600&q=80",
  "Garden Side Salad":       "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
};
const FALLBACK = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80";

const tagColors = {
  "GF": "#52B788", "Vegan": "#52B788", "High Protein": "#E76F51",
  "Popular": "#E9C46A", "Crowd Fave": "#E9C46A", "Romantic": "#CDB4DB",
  "Custom Menu": "#BDE0FE", "Premium": "#BDE0FE",
  "Vegetarian Option": "#52B788", "GF Option": "#52B788",
};

const CATEGORIES = ["All", "Meal Prep", "Catering", "Private Dinners", "🍱 Combos"];

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

      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, margin: "24px 0 16px", paddingBottom: "8px", borderBottom: "1px solid #EEE8DF" }}>Event Details</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Field label="Event Date *"><input style={inputStyle} type="date" value={form.event_date} min={new Date().toISOString().split("T")[0]} onChange={(e) => set("event_date", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} />{err("event_date")}</Field>
        <Field label="Preferred Time"><input style={inputStyle} type="time" value={form.event_time} onChange={(e) => set("event_time", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>
      </div>
      <Field label="Number of Guests *"><input style={inputStyle} type="number" min="1" placeholder="e.g. 25" value={form.guest_count} onChange={(e) => set("guest_count", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} />{err("guest_count")}</Field>

      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, margin: "24px 0 16px", paddingBottom: "8px", borderBottom: "1px solid #EEE8DF" }}>Courses Needed</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <Field label="Entrées"><input style={inputStyle} type="number" min="0" placeholder="0" value={form.entree_count} onChange={(e) => set("entree_count", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>
        <Field label="Appetizers"><input style={inputStyle} type="number" min="0" placeholder="0" value={form.appetizer_count} onChange={(e) => set("appetizer_count", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>
        <Field label="Sides"><input style={inputStyle} type="number" min="0" placeholder="0" value={form.side_count} onChange={(e) => set("side_count", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>
      </div>

      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, margin: "24px 0 16px", paddingBottom: "8px", borderBottom: "1px solid #EEE8DF" }}>Dietary Notes & Allergies</div>
      <Field label="Any allergies or dietary restrictions?"><textarea style={{ ...inputStyle, height: "100px", resize: "vertical" }} placeholder="e.g. 3 guests are gluten-free, 1 is allergic to shellfish…" value={form.dietary_notes} onChange={(e) => set("dietary_notes", e.target.value)} onFocus={(e) => e.target.style.borderColor="#1A1208"} onBlur={(e) => e.target.style.borderColor="#D4C9B8"} /></Field>

      {errors.submit && <div style={{ background: "#FEF0ED", border: "1px solid #E76F51", borderRadius: "10px", padding: "12px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#E76F51", marginBottom: "16px" }}>{errors.submit}</div>}

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
        <em style={{ color: "#B5A48C" }}>Food is Life, Life is Good 🍽️</em>
      </div>
      <button onClick={onReset} style={{ background: "#1A1208", color: "#FEFAF4", border: "none", borderRadius: "12px", padding: "14px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Back to Menu</button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function MenuApp() {
  const [menuItems, setMenuItems]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems]       = useState([]);
  const [comboItems, setComboItems]     = useState([]);
  const [showCart, setShowCart]         = useState(false);
  const [view, setView]                 = useState("cart");
  const [successName, setSuccessName]   = useState("");

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

  const isCombosTab = activeCategory === "🍱 Combos";
  const filtered = isCombosTab ? [] : (activeCategory === "All"
    ? menuItems.filter((i) => i.category !== "Sides")
    : menuItems.filter((i) => i.category === activeCategory));

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
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(254,250,244,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #EEE8DF", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, letterSpacing: "0.04em" }}>Flavor Fuzion</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#B5A48C", letterSpacing: "0.1em", marginTop: "1px" }}>BY HEATHER JANEY</div>
        </div>
        <button onClick={() => { setShowCart(true); setView("cart"); }} style={{ background: "#1A1208", color: "#FEFAF4", border: "none", borderRadius: "100px", padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🛒</span><span>Order</span>
          {totalItems > 0 && <span style={{ background: "#E76F51", color: "#fff", borderRadius: "100px", padding: "2px 8px", fontSize: "11px" }}>{totalItems}</span>}
        </button>
      </nav>

      {/* Hero */}
      <div style={{ padding: "72px 32px 56px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div className="section-label" style={{ marginBottom: "16px" }}>Food is Life, Life is Good</div>
        <h1 className="hero-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "72px", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "20px" }}>
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

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px 80px" }}>

        {/* Combos Tab */}
        {isCombosTab && (
          <ComboBuilder menuItems={menuItems} onAddCombo={(combo) => { addCombo(combo); setShowCart(true); setView("cart"); }} />
        )}

        {/* Regular Menu */}
        {!isCombosTab && (
          <>
            {loading && <div style={{ textAlign: "center", paddingTop: "60px" }}><div className="spinner" /><div style={{ fontFamily: "'DM Sans', sans-serif", color: "#B5A48C", fontSize: "14px" }}>Loading the menu…</div></div>}
            {error && <div style={{ textAlign: "center", paddingTop: "60px" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>😔</div><div style={{ fontFamily: "'DM Sans', sans-serif", color: "#E76F51", fontSize: "15px", marginBottom: "16px" }}>{error}</div><button className="add-btn" onClick={fetchMenu}>Try Again</button></div>}
            {!loading && !error && filtered.length === 0 && <div style={{ textAlign: "center", paddingTop: "60px" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div><div style={{ fontFamily: "'DM Sans', sans-serif", color: "#B5A48C", fontSize: "15px" }}>No items in this category right now.<br />Check back soon!</div></div>}
            {!loading && !error && filtered.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
                {filtered.map((item) => (
                  <div key={item.id} className="menu-card">
                    <div className="img-wrap">
                      <img src={getImage(item)} alt={item.name} className="food-img" onError={(e) => { e.target.src = FALLBACK; }} />
                      <div className="cat-badge">{item.category?.toUpperCase()}</div>
                    </div>
                    <div style={{ padding: "20px 20px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, lineHeight: 1.2, flex: 1, paddingRight: "12px" }}>{item.name}</h2>
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
                        <button className="add-btn" onClick={() => addToCart(item)}>+ Add to Order</button>
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
