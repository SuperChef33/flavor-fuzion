// Stripe webhook: when a Thanksgiving order is paid, email Heather the full order
// and send the customer a confirmation.
// Needs secrets: STRIPE_SECRET_KEY, STRIPE_THANKSGIVING_WEBHOOK_SECRET, RESEND_API_KEY
// Stripe webhook endpoint listens for: checkout.session.completed

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const HEATHER_EMAIL = "FlavorFuzionbyHJ@gmail.com";
const FROM = "Flavor Fuzion Orders <orders@byheatherjaney.com>";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const money = (c: number | null | undefined) => `$${((c ?? 0) / 100).toFixed(2)}`;

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
}

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_THANKSGIVING_WEBHOOK_SECRET")!,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("Webhook signature check failed:", err.message);
    return new Response("Bad signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") return new Response("ignored", { status: 200 });
  const session = event.data.object as Stripe.Checkout.Session;
  const m = session.metadata ?? {};
  if (m.source !== "thanksgiving" || session.payment_status !== "paid") return new Response("ignored", { status: 200 });

  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
  const itemLines = items.data
    .map((li) => `• ${li.quantity} × ${li.description}  —  ${money(li.amount_total)}`)
    .join("\n");
  const extras = [m.extras_1, m.extras_2, m.extras_3, m.extras_4].filter(Boolean).join("");

  const dinnerBlock = m.dinner === "yes"
    ? `DINNER — SERVES ${m.size} (${m.pricing} price)
Protein:  ${m.protein}
Sides:    ${(m.sides || "").split(" | ").join("\n          ")}
Dessert:  ${m.dessert}
(+ cranberry sauce & gravy)`
    : "No dinner — à la carte only";

  const heatherText = `
🦃 New Thanksgiving order — PAID ${money(session.amount_total)}

DELIVER TO
${m.name}
${m.street}
${m.town}
Phone: ${m.phone}
Email: ${m.email}
Notes: ${m.notes}

${dinnerBlock}

À LA CARTE
${extras && extras !== "—" ? extras.split(" | ").map((x) => "• " + x).join("\n") : "None"}

WHAT THEY PAID FOR
${itemLines}
Total paid: ${money(session.amount_total)}

Drop-off: Wed, Nov 25 — confirm their 1-hour window by Mon, Nov 23.
Reply to this email to reach the customer.
`.trim();

  // 1) Heather's copy — if this fails, Stripe retries the webhook
  await sendEmail({
    from: FROM,
    to: HEATHER_EMAIL,
    reply_to: m.email,
    subject: `🦃 Thanksgiving order — ${m.town} — ${m.name}${m.dinner === "yes" ? ` (Serves ${m.size})` : " (à la carte)"}`,
    text: heatherText,
  });

  // 2) Customer confirmation — a failure here is logged but doesn't resend Heather's email
  try {
    const customerText = `
Hi ${m.name.split(" ")[0]}!

Thank you for your Thanksgiving order with Flavor Fuzion by Heather Janey. Your payment of ${money(session.amount_total)} went through, and your dinner is officially on the list.

YOUR ORDER
${itemLines}

DELIVERY
${m.street}, ${m.town}
Drop-off is Wednesday, November 25, between 10 am and 7 pm. Heather will text or email your 1-hour window by Monday, November 23.
Everything arrives ready to heat and serve.

Questions or changes? Just reply to this email or call/text 774-205-3071.

Food is Life, Life is Good!
— Heather
`.trim();
    await sendEmail({
      from: FROM,
      to: m.email,
      reply_to: HEATHER_EMAIL,
      subject: "Your Flavor Fuzion Thanksgiving order is confirmed 🦃",
      text: customerText,
    });
  } catch (err) {
    console.error("Customer confirmation failed:", err.message);
  }

  return new Response("ok", { status: 200 });
});
