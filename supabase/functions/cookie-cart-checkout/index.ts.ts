import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

// Stripe Price IDs for each pack size
const PRICE_IDS: Record<number, string> = {
  6:  "price_1TixHPCgpQuNuXV3SYz4i3Bl",
  12: "price_1TixPLCgpQuNuXV3k7zXT2nJ",
  18: "price_1TixaWCgpQuNuXV35vGtlYZT",
  24: "price_1TixhuCgpQuNuXV3hM2fS1Nd",
  30: "price_1TixmrCgpQuNuXV3DNiQFD1u",
  36: "price_1TixuGCgpQuNuXV3Gw6o6njr",
  42: "price_1TixyWCgpQuNuXV3J8Zs7w4B",
  48: "price_1Tiy18CgpQuNuXV3kVeM8p0A",
  54: "price_1Tiy4PCgpQuNuXV3KkH9s3ck",
  60: "price_1Tiy87CgpQuNuXV3McMqZGV7",
};

// Shipping rates per pack size in cents
const SHIPPING_RATES: Record<number, number> = {
  6:  350,   // $3.50
  12: 500,   // $5.00
  18: 650,   // $6.50
  24: 650,   // $6.50
  30: 850,   // $8.50
  36: 850,   // $8.50
  42: 850,   // $8.50
  48: 1000,  // $10.00
  54: 1000,  // $10.00
  60: 1000,  // $10.00
};

const PROMO_THRESHOLD = 2000; // $20.00 in cents
const PROMO_CODE_NAME = "SUMRCOOKIE";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { lineItems } = await req.json();

    if (!lineItems || lineItems.length === 0) {
      return new Response(JSON.stringify({ error: "No items in cart" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Calculate subtotal in cents
    const subtotalCents = lineItems.reduce((sum: number, item: any) => {
      return sum + Math.round(item.price * 100) * item.qty;
    }, 0);

    // Always charge actual shipping - use highest rate in cart
    const maxShippingCents = Math.max(
      ...lineItems.map((item: any) => SHIPPING_RATES[item.pack] || 1000)
    );

    // Check if order qualifies for 20% promo
    const qualifiesForPromo = subtotalCents >= PROMO_THRESHOLD;

    // Create shipping rate in Stripe - always charge shipping
    const shippingRate = await stripe.shippingRates.create({
      display_name: "Standard Shipping (3-5 business days)",
      type: "fixed_amount",
      fixed_amount: {
        amount: maxShippingCents,
        currency: "usd",
      },
      delivery_estimate: {
        minimum: { unit: "business_day", value: 3 },
        maximum: { unit: "business_day", value: 5 },
      },
    });

    // Build Stripe line items using actual Price IDs
    const stripeLineItems = lineItems.map((item: any) => ({
      price: PRICE_IDS[item.pack],
      quantity: item.qty,
    }));

    // Build session params
    const sessionParams: any = {
      mode: "payment",
      line_items: stripeLineItems,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: [
        { shipping_rate: shippingRate.id },
      ],
      success_url: `${Deno.env.get("SITE_URL") || "https://byheatherjaney.com"}`,
      cancel_url: `${Deno.env.get("SITE_URL") || "https://byheatherjaney.com"}`,
      metadata: {
        source: "cookie_cart",
        qualifies_for_promo: qualifiesForPromo ? "true" : "false",
      },
    };

    if (qualifiesForPromo) {
      // Look up the promotion code ID by code name
      try {
        const promoCodes = await stripe.promotionCodes.list({ code: PROMO_CODE_NAME, active: true, limit: 1 });
        if (promoCodes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }];
        } else {
          sessionParams.allow_promotion_codes = true;
        }
      } catch {
        sessionParams.allow_promotion_codes = true;
      }
    } else {
      sessionParams.allow_promotion_codes = true;
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });

  } catch (err) {
    console.error("Cookie checkout error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
});
