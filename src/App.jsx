import { useState, useEffect } from "react";

// ── Color Palette ─────────────────────────────────────────────────────────────
// Emerald: #50C878 / #3DDC84
// Gold:    #B8860B / #DAA520
// Purple:  #4A1B6B / #7B3FA0
// Cream:   #FEFAF0
// Dark:    #0F1A0F

const PAGES = ["Home", "Menu", "About", "Contact"];

const services = [
  {
    emoji: "🥗",
    title: "Meal Prep",
    description: "Fresh, healthy meals prepared weekly and delivered to your door. Eat well without the stress of cooking every night.",
    color: "linear-gradient(160deg, #4A1B6B 0%, #6B2E8A 100%)",
    tag: "Weekly Plans Available",
  },
  {
    emoji: "🍽️",
    title: "Catering",
    description: "From intimate gatherings to large corporate events, Heather crafts custom menus that leave lasting impressions.",
    color: "linear-gradient(160deg, #5A2280 0%, #1A7A5E 100%)",
    tag: "Custom Menus Available",
  },
  {
    emoji: "🕯️",
    title: "Private Dinners",
    description: "An exclusive chef's table experience in the comfort of your own home. Custom menus, plated service, unforgettable evenings.",
    color: "linear-gradient(160deg, #1A7A5E 0%, #50C878 100%)",
    tag: "By Appointment",
  },
];

const testimonials = [
  { name: "Greg K.", text: "Chef Heather is exceptionally talented and client-focused. She's created many exceptional meals for our family, and also catered in-home events. She has a great attention to detail, and her food is delicious! Highly recommended!", stars: 5 },
  { name: "Alex S.", text: "If I could give 6 stars, I would. Heather is the best! Her food is absolutely delicious and she is a dream to work with. She always gets what I'm looking for and delivers it perfectly!", stars: 5 },
  { name: "Ms. Lindor", text: "The food is absolutely amazing and delicious. Heather is also professional and a life saver! Heather was able to prepare meals for me for the entire week. I can't wait to receive my next order!", stars: 5 },
  { name: "Robinson R.", text: "Chef Heather Janey is a master of the culinary arts world! Everything I've ordered comes out EXACTLY how I WANTED! I recommend this chef to anyone who's a foodie! Will be ordering soon again!", stars: 5 },
];

export default function FlavorFuzionWebsite() {
  const [activePage, setActivePage] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#FEFAF0", color: "#0F1A0F", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }

        body { overflow-x: hidden; }

        .nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FEFAF0;
          cursor: pointer;
          padding: 6px 0;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s, color 0.2s;
          text-decoration: none;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
        }
        .nav-link:hover { border-bottom-color: #B8860B; color: #DAA520; }
        .nav-link.active { border-bottom-color: #B8860B; color: #DAA520; }

        .btn-primary {
          background: linear-gradient(135deg, #8B6914 0%, #DAA520 30%, #F5D060 50%, #DAA520 70%, #8B6914 100%);
          color: #0F1A0F;
          border: none;
          padding: 14px 32px;
          border-radius: 100px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-block;
          text-decoration: none;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.4); }

        .btn-outline {
          background: transparent;
          color: #DAA520;
          border: 2px solid #DAA520;
          padding: 13px 32px;
          border-radius: 100px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-block;
          text-decoration: none;
        }
        .btn-outline:hover { background: linear-gradient(135deg, #8B6914 0%, #DAA520 30%, #F5D060 50%, #DAA520 70%, #8B6914 100%); color: #0F1A0F; border-color: transparent; box-shadow: 0 8px 24px rgba(218,165,32,0.5); transform: translateY(-2px); }

        .service-card:first-child { border-radius: 24px 0 0 24px; }
        .service-card:last-child { border-radius: 0 24px 24px 0; }
        .service-card { border-radius: 0;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .service-card:hover { transform: translateY(-8px); box-shadow: 0 32px 80px rgba(0,0,0,0.15); }

        .gold {
          background: linear-gradient(135deg, #8B6914 0%, #DAA520 25%, #F5D060 50%, #DAA520 75%, #8B6914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gold-stars {
          background: linear-gradient(135deg, #DAA520, #F5D060, #DAA520);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-tag {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #8B6914 0%, #DAA520 25%, #F5D060 50%, #DAA520 75%, #8B6914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          display: block;
        }

        .playfair { font-family: 'Playfair Display', serif; }
        .jost { font-family: 'Jost', sans-serif; }

        .testimonial-card {
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #EEE8DF;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #D4C9B8;
          border-radius: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          color: #0F1A0F;
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 16px;
        }
        .form-input:focus { border-color: #50C878; }

        .divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #50C878, #B8860B);
          border-radius: 100px;
          margin: 16px 0 32px;
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(80,200,120,0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(123,63,160,0.1) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(218,165,32,0.12) 0%, transparent 40%);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.8s ease 0.4s both; }
        .fade-up-4 { animation: fadeUp 0.8s ease 0.6s both; }

        @media (max-width: 768px) {
          .hero-title { font-size: 52px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navigation ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(15,26,15,0.96)" : "#0F1A0F",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none",
        padding: "0 80px",
        height: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s",
      }}>
        <div onClick={() => setActivePage("Home")} style={{ cursor: "pointer" }}>
          <img
            src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/noBgColor.png"
            alt="Flavor Fuzion by Heather Janey"
            style={{ height: "52px", width: "auto", display: "block", objectFit: "contain" }}
          />
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          {PAGES.map((page) => (
            <button key={page} className={`nav-link ${activePage === page ? "active" : ""}`}
              onClick={() => setActivePage(page)}>
              {page}
            </button>
          ))}
          <button className="btn-primary" style={{ padding: "10px 24px", fontSize: "12px" }}
            onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>
            Order Now
          </button>
        </div>
      </nav>

      {/* ── Install Banner ── */}
      {showInstallBanner && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%",
          transform: "translateX(-50%)",
          background: "#0F1A0F",
          border: "1px solid rgba(218,165,32,0.4)",
          borderRadius: "16px",
          padding: "16px 24px",
          display: "flex", alignItems: "center", gap: "16px",
          zIndex: 200,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          maxWidth: "480px", width: "90%",
        }}>
          <img src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/noBgColor.png"
            alt="" style={{ width: "44px", height: "44px", objectFit: "contain", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="jost" style={{ fontSize: "13px", fontWeight: 600, color: "#FEFAF0", marginBottom: "2px" }}>Add Flavor Fuzion to your phone</div>
            <div className="jost" style={{ fontSize: "11px", color: "#A0C8A8" }}>Install for quick access, no App Store needed!</div>
          </div>
          <button onClick={handleInstall} style={{ background: "linear-gradient(135deg, #8B6914 0%, #DAA520 30%, #F5D060 50%, #DAA520 70%, #8B6914 100%)", color: "#0F1A0F", border: "none", borderRadius: "100px", padding: "8px 18px", fontFamily: "'Jost', sans-serif", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            Install ↓
          </button>
          <button onClick={() => setShowInstallBanner(false)} style={{ background: "none", border: "none", color: "#A0C8A8", cursor: "pointer", fontSize: "18px", padding: "0", flexShrink: 0 }}>✕</button>
        </div>
      )}

      {/* ── Pages ── */}
      <div style={{ paddingTop: "72px" }}>

        {/* ════════════════════════════════════════════════════
            HOME PAGE
        ════════════════════════════════════════════════════ */}
        {activePage === "Home" && (
          <div>
            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg, #50C878 0%, #4A1B6B 100%)",
              minHeight: "92vh",
              position: "relative",
              display: "flex", alignItems: "center",
              overflow: "hidden",
            }}>
              <div className="hero-pattern" />

              {/* Symbol Watermark Left */}
              <img
                src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/symbol.svg"
                alt=""
                style={{
                  position: "absolute",
                  left: "120px", top: "50%",
                  transform: "translateY(-50%)",
                  width: "420px", height: "auto",
                  opacity: 0.08,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 1,
                }}
              />
              {/* Symbol Watermark Right */}
              <img
                src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/symbol.svg"
                alt=""
                style={{
                  position: "absolute",
                  right: "120px", top: "50%",
                  transform: "translateY(-50%)",
                  width: "420px", height: "auto",
                  opacity: 0.08,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 1,
                }}
              />

              <div style={{ position: "relative", zIndex: 2, padding: "80px 80px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span className="section-tag fade-up">Food is Life, Life is Good</span>
                <h1 className="playfair hero-title fade-up-2" style={{
                  fontSize: "80px", fontWeight: 700,
                  color: "#FEFAF0", lineHeight: 1.05,
                  letterSpacing: "-0.02em", marginBottom: "24px",
                }}>
                  Bold flavors,<br />
                  <em className="gold">made with love</em>
                </h1>
                <p className="jost fade-up-3" style={{
                  fontSize: "17px", color: "#FEFAF0",
                  lineHeight: 1.8, maxWidth: "560px", marginBottom: "40px",
                  fontWeight: 400,
                }}>
                  Chef Heather Janey brings bold, worldly flavors to your table in the Boston and South Shore Massachusetts areas, Feel Good Food made with love, for every occasion.
                </p>
                <div className="fade-up-4" style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                  <button className="btn-primary"
                    onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>
                    Browse the Menu
                  </button>
                  <button className="btn-outline" onClick={() => setActivePage("About")}>
                    Meet Heather
                  </button>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "48px", marginTop: "72px", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }}>
                  {[["500+", "Meals Prepped"], ["100+", "Events Catered"]].map(([num, label]) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div className="playfair gold" style={{ fontSize: "36px", fontWeight: 700 }}>{num}</div>
                      <div className="jost" style={{ fontSize: "12px", color: "#A0C8A8", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>{label}</div>
                    </div>
                  ))}
                  <div style={{ textAlign: "center" }}>
                    <div className="playfair gold" style={{ fontSize: "36px", fontWeight: 700 }}>5.0 ★★★★★</div>
                    <div className="jost" style={{ fontSize: "12px", color: "#A0C8A8", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>on Google</div>
                  </div>
                </div>
              </div>
            </div>


            {/* Parallax Image 1 - Food Spread */}
            <div style={{
              height: "400px",
              backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }} />
            {/* Services Section */}
            <div style={{ padding: "100px 80px", background: "#FEFAF0" }}>
              <div>
              <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <span className="section-tag">What We Offer</span>
                <h2 className="playfair" style={{ fontSize: "48px", fontWeight: 600, lineHeight: 1.2 }}>
                  A culinary experience<br /><em>for every occasion</em>
                </h2>
                <div className="divider" style={{ margin: "16px auto 0" }} />
              </div>

              <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
                {services.map((s) => (
                  <div key={s.title} className="service-card"
                    style={{ background: s.color }}>
                    <div style={{ padding: "48px 36px" }}>
                      <div style={{ fontSize: "48px", marginBottom: "20px" }}>{s.emoji}</div>
                      <div className="jost" style={{
                        display: "inline-block", background: "rgba(255,255,255,0.15)",
                        color: "#fff", padding: "4px 12px", borderRadius: "100px",
                        fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em",
                        textTransform: "uppercase", marginBottom: "16px",
                      }}>{s.tag}</div>
                      <h3 className="playfair" style={{ fontSize: "28px", fontWeight: 600, color: "#fff", marginBottom: "14px" }}>{s.title}</h3>
                      <p className="jost" style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontWeight: 300 }}>{s.description}</p>
                      <button onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}
                        style={{
                          marginTop: "28px",
                          background: "linear-gradient(135deg, #8B6914 0%, #DAA520 30%, #F5D060 50%, #DAA520 70%, #8B6914 100%)",
                          color: "#0F1A0F", border: "none",
                          padding: "10px 20px", borderRadius: "100px",
                          fontFamily: "'Jost', sans-serif", fontSize: "12px",
                          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                          cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
                          boxShadow: "0 4px 16px rgba(218,165,32,0.4)",
                        }}
                        onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(218,165,32,0.6)"; }}
                        onMouseOut={(e) => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 4px 16px rgba(218,165,32,0.4)"; }}>
                        Order Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>


            {/* Parallax Image 2 - Fine Dining */}
            <div style={{
              height: "400px",
              backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }} />
            {/* Tagline Banner */}
            <div style={{
              background: "linear-gradient(135deg, #50C878 0%, #4A1B6B 100%)",
              padding: "80px 40px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "relative", zIndex: 1 }}>
              <div className="playfair" style={{ fontSize: "48px", fontWeight: 400, color: "#FEFAF0", fontStyle: "italic", marginBottom: "16px" }}>
                "Food is Life, Life is Good"
              </div>
              <div className="jost" style={{ fontSize: "14px", color: "rgba(254,250,240,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
               , Heather Janey
              </div>
              </div>
            </div>


            {/* Parallax Image 3 - Meal Prep */}
            <div style={{
              height: "400px",
              backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }} />
            {/* Testimonials */}
            <div style={{ padding: "100px 80px", background: "#0F1A0F" }}>
              <div>
              <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <span className="section-tag">What People Say</span>
                <h2 className="playfair" style={{ fontSize: "48px", fontWeight: 600, color: "#FEFAF0" }}>
                  Loved by every <em>table</em>
                </h2>
                <div className="divider" style={{ margin: "16px auto 0" }} />
              </div>
              <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                {testimonials.map((t) => (
                  <div key={t.name} className="testimonial-card">
                    <div className="gold-stars" style={{ fontSize: "20px", marginBottom: "16px" }}>{"★".repeat(t.stars)}</div>
                    <p className="jost" style={{ fontSize: "15px", color: "#3D3020", lineHeight: 1.7, fontStyle: "italic", marginBottom: "20px", fontWeight: 300 }}>"{t.text}"</p>
                    <div className="jost" style={{ fontSize: "13px", fontWeight: 600, color: "#50C878", letterSpacing: "0.06em" }}>, {t.name}</div>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* CTA Section */}
            <div style={{ background: "linear-gradient(135deg, #50C878 0%, #4A1B6B 100%)", padding: "100px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <img src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/symbol.svg"
                alt="" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "480px", height: "auto", opacity: 0.06, pointerEvents: "none", userSelect: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
              <span className="section-tag">Ready to Order?</span>
              <h2 className="playfair" style={{ fontSize: "52px", fontWeight: 600, color: "#FEFAF0", marginBottom: "20px" }}>
                Let's create something<br /><em className="gold">delicious together</em>
              </h2>
              <p className="jost" style={{ fontSize: "16px", color: "#A0C8A8", marginBottom: "40px", fontWeight: 300 }}>
                Browse the full menu and place your order online.
              </p>
              <button className="btn-primary" style={{ fontSize: "14px", padding: "16px 40px" }}
                onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>
                Visit the Menu & Order
              </button>
              </div>
            </div>

            {/* Add to Phone Section */}
            <div style={{ background: "#0F1A0F", padding: "80px 80px", textAlign: "center", borderTop: "1px solid rgba(218,165,32,0.2)" }}>
              <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📱</div>
                <span className="section-tag">No App Store Needed</span>
                <h2 className="playfair" style={{ fontSize: "40px", fontWeight: 600, color: "#FEFAF0", marginBottom: "16px" }}>
                  Add us to your <em className="gold">home screen</em>
                </h2>
                <p className="jost" style={{ fontSize: "15px", color: "#A0C8A8", lineHeight: 1.8, marginBottom: "32px", fontWeight: 300 }}>
                  Get instant access to Flavor Fuzion right from your phone, just like a real app, completely free!
                </p>

                {/* Instructions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "36px", textAlign: "left" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(218,165,32,0.2)" }}>
                    <div style={{ fontSize: "28px", marginBottom: "10px" }}>🍎</div>
                    <div className="jost" style={{ fontSize: "13px", fontWeight: 600, color: "#DAA520", marginBottom: "8px", letterSpacing: "0.06em" }}>iPhone / iPad</div>
                    <ol style={{ paddingLeft: "16px", listStyleType: "decimal" }}>
                      {["Open in Safari", "Tap the Share button ↑", "Tap \"Add to Home Screen\"", "Tap \"Add\", done!"].map((step) => (
                        <li key={step} className="jost" style={{ fontSize: "13px", color: "#A0C8A8", marginBottom: "4px", fontWeight: 300 }}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(218,165,32,0.2)" }}>
                    <div style={{ fontSize: "28px", marginBottom: "10px" }}>🤖</div>
                    <div className="jost" style={{ fontSize: "13px", fontWeight: 600, color: "#DAA520", marginBottom: "8px", letterSpacing: "0.06em" }}>Android</div>
                    <ol style={{ paddingLeft: "16px", listStyleType: "decimal" }}>
                      {["Open in Chrome", "Tap the menu ⋮", "Tap \"Add to Home Screen\"", "Tap \"Add\", done!"].map((step) => (
                        <li key={step} className="jost" style={{ fontSize: "13px", color: "#A0C8A8", marginBottom: "4px", fontWeight: 300 }}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {installPrompt && (
                  <button onClick={handleInstall} style={{ background: "linear-gradient(135deg, #8B6914 0%, #DAA520 30%, #F5D060 50%, #DAA520 70%, #8B6914 100%)", color: "#0F1A0F", border: "none", borderRadius: "100px", padding: "14px 36px", fontFamily: "'Jost', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", boxShadow: "0 8px 24px rgba(218,165,32,0.4)" }}>
                    ↓ Install Flavor Fuzion
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            MENU PAGE
        ════════════════════════════════════════════════════ */}
        {activePage === "Menu" && (
          <div>
            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg, #50C878 0%, #4A1B6B 100%)",
              padding: "100px 40px 80px",
              textAlign: "center",
            }}>
              <span className="section-tag">Fresh & Seasonal</span>
              <h1 className="playfair" style={{ fontSize: "64px", fontWeight: 700, color: "#FEFAF0", marginBottom: "20px" }}>
                Our <em className="gold">Menu</em>
              </h1>
              <p className="jost" style={{ fontSize: "16px", color: "rgba(254,250,240,0.75)", maxWidth: "500px", margin: "0 auto 40px", fontWeight: 300, lineHeight: 1.7 }}>
                Heather's menu changes weekly to feature the freshest seasonal ingredients. Browse everything and place your order online.
              </p>
              <button className="btn-primary" style={{ fontSize: "14px", padding: "16px 40px" }}
                onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>
                Browse Full Menu & Order →
              </button>
            </div>


            {/* Parallax Image 1 - Food Spread */}
            <div style={{
              height: "400px",
              backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }} />
            {/* Service Categories */}
            <div style={{ padding: "80px 80px", background: "#FEFAF0" }}>
              <div>
              <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <span className="section-tag">What's Available</span>
                <h2 className="playfair" style={{ fontSize: "44px", fontWeight: 600 }}>
                  Something for <em>every appetite</em>
                </h2>
                <div className="divider" style={{ margin: "16px auto 0" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px" }}>
                {[
                  { title: "Meal Prep", desc: "Weekly meals planned and prepped for you. Pick your proteins, sides, and dietary needs. Delivered fresh.", emoji: "🥗", color: "#50C878", items: ["Herb-Crusted Salmon Bowl", "Mediterranean Chicken", "Vegan Lentil Curry", "And more weekly specials…"] },
                  { title: "Catering", desc: "Full-service catering for any size event. BBQ feasts, elegant brunches, taco bars and more.", emoji: "🍽️", color: "#4A1B6B", items: ["BBQ Feast Package", "Elegant Brunch Spread", "Taco & Tequila Bar", "Custom menus available"] },
                  { title: "Private Dinners", desc: "An intimate chef's table experience at home. Multi-course tasting menus designed just for you.", emoji: "🕯️", color: "#7A5C0A", items: ["Date Night for Two", "Dinner Party Experience", "Custom tasting menus", "Wine pairing available"] },
                  { title: "Combos & Deals", desc: "Save more with our combo meal prep packages. Mix and match entrées and sides at a discount.", emoji: "💎", color: "#0A2018", items: ["3 Entrées + 3 Sides (5% off)", "4 Entrées + 4 Sides (6% off)", "5 Entrées + 5 Sides (7% off)", "Build your own combo"] },
                ].map((cat) => (
                  <div key={cat.title} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", border: "1px solid #EEE8DF", transition: "transform 0.3s, box-shadow 0.3s" }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.1)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ background: cat.color, padding: "32px 28px" }}>
                      <div style={{ fontSize: "40px", marginBottom: "12px" }}>{cat.emoji}</div>
                      <h3 className="playfair" style={{ fontSize: "26px", fontWeight: 600, color: "#fff" }}>{cat.title}</h3>
                    </div>
                    <div style={{ padding: "24px 28px" }}>
                      <p className="jost" style={{ fontSize: "14px", color: "#6B5E4E", lineHeight: 1.6, marginBottom: "16px", fontWeight: 300 }}>{cat.desc}</p>
                      <ul style={{ listStyle: "none", marginBottom: "20px" }}>
                        {cat.items.map((item) => (
                          <li key={item} className="jost" style={{ fontSize: "13px", color: "#3D3020", padding: "4px 0", borderBottom: "1px solid #F5F0E8", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="gold" style={{ fontSize: "10px" }}>◆</span> {item}
                          </li>
                        ))}
                      </ul>
                      <button className="btn-primary" style={{ width: "100%", textAlign: "center", fontSize: "12px", padding: "12px" }}
                        onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>
                        Order Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Note */}
            <div style={{ padding: "60px 80px", textAlign: "center", background: "#F5F0E8" }}>
              <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>📅</div>
                <h3 className="playfair" style={{ fontSize: "28px", fontWeight: 600, marginBottom: "12px" }}>Menu changes weekly</h3>
                <p className="jost" style={{ fontSize: "15px", color: "#6B5E4E", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>
                  Heather updates her menu every week based on seasonal availability and customer favorites. Visit the ordering app to see what's fresh this week!
                </p>
                <button className="btn-primary"
                  onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>
                  See This Week's Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ABOUT PAGE
        ════════════════════════════════════════════════════ */}
        {activePage === "About" && (
          <div>
            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg, #4A1B6B 0%, #0F1A0F 100%)",
              padding: "100px 40px 80px",
            }}>
              <div style={{ padding: "0" }}>
                <span className="section-tag">The Chef Behind the Magic</span>
                <h1 className="playfair" style={{ fontSize: "64px", fontWeight: 700, color: "#FEFAF0" }}>
                  Meet <em className="gold">Heather</em>
                </h1>
              </div>
            </div>


            {/* Parallax Image - Cooking */}
            <div style={{
              height: "400px",
              backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }} />
            {/* About Content */}
            <div style={{ padding: "80px 80px", background: "#FEFAF0" }}>
              <div>
              <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
                {/* Heather's Photo */}
                <div style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  aspectRatio: "3/4",
                }}>
                  <img
                    src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/FB_IMG_1558214697556.jpg"
                    alt="Chef Heather Janey"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>

                {/* Story */}
                <div>
                  <span className="section-tag">My Story</span>
                  <h2 className="playfair" style={{ fontSize: "40px", fontWeight: 600, marginBottom: "12px", lineHeight: 1.2 }}>
                    Cooking has always been<br /><em>my love language</em>
                  </h2>
                  <div className="divider" />
                  <p className="jost" style={{ fontSize: "15px", color: "#4A3728", lineHeight: 1.8, marginBottom: "20px", fontWeight: 300 }}>
                    I'm Heather Janey, a personal chef and caterer based in the Boston and South Shore Massachusetts areas with a passion for creating healthy, eclectic dishes bursting with big, bold flavors that truly satisfy the soul. Flavor Fuzion was first cooked up in 2016 in New York City, born from a simple but powerful belief: that food made with love has the power to bring people together. Since then, my "Feel Good Food" philosophy has been growing stronger every single day.
                  </p>
                  <p className="jost" style={{ fontSize: "15px", color: "#4A3728", lineHeight: 1.8, marginBottom: "20px", fontWeight: 300 }}>
                    My style of cooking is a direct reflection of who I am, beautifully diverse. I'm African American and Italian, with a little Irish and a dash of Scottish thrown in for good measure. Growing up, my kitchen was a cultural adventure: my mother's traditional Italian and Irish recipes on one side, and my dad's family's finger-licking good Soul Food on the other. Even as a baby I was never shy about trying new flavors, I preferred lobster over Gerber! 🦞
                  </p>
                  <p className="jost" style={{ fontSize: "15px", color: "#4A3728", lineHeight: 1.8, marginBottom: "32px", fontWeight: 300 }}>
                    At its heart, Flavor Fuzion was born from my love of the unique. I draw inspiration from ingredients and culinary traditions from all over the world, fusing regional flavors together in ways that are unexpected, exciting, and deeply satisfying. I consider myself an <em>Interpretive Chef</em>, dedicated to giving every client a one-of-a-kind, worldly inspired, boldly flavored experience they won't soon forget. Thank you for visiting, we can't wait to cook in your kitchen! 🍽️
                  </p>
                  <button className="btn-primary" onClick={() => setActivePage("Contact")}>
                    Work With Me →
                  </button>
                </div>
              </div>
              </div>
            </div>


            {/* Parallax Image - Kitchen */}
            <div style={{
              height: "400px",
              backgroundImage: "url('https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }} />
            {/* Values */}
            <div style={{ padding: "80px 80px", background: "#F5F0E8" }}>
              <div>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                  <span className="section-tag">What I Stand For</span>
                  <h2 className="playfair" style={{ fontSize: "44px", fontWeight: 600 }}>
                    My <em>philosophy</em>
                  </h2>
                  <div className="divider" style={{ margin: "16px auto 0" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "32px" }}>
                  {[
                    { emoji: "🌿", title: "Fresh Ingredients", desc: "I source seasonal, high-quality ingredients from local markets whenever possible." },
                    { emoji: "❤️", title: "Made with Love", desc: "Every dish is prepared with care and intention, you can taste the difference." },
                    { emoji: "✨", title: "Creative Cuisine", desc: "I blend bold flavors and unexpected combinations to create memorable experiences." },
                    { emoji: "🤝", title: "Personal Service", desc: "I work closely with every client to understand their tastes and needs." },
                  ].map((v) => (
                    <div key={v.title} style={{ textAlign: "center", padding: "32px 20px" }}>
                      <div style={{ fontSize: "40px", marginBottom: "16px" }}>{v.emoji}</div>
                      <h3 className="playfair" style={{ fontSize: "20px", fontWeight: 600, marginBottom: "10px" }}>{v.title}</h3>
                      <p className="jost" style={{ fontSize: "14px", color: "#6B5E4E", lineHeight: 1.6, fontWeight: 300 }}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: "#0F1A0F", padding: "80px 40px", textAlign: "center" }}>
              <h2 className="playfair" style={{ fontSize: "44px", fontWeight: 600, color: "#FEFAF0", marginBottom: "16px" }}>
                Ready to experience<br /><em className="gold">Flavor Fuzion?</em>
              </h2>
              <p className="jost" style={{ fontSize: "15px", color: "#A0C8A8", marginBottom: "32px", fontWeight: 300 }}>
                Let's create something delicious together.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>Order Now</button>
                <button className="btn-outline" onClick={() => setActivePage("Contact")}>Get in Touch</button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            CONTACT PAGE
        ════════════════════════════════════════════════════ */}
        {activePage === "Contact" && (
          <div>
            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg, #7A5C0A 0%, #0F1A0F 100%)",
              padding: "100px 40px 80px",
            }}>
              <div style={{ padding: "0" }}>
                <span className="section-tag">Let's Connect</span>
                <h1 className="playfair" style={{ fontSize: "64px", fontWeight: 700, color: "#FEFAF0" }}>
                  Get in <em className="gold">Touch</em>
                </h1>
                <p className="jost" style={{ fontSize: "16px", color: "rgba(254,250,240,0.7)", maxWidth: "500px", marginTop: "16px", fontWeight: 300, lineHeight: 1.7 }}>
                  Have a question about catering, meal prep, or a private dinner? Heather would love to hear from you.
                </p>
              </div>
            </div>

            {/* Contact Content */}
            <div style={{ padding: "80px 80px" }}>
              <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>

                {/* Contact Info */}
                <div>
                  <span className="section-tag">Contact Information</span>
                  <h2 className="playfair" style={{ fontSize: "36px", fontWeight: 600, marginBottom: "12px" }}>
                    We'd love to <em>hear from you</em>
                  </h2>
                  <div className="divider" />

                  <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "40px" }}>
                    {[
                      { emoji: "📧", label: "Email", value: "FlavorFuzionbyHJ@gmail.com" },
                      { emoji: "🌐", label: "Website", value: "byheatherjaney.com" },
                      { emoji: "📍", label: "Service Area", value: "Available for local & destination events" },
                      { emoji: "⏰", label: "Response Time", value: "Within 24 hours" },
                    ].map((info) => (
                      <div key={info.label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "12px",
                          background: "linear-gradient(135deg, #50C878, #4A1B6B)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "20px", flexShrink: 0,
                        }}>{info.emoji}</div>
                        <div>
                          <div className="jost" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B5A48C", marginBottom: "4px" }}>{info.label}</div>
                          <div className="jost" style={{ fontSize: "15px", color: "#2A1A0A", fontWeight: 400 }}>{info.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order CTA */}
                  <div style={{ background: "linear-gradient(135deg, #50C878, #4A1B6B)", borderRadius: "20px", padding: "32px" }}>
                    <div className="playfair" style={{ fontSize: "22px", fontWeight: 600, color: "#FEFAF0", marginBottom: "8px" }}>
                      Ready to order?
                    </div>
                    <p className="jost" style={{ fontSize: "13px", color: "rgba(254,250,240,0.75)", marginBottom: "20px", fontWeight: 300, lineHeight: 1.6 }}>
                      Browse the full menu and place your order directly through our online ordering app.
                    </p>
                    <button className="btn-primary"
                      onClick={() => window.open("https://flavor-fuzion.vercel.app", "_blank")}>
                      Go to Ordering App →
                    </button>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <span className="section-tag">Send a Message</span>
                  <h2 className="playfair" style={{ fontSize: "36px", fontWeight: 600, marginBottom: "12px" }}>
                    Have a <em>question?</em>
                  </h2>
                  <div className="divider" />

                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "#0A120A", padding: "60px 80px 32px", borderTop: "1px solid rgba(201,168,76,0.2)", position: "relative", overflow: "hidden" }}>
        <img src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/symbol.svg"
          alt="" style={{ position: "absolute", bottom: "-20px", right: "40px", width: "300px", height: "auto", opacity: 0.06, pointerEvents: "none", userSelect: "none" }} />
        <div style={{ padding: "0" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "60px", marginBottom: "48px" }}>
            <div>
              <img
                src="https://vqhhwukvheezunccehzm.supabase.co/storage/v1/object/public/Menu%20Items/noBgColor.png"
                alt="Flavor Fuzion by Heather Janey"
                style={{ height: "60px", width: "auto", display: "block", objectFit: "contain", marginBottom: "16px" }}
              />
              <p className="jost" style={{ fontSize: "13px", color: "#A0C8A8", lineHeight: 1.7, fontWeight: 300, maxWidth: "280px" }}>
                Professional personal chef services including meal prep, catering, private dinners, and cooking lessons.
              </p>
            </div>
            <div>
              <div className="jost" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }} className="gold jost" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Navigation</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {PAGES.map((page) => (
                  <button key={page} onClick={() => setActivePage(page)}
                    className="jost" style={{ background: "none", border: "none", color: "#A0C8A8", fontSize: "14px", cursor: "pointer", textAlign: "left", fontWeight: 300, transition: "color 0.2s", padding: 0 }}
                    onMouseOver={(e) => e.target.style.color = "#DAA520"}
                    onMouseOut={(e) => e.target.style.color = "#A0C8A8"}>
                    {page}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="jost" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }} className="gold jost" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Services</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Meal Prep", "Catering", "Private Dinners", "Cooking Lessons", "Combo Deals"].map((s) => (
                  <div key={s} className="jost" style={{ color: "#A0C8A8", fontSize: "14px", fontWeight: 300 }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(74,107,74,0.3)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div className="jost" style={{ fontSize: "12px", color: "#A0C8A8" }}>© 2026 Flavor Fuzion by Heather Janey. All rights reserved.</div>
            <div className="jost" style={{ fontSize: "12px", color: "#A0C8A8" }}>Food is Life, Life is Good 🍽️</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Contact Form Component ─────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    const mailto = `mailto:FlavorFuzionbyHJ@gmail.com?subject=${encodeURIComponent(form.subject || "Website Inquiry from " + form.name)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎉</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 600, marginBottom: "12px" }}>Thank you!</div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#6B5E4E", lineHeight: 1.7 }}>
          Your email client should have opened. If not, email Heather directly at<br />
          <strong>FlavorFuzionbyHJ@gmail.com</strong>
        </p>
      </div>
    );
  }

  return (
    <div>
      <input className="form-input" placeholder="Your Name *" value={form.name} onChange={(e) => set("name", e.target.value)} />
      <input className="form-input" type="email" placeholder="Your Email *" value={form.email} onChange={(e) => set("email", e.target.value)} />
      <input className="form-input" placeholder="Subject (e.g. Catering inquiry for 50 guests)" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
      <textarea className="form-input" placeholder="Your message *" rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} style={{ resize: "vertical" }} />
      <button className="btn-primary" style={{ width: "100%", fontSize: "14px", padding: "16px" }} onClick={handleSubmit}>
        Send Message →
      </button>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#B5A48C", textAlign: "center", marginTop: "12px" }}>
        This will open your email client. Heather responds within 24 hours.
      </p>
    </div>
  );
}
