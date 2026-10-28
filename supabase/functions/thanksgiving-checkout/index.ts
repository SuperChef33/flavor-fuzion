// Thanksgiving dinner checkout for byheatherjaney.com
// GET  -> { open, earlyBird, cap, remaining }  (used by the order page)
// POST -> creates a Stripe Checkout session from the customer's picks and returns { url }
// All prices and menu choices live HERE, so nobody can change a price from their browser.
// Keep the menu in sync with THANKSGIVING in the website's App.jsx.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// ── Settings Heather may want to change ──────────────────────────────────────
const DINNER_CAP = 20;                                        // max dinners (à la carte-only orders don't count)
const EARLY_BIRD_ENDS = new Date("2026-11-11T05:00:00Z");     // end of Tue Nov 10 (Eastern)
const ORDERS_CLOSE = new Date("2026-11-19T05:00:00Z");        // end of Wed Nov 18 (Eastern)
const COUNT_ORDERS_SINCE = Math.floor(new Date("2026-10-27T00:00:00Z").getTime() / 1000);
const SITE = "https://byheatherjaney.com";

// ── Menu ─────────────────────────────────────────────────────────────────────
const DINNER_PRICES: Record<number, { early: number; regular: number }> = {
  4: { early: 175, regular: 195 },
  6: { early: 245, regular: 270 },
  8: { early: 315, regular: 340 },
};
const CORNISH_UPCHARGE_PER_GUEST = 6;

const PROTEINS: Record<string, { options?: string[]; optionLabel?: string }> = {
  "Sliced Turkey": { options: ["White meat", "Dark meat", "Both"], optionLabel: "Cut" },
  "Turkey Drumsticks": {},
  "Braised Turkey Wings": {},
  "Whole Roasted Young Chicken": { options: ["Garlic Herb", "Orange & Sage"], optionLabel: "Seasoning" },
  "Cornish Hens": { options: ["Garlic Herb", "Orange & Sage"], optionLabel: "Seasoning" },
};

const SIDES: Record<string, { options?: string[] }> = {
  "Baked Mac & Cheese": {},
  "Mashed Potatoes": {},
  "Classic Stuffing (made with apples)": {},
  "Chorizo Stuffing": {},
  "Stewed Collards": { options: ["with smoked turkey", "with ham hocks"] },
  "Stewed White Beans & Kale with lemon": {},
  "Sweet Potato Carrot Mash": { options: ["with mini marshmallows", "no marshmallows"] },
  "Garlic & Dill Green Beans": {},
  "Roasted Garlic & Herb Mini Potatoes": {},
};

const DESSERTS = [
  "Addictive Apple Cake",
  "Hand-Held Cherry Pies",
  "Peach Cobbler",
  "Gluten-Free Almond Lavender Cookies",
];

type ExtraDef = { name: string; price: number; unit?: string; needsSide?: boolean; needsSeasoning?: boolean; max?: number };
const EXTRAS: Record<string, ExtraDef> = {
  side_quart:      { name: "Side, by the quart (serves 4)", price: 18, needsSide: true },
  side_halfpan:    { name: "Side, half pan (serves 8–10)", price: 45, needsSide: true },
  turkey_lb:       { name: "Sliced turkey", price: 22, unit: "lb" },
  quiche:          { name: "Spinach quiche, whole 9\"", price: 32 },
  drumstick:       { name: "Turkey drumstick", price: 10 },
  wings:           { name: "Braised turkey wings (2)", price: 16 },
  chicken:         { name: "Whole roasted young chicken", price: 26, needsSeasoning: true },
  cornish_hen:     { name: "Cornish hen", price: 16, needsSeasoning: true },
  apple_cake_6:    { name: "Addictive Apple Cake, 6 pieces", price: 26 },
  apple_cake_12:   { name: "Addictive Apple Cake, 12 pieces", price: 48 },
  cobbler:         { name: "Peach cobbler, 9×13 pan", price: 45 },
  cherry_pie:      { name: "Hand-held cherry pie", price: 6 },
  gf_cookies:      { name: "Gluten-free almond lavender cookies, dozen", price: 30 },
  gravy_pint:      { name: "Extra gravy, pint", price: 8 },
  cranberry_pint:  { name: "Extra cranberry sauce, pint", price: 8 },
};
const SEASONINGS = ["Garlic Herb", "Orange & Sage"];

const TOWNS_INCLUDED = ["Kingston", "Plymouth", "Manomet", "Cedarville", "Duxbury", "Plympton", "Pembroke", "Halifax", "Marshfield"];
const TOWNS_EXTENDED = ["Carver", "Hanson", "Hanover", "Norwell", "Middleborough", "Wareham"];
const EXTENDED_DELIVERY_FEE = 15;

// ── Helpers ──────────────────────────────────────────────────────────────────
class OrderError extends Error {}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const clean = (v: unknown, max = 200) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const cents = (dollars: number) => Math.round(dollars * 100);

function stripeClient() {
  return new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
}

// Dinners already paid for, plus checkouts still in progress (they expire after ~30 min)
async function dinnersTaken(stripe: Stripe): Promise<number> {
  let taken = 0;
  for (const status of ["complete", "open"] as const) {
    const sessions = await stripe.checkout.sessions
      .list({ status, created: { gte: COUNT_ORDERS_SINCE }, limit: 100 })
      .autoPagingToArray({ limit: 2000 });
    for (const s of sessions) {
      if (s.metadata?.source !== "thanksgiving" || s.metadata?.dinner !== "yes") continue;
      if (status === "complete" && s.payment_status !== "paid") continue;
      taken += 1;
    }
  }
  return taken;
}

function isEarlyBird(now = new Date()) { return now < EARLY_BIRD_ENDS; }
function isOpen(now = new Date()) { return now < ORDERS_CLOSE; }

// ── Build the order from the customer's picks ────────────────────────────────
function buildOrder(body: any) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const meta: Record<string, string> = { source: "thanksgiving", dinner: "no" };
  const early = isEarlyBird();

  // Customer + delivery
  const c = body?.customer ?? {};
  const name = clean(c.name, 100), email = clean(c.email, 200), phone = clean(c.phone, 40);
  const street = clean(c.street, 200), town = clean(c.town, 60), notes = clean(c.notes, 450);
  if (!name) throw new OrderError("Please enter your name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new OrderError("Please enter a valid email address.");
  if (phone.replace(/\D/g, "").length < 10) throw new OrderError("Please enter a phone number so Heather can reach you on delivery day.");
  if (!street) throw new OrderError("Please enter your street address.");
  const extended = TOWNS_EXTENDED.includes(town);
  if (!TOWNS_INCLUDED.includes(town) && !extended) throw new OrderError("Please choose your town from the delivery list.");
  Object.assign(meta, { name, email, phone, street, town, notes: notes || "—" });

  // Dinner (optional)
  const d = body?.dinner;
  let summary: string[] = [];
  if (d) {
    const size = Number(d.size);
    const price = DINNER_PRICES[size];
    if (!price) throw new OrderError("Please choose a dinner size.");

    const protein = clean(d.protein, 60);
    const pdef = PROTEINS[protein];
    if (!pdef) throw new OrderError("Please choose a protein.");
    let proteinText = protein;
    if (pdef.options) {
      const opt = clean(d.proteinOption, 40);
      if (!pdef.options.includes(opt)) throw new OrderError(`Please choose a ${pdef.optionLabel!.toLowerCase()} for the ${protein.toLowerCase()}.`);
      proteinText += ` (${opt})`;
    }

    const sides = Array.isArray(d.sides) ? d.sides.map((s: unknown) => clean(s, 80)) : [];
    if (sides.length !== 3 || new Set(sides).size !== 3 || !sides.every((s: string) => SIDES[s]))
      throw new OrderError("Please choose 3 different sides.");
    const sideOptions = d.sideOptions ?? {};
    const sideTexts = sides.map((s: string) => {
      const opts = SIDES[s].options;
      if (!opts) return s;
      const o = clean(sideOptions[s], 40);
      if (!opts.includes(o)) throw new OrderError(`Please choose an option for ${s}.`);
      return `${s} (${o})`;
    });

    const dessert = clean(d.dessert, 60);
    if (!DESSERTS.includes(dessert)) throw new OrderError("Please choose a dessert.");

    const base = early ? price.early : price.regular;
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cents(base),
        product_data: {
          name: `Thanksgiving Dinner — Serves ${size}${early ? " (early-bird)" : ""}`,
          description: `${proteinText} · ${sideTexts.join(", ")} · ${dessert} · cranberry sauce & gravy`,
        },
      },
    });
    if (protein === "Cornish Hens") {
      lineItems.push({
        quantity: size,
        price_data: {
          currency: "usd",
          unit_amount: cents(CORNISH_UPCHARGE_PER_GUEST),
          product_data: { name: "Cornish hen upgrade (per guest)" },
        },
      });
    }
    Object.assign(meta, {
      dinner: "yes",
      size: String(size),
      pricing: early ? "early-bird" : "regular",
      protein: proteinText,
      sides: sideTexts.join(" | ").slice(0, 500),
      dessert,
    });
    summary.push(`Dinner serves ${size}`);
  }

  // À la carte (optional)
  const extras = Array.isArray(body?.extras) ? body.extras : [];
  if (extras.length > 40) throw new OrderError("That's a lot of add-ons! Please call Heather for large orders.");
  const extraTexts: string[] = [];
  for (const e of extras) {
    const def = EXTRAS[clean(e?.id, 40)];
    if (!def) throw new OrderError("One of your add-ons isn't on the menu anymore. Please refresh the page.");
    const qty = Math.floor(Number(e.qty));
    if (!(qty >= 1 && qty <= 20)) throw new OrderError(`Please choose a quantity from 1 to 20 for ${def.name}.`);
    let label = def.name;
    if (def.needsSide) {
      const side = clean(e.side, 80);
      if (!SIDES[side]) throw new OrderError(`Please choose which side for "${def.name}".`);
      const opts = SIDES[side].options;
      let sideText = side;
      if (opts) {
        const o = clean(e.sideOption, 40);
        if (!opts.includes(o)) throw new OrderError(`Please choose an option for ${side}.`);
        sideText += ` (${o})`;
      }
      label = `${def.name}: ${sideText}`;
    }
    if (def.needsSeasoning) {
      const s = clean(e.seasoning, 40);
      if (!SEASONINGS.includes(s)) throw new OrderError(`Please choose a seasoning for the ${def.name.toLowerCase()}.`);
      label = `${def.name} (${s})`;
    }
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: cents(def.price),
        product_data: { name: def.unit ? `${label} (per ${def.unit})` : label },
      },
    });
    extraTexts.push(`${qty}${def.unit ? " " + def.unit : "×"} ${label}`);
  }
  if (!d && extraTexts.length === 0) throw new OrderError("Please choose a dinner or at least one à la carte item.");

  // Split the add-on list across metadata fields (Stripe allows 500 characters each)
  const extrasText = extraTexts.join(" | ") || "—";
  for (let i = 0; i < 4; i++) {
    const part = extrasText.slice(i * 490, (i + 1) * 490);
    if (part) meta[`extras_${i + 1}`] = part;
  }

  if (extended) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cents(EXTENDED_DELIVERY_FEE),
        product_data: { name: `Delivery to ${town} (extended area)` },
      },
    });
  }

  return { lineItems, meta, email, hasDinner: !!d };
}

// ── Handler ──────────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const stripe = stripeClient();

    if (req.method === "GET") {
      const taken = await dinnersTaken(stripe);
      return json({ open: isOpen(), earlyBird: isEarlyBird(), cap: DINNER_CAP, remaining: Math.max(0, DINNER_CAP - taken) });
    }

    if (!isOpen()) throw new OrderError("Thanksgiving orders are closed. Thank you so much for your support!");

    const body = await req.json();
    const { lineItems, meta, email, hasDinner } = buildOrder(body);

    if (hasDinner && (await dinnersTaken(stripe)) >= DINNER_CAP) {
      throw new OrderError("Thanksgiving dinners are sold out! À la carte items may still be available.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: email,
      metadata: meta,
      payment_intent_data: { description: `Thanksgiving order — ${meta.name} (${meta.town})`, metadata: meta },
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60, // unpaid checkouts release their dinner spot after 31 minutes
      success_url: `${SITE}/?thanksgiving=success`,
      cancel_url: `${SITE}/?thanksgiving=cancelled`,
    });

    return json({ url: session.url });
  } catch (err) {
    if (err instanceof OrderError) return json({ error: err.message }, 400);
    console.error("Thanksgiving checkout error:", err);
    return json({ error: "Something went wrong starting checkout. Please try again, or call Heather at 774-205-3071." }, 500);
  }
});
