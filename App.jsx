import React, { useState, useMemo } from "react";
import {
  ShoppingBag, X, Plus, Minus, Check, ChevronRight, Waves,
  Fish, Flower2, Gem, Heart, MapPin, Phone, Search
} from "lucide-react";

// ---------- Design tokens ----------
// Deep water navy, glass teal, sand, brick-clay accent — an aquarium-shop-meets-craft-market identity
const C = {
  deep: "#071A2B",
  deepDark: "#030D18",
  teal: "#39A8BE",
  tealLight: "#C9F3EE",
  sand: "#F3EAD9",
  sandDeep: "#E8DBC2",
  clay: "#C86645",
  clayDark: "#A94F35",
  ink: "#132025",
  cream: "#FBF7EF",
};

// ---------- Product data ----------
const CATEGORIES = [
  { id: "aquariums", label: "Aquariums", icon: Fish },
  { id: "soft-toys", label: "Soft Toys", icon: Heart },
  { id: "pots", label: "Pots", icon: Flower2 },
  { id: "resin", label: "Resin Items", icon: Gem },
];

const PRODUCTS = [
  // ---- Aquariums (real data) ----
  { id: "aq-1e", cat: "aquariums", name: "Aquarium 1 ft — Empty", price: 500, note: "Glass tank only" },
  { id: "aq-1c", cat: "aquariums", name: "Aquarium 1 ft — Complete Set", price: 1000, note: "5mm glass, full setup" },
  { id: "aq-15e", cat: "aquariums", name: "Aquarium 1.5 ft — Empty", price: 900, note: "Glass tank only" },
  { id: "aq-15c", cat: "aquariums", name: "Aquarium 1.5 ft — Complete Set", price: 2500, priceMax: 3000, note: "5mm glass, full setup" },
  { id: "aq-2e", cat: "aquariums", name: "Aquarium 2 ft — Empty", price: 1100, note: "Glass tank only" },
  { id: "aq-2c", cat: "aquariums", name: "Aquarium 2 ft — Complete Set", price: 4000, priceFrom: true, note: "5mm glass, full setup" },
  { id: "aq-3e", cat: "aquariums", name: "Aquarium 3 ft — Empty", price: 2500, note: "8mm glass tank only" },
  { id: "aq-3c", cat: "aquariums", name: "Aquarium 3 ft — Complete Set", price: 6000, priceFrom: true, note: "8mm glass, full setup" },

  // ---- Soft Toys (placeholder — replace with real catalog) ----
  { id: "st-1", cat: "soft-toys", name: "Teddy Bear — Small", price: 150, note: "Starting price · size varies" },
  { id: "st-2", cat: "soft-toys", name: "Teddy Bear — Medium", price: 280, note: "Placeholder — update price" },
  { id: "st-3", cat: "soft-toys", name: "Plush Bunny", price: 200, note: "Placeholder — update price" },
  { id: "st-4", cat: "soft-toys", name: "Cartoon Character Plush", price: 350, note: "Placeholder — update price" },

  // ---- Pots (placeholder) ----
  { id: "pt-1", cat: "pots", name: "Plastic Pot — Small", price: 15, note: "Starting price · varies by size & quality" },
  { id: "pt-2", cat: "pots", name: "Plastic Pot — Medium", price: 40, note: "Placeholder — update price" },
  { id: "pt-3", cat: "pots", name: "Ceramic Pot — Small", price: 120, note: "Placeholder — update price" },
  { id: "pt-4", cat: "pots", name: "Decorative Pot — Large", price: 250, note: "Placeholder — update price" },

  // ---- Resin Items (placeholder) ----
  { id: "rs-1", cat: "resin", name: "Resin Photo Frame", price: 300, note: "Starting price" },
  { id: "rs-2", cat: "resin", name: "Resin Keychain", price: 350, note: "Placeholder — update price" },
  { id: "rs-3", cat: "resin", name: "Resin Coaster Set", price: 450, note: "Placeholder — update price" },
  { id: "rs-4", cat: "resin", name: "Resin Table Decor", price: 600, note: "Placeholder — update price" },
];

const CAT_META = {
  aquariums: { icon: Fish, blurb: "Tanks built and glazed in-house, from a 1 ft starter to an 8mm-glass 3 footer." },
  "soft-toys": { icon: Heart, blurb: "Soft toys for every corner of the house, starting at ₹150." },
  pots: { icon: Flower2, blurb: "Plastic to ceramic, sized and priced for any plant." },
  resin: { icon: Gem, blurb: "Handmade resin pieces — frames, coasters, and table decor." },
};

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function priceLabel(p) {
  if (p.priceMax) return `${money(p.price)}–${money(p.priceMax)}`;
  if (p.priceFrom) return `Up to ${money(p.price)}`;
  return money(p.price);
}

// ---------- Product tile art (no real photos yet — abstract placeholder) ----------
function ProductArt({ cat }) {
  const grad = {
    aquariums: `linear-gradient(160deg, ${C.teal}, ${C.deep})`,
    "soft-toys": `linear-gradient(160deg, #E3A6A1, #B8695F)`,
    pots: `linear-gradient(160deg, #8FA876, ${C.deepDark})`,
    resin: `linear-gradient(160deg, #D9C08A, ${C.clayDark})`,
  }[cat];
  const Icon = CAT_META[cat].icon;
  return (
    <div
      style={{
        background: grad,
        aspectRatio: "4/3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", width: 70, height: 70, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.18)", top: -20, right: -20 }} />
      <div style={{ position: "absolute", width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)", bottom: -12, left: -12 }} />
      <Icon className="prodart-icon" size={34} color="rgba(255,255,255,0.9)" strokeWidth={1.4} />
    </div>
  );
}

export default function App() {
  const [activeCat, setActiveCat] = useState("aquariums");
  const [cart, setCart] = useState({}); // id -> qty
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart | details | done
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const byCat = PRODUCTS.filter((p) => p.cat === activeCat);
    if (!query.trim()) return byCat;
    return byCat.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeCat, query]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty })),
    [cart]
  );
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function changeQty(id, delta) {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) };
      return next;
    });
  }
  function openCart() {
    setCheckoutStep("cart");
    setCartOpen(true);
  }
  function placeOrder(e) {
    e.preventDefault();
    setCheckoutStep("done");
  }

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", color: C.ink, background: C.cream, minHeight: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .sg { font-family: 'Space Grotesk', sans-serif; }
        button { cursor: pointer; font-family: inherit; }
        .catbtn { transition: background .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease; }
        .catbtn:hover { border-color: ${C.teal} !important; transform: translateY(-2px); }
        .prodcard { transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
        .prodcard:hover { transform: translateY(-5px); box-shadow: 0 18px 38px rgba(4,24,42,0.16); border-color: rgba(57,168,190,0.45) !important; }
        .prodcard:hover .prodart-icon { transform: scale(1.12) rotate(-4deg); }
        .prodart-icon { transition: transform .3s ease; }
        .addbtn { transition: background .2s ease, transform .2s ease, box-shadow .2s ease; }
        .addbtn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(200,102,69,0.24); }
        input:focus, textarea:focus { outline: 2px solid ${C.teal}; outline-offset: 1px; }
        @keyframes floatBubble {
          0%   { transform: translateY(0) translateX(0); opacity: 0.28; }
          50%  { transform: translateY(-22px) translateX(6px); opacity: 0.72; }
          100% { transform: translateY(0) translateX(0); opacity: 0.28; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: .45; transform: scale(1); }
          50% { opacity: .75; transform: scale(1.06); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .bubble { position: absolute; border-radius: 50%; background: rgba(201,243,238,0.35); animation: floatBubble 6s ease-in-out infinite; pointer-events: none; }
        .heroUnderline { position: relative; display: inline-block; }
        .heroUnderline svg { position: absolute; left: 0; bottom: -6px; width: 100%; height: 10px; }
        .heroBadge { display:inline-flex; align-items:center; gap:8px; padding:7px 11px; border:1px solid rgba(201,243,238,.25); background:rgba(4,19,34,.42); border-radius:999px; backdrop-filter:blur(10px); box-shadow:0 8px 30px rgba(0,0,0,.12); }
        .heroGridCard { position:relative; overflow:hidden; transition:transform .25s ease, border-color .25s ease, background .25s ease; }
        .heroGridCard:hover { transform:translateY(-4px); border-color:rgba(201,243,238,.48) !important; background:rgba(7,26,43,.64) !important; }
        .heroGridCard:after { content:""; position:absolute; left:0; top:0; width:42%; height:1px; background:linear-gradient(90deg, transparent, rgba(201,243,238,.75), transparent); animation:shimmer 4.5s ease-in-out infinite; }
        .heroGlow { position:absolute; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle, rgba(92,45,180,.22), transparent 68%); filter:blur(8px); animation:glowPulse 7s ease-in-out infinite; pointer-events:none; }
        @media (max-width: 720px) {
          .heroGrid { grid-template-columns: 1fr !important; }
          .heroTitle { font-size: clamp(36px, 12vw, 54px) !important; }
          .heroCopy { max-width: 100% !important; }
        }
      `}</style>

      {/* ---------- Header ---------- */}
      <header style={{ background: "rgba(3,13,24,0.88)", color: C.cream, position: "sticky", top: 0, zIndex: 30, backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,243,238,0.10)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(57,168,190,0.14)", border: "1px solid rgba(201,243,238,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Waves size={21} color={C.tealLight} />
            </div>
            <div>
              <span className="sg" style={{ display: "block", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Aqua Dreamland</span>
              <span style={{ display: "block", fontSize: 10.5, color: "#83A9A8", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>Aquarium • Décor • More</span>
            </div>
          </div>
          <button
            onClick={openCart}
            style={{
              background: "linear-gradient(135deg, #43B6C7, #2F8F9E)", color: C.deepDark, border: "1px solid rgba(201,243,238,.18)", borderRadius: 11,
              padding: "10px 15px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, boxShadow: "0 8px 24px rgba(47,143,158,.18)"
            }}
            className="addbtn"
          >
            <ShoppingBag size={16} />
            Cart {cartCount > 0 ? `· ${cartCount}` : ""}
          </button>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: `linear-gradient(90deg, rgba(2,12,25,0.95) 0%, rgba(3,17,33,0.82) 35%, rgba(3,15,29,0.46) 66%, rgba(2,10,20,0.55) 100%), url("/betta-fish.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center 44%",
          color: C.cream,
          padding: "72px 20px 88px",
          minHeight: 620,
          isolation: "isolate",
        }}
      >
        <div className="heroGlow" style={{ top: -140, right: "12%" }} />
        <div className="bubble" style={{ width: 14, height: 14, top: "18%", left: "6%", animationDelay: "0s" }} />
        <div className="bubble" style={{ width: 9, height: 9, top: "62%", left: "11%", animationDelay: "1.2s" }} />
        <div className="bubble" style={{ width: 20, height: 20, top: "30%", left: "3%", animationDelay: "2.4s" }} />
        <div className="bubble" style={{ width: 12, height: 12, top: "75%", right: "8%", animationDelay: "0.8s" }} />
        <div className="bubble" style={{ width: 24, height: 24, top: "12%", right: "14%", animationDelay: "1.8s" }} />
        <div className="bubble" style={{ width: 8, height: 8, top: "45%", right: "4%", animationDelay: "3s" }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 44, alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ flex: "1 1 500px" }}>
            <div className="heroBadge">
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6EE7D4", boxShadow: "0 0 12px #6EE7D4" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: C.tealLight }}>
                Handpicked aquarium collection
              </span>
            </div>

            <p style={{ color: "#A9D8D4", fontWeight: 600, fontSize: 14, margin: "18px 0 12px", letterSpacing: "0.02em" }}>
              Aquariums · Soft Toys · Pots · Resin Décor
            </p>

            <h1 className="sg heroTitle" style={{ fontSize: "clamp(42px, 5.4vw, 68px)", lineHeight: 1.02, margin: 0, fontWeight: 700, letterSpacing: "-0.045em", maxWidth: 720 }}>
              Everything for your{" "}
              <span className="heroUnderline">
                tank
                <svg viewBox="0 0 120 10" preserveAspectRatio="none"><path d="M0,6 Q30,0 60,6 T120,6" fill="none" stroke="#D17A5B" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
              {" "}and everything around it.
            </h1>

            <p className="heroCopy" style={{ marginTop: 22, fontSize: 17, lineHeight: 1.7, color: "#C9DCD9", maxWidth: 570 }}>
              From a first 1-foot starter tank to a fully fitted 3-footer — plus the soft toys,
              pots, and resin pieces that finish a room. Built and picked by hand.
            </p>

            <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => { setActiveCat("aquariums"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}
                className="addbtn"
                style={{ background: "linear-gradient(135deg, #D47652, #B9583D)", color: C.cream, border: "1px solid rgba(255,255,255,.10)", borderRadius: 11, padding: "13px 21px", fontWeight: 700, fontSize: 15 }}
              >
                Shop Aquariums <ChevronRight size={16} style={{ verticalAlign: "middle", marginLeft: 4 }} />
              </button>
              <button
                onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "rgba(3,16,31,.34)", color: C.cream, border: "1px solid rgba(201,243,238,.28)", borderRadius: 11, padding: "13px 21px", fontWeight: 700, fontSize: 15, backdropFilter: "blur(8px)" }}
              >
                Browse All Products
              </button>
            </div>

            <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 32, color: "#9DBBB8", fontSize: 12.5 }}>
              <span><strong style={{ color: C.cream }}>1–3 ft</strong> aquarium sizes</span>
              <span><strong style={{ color: C.cream }}>₹500+</strong> starting tanks</span>
              <span><strong style={{ color: C.cream }}>Handpicked</strong> décor</span>
            </div>
          </div>

          <div style={{ flex: "1 1 390px", minWidth: 300 }}>
            <div className="heroGrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["aquariums", "soft-toys", "pots", "resin"].map((c) => {
                const Icon = CAT_META[c].icon;
                return (
                  <div key={c} className="heroGridCard" style={{ background: "rgba(4,18,34,0.50)", border: "1px solid rgba(201,243,238,0.20)", borderRadius: 14, padding: 17, backdropFilter: "blur(12px)", boxShadow: "0 14px 40px rgba(0,0,0,.16)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(57,168,190,.13)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={19} color={C.tealLight} />
                    </div>
                    <div className="sg" style={{ marginTop: 12, fontWeight: 700, fontSize: 15, textTransform: "capitalize" }}>
                      {c.replace("-", " ")}
                    </div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45, color: "#A9C6C2", marginTop: 5 }}>{CAT_META[c].blurb}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "radial-gradient(circle at 72% 48%, rgba(100,65,210,.13), transparent 34%)" }} />
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: 40, display: "block", zIndex: 3 }}>
          <path d="M0,20 C150,45 350,0 600,18 C850,36 1050,4 1200,20 L1200,40 L0,40 Z" fill={C.cream} />
        </svg>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section style={{ background: C.cream, padding: "6px 20px 34px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {[
            { icon: Fish, title: "Built in-house", sub: "Tanks glazed and fitted by hand" },
            { icon: Heart, title: "Picked with care", sub: "Every toy and piece hand-selected" },
            { icon: MapPin, title: "Shop it in person too", sub: "Visit the store, same range" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${C.sandDeep}`, borderRadius: 12, padding: "15px 16px", boxShadow: "0 8px 24px rgba(10,46,56,0.05)" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.sand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <f.icon size={17} color={C.clayDark} />
              </div>
              <div>
                <div className="sg" style={{ fontSize: 14, fontWeight: 600 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#8A8578" }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Shop ---------- */}
      <section id="shop" style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 20px 70px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  className="catbtn"
                  onClick={() => setActiveCat(c.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: active ? C.deep : "#fff",
                    color: active ? C.cream : C.deep,
                    border: `1px solid ${active ? C.deep : C.sandDeep}`,
                    borderRadius: 999, padding: "9px 16px", fontSize: 14, fontWeight: 500,
                    boxShadow: active ? "0 6px 14px rgba(10,46,56,0.18)" : "none",
                  }}
                >
                  <Icon size={15} />
                  {c.label}
                </button>
              );
            })}
          </div>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: 11, color: "#8A8578" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this category"
              style={{ border: `1px solid ${C.sandDeep}`, borderRadius: 8, padding: "9px 12px 9px 32px", fontSize: 14, width: 210, background: "#fff" }}
            />
          </div>
        </div>

        <p style={{ color: "#5B5A52", fontSize: 14.5, marginBottom: 22, maxWidth: 620 }}>
          {CAT_META[activeCat].blurb}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
          {filtered.map((p) => (
            <div key={p.id} className="prodcard" style={{ background: "#fff", border: `1px solid ${C.sandDeep}`, borderRadius: 10, overflow: "hidden" }}>
              <ProductArt cat={p.cat} />
              <div style={{ padding: 14 }}>
                <div className="sg" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 12.5, color: "#8A8578", marginTop: 4 }}>{p.note}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <span className="sg" style={{ fontSize: 16.5, fontWeight: 700, color: C.clayDark }}>{priceLabel(p)}</span>
                  {cart[p.id] ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => changeQty(p.id, -1)} style={{ background: C.sand, border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 14, textAlign: "center" }}>{cart[p.id]}</span>
                      <button onClick={() => changeQty(p.id, 1)} style={{ background: C.deep, border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={13} color="#fff" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="addbtn"
                      onClick={() => addToCart(p.id)}
                      style={{ background: C.deep, color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 600 }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer style={{ background: C.deepDark, color: "#A9C6C2", padding: "34px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Waves size={17} color={C.tealLight} />
            <span className="sg" style={{ color: C.cream, fontWeight: 600 }}>Aqua Dreamland</span>
          </div>
          <div style={{ display: "flex", gap: 22, fontSize: 13.5, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> Visit the shop in person</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> Add your contact number</span>
          </div>
        </div>
      </footer>

      {/* ---------- Cart Drawer ---------- */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(10,20,24,0.45)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(420px, 100%)", background: C.cream, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.sandDeep}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="sg" style={{ fontWeight: 700, fontSize: 17 }}>
                {checkoutStep === "cart" && "Your Cart"}
                {checkoutStep === "details" && "Delivery Details"}
                {checkoutStep === "done" && "Order Placed"}
              </span>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              {checkoutStep === "cart" && (
                cartItems.length === 0 ? (
                  <p style={{ color: "#8A8578", fontSize: 14.5 }}>Your cart is empty. Add a few products to get started.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {cartItems.map((i) => (
                      <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{i.name}</div>
                          <div style={{ fontSize: 12.5, color: "#8A8578" }}>{priceLabel(i)} × {i.qty}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => changeQty(i.id, -1)} style={{ background: C.sand, border: "none", borderRadius: 8, width: 24, height: 24 }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: 13.5, minWidth: 12, textAlign: "center" }}>{i.qty}</span>
                          <button onClick={() => changeQty(i.id, 1)} style={{ background: C.deep, border: "none", borderRadius: 8, width: 24, height: 24 }}>
                            <Plus size={12} color="#fff" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {checkoutStep === "details" && (
                <form id="checkout-form" onSubmit={placeOrder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Full name
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{ display: "block", width: "100%", marginTop: 5, padding: "10px 12px", border: `1px solid ${C.sandDeep}`, borderRadius: 8, fontSize: 14 }} />
                  </label>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Phone number
                    <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{ display: "block", width: "100%", marginTop: 5, padding: "10px 12px", border: `1px solid ${C.sandDeep}`, borderRadius: 8, fontSize: 14 }} />
                  </label>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>
                    Delivery address
                    <textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      style={{ display: "block", width: "100%", marginTop: 5, padding: "10px 12px", border: `1px solid ${C.sandDeep}`, borderRadius: 8, fontSize: 14, resize: "vertical" }} />
                  </label>
                  <p style={{ fontSize: 12.5, color: "#8A8578", lineHeight: 1.5 }}>
                    This demo captures the full order flow. Once the site is live, this step hands off to a payment gateway (UPI/cards) for real transactions.
                  </p>
                </form>
              )}

              {checkoutStep === "done" && (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Check size={26} color="#fff" />
                  </div>
                  <div className="sg" style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Thanks, {form.name.split(" ")[0] || "there"}!</div>
                  <p style={{ fontSize: 14, color: "#5B5A52" }}>Your order for {money(cartTotal)} has been noted. We'll reach out on {form.phone} to confirm.</p>
                </div>
              )}
            </div>

            {checkoutStep !== "done" && (
              <div style={{ padding: 20, borderTop: `1px solid ${C.sandDeep}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 15 }}>
                  <span style={{ color: "#5B5A52" }}>Total</span>
                  <span className="sg" style={{ fontWeight: 700 }}>{money(cartTotal)}</span>
                </div>
                {checkoutStep === "cart" ? (
                  <button
                    disabled={cartItems.length === 0}
                    onClick={() => setCheckoutStep("details")}
                    className="addbtn"
                    style={{
                      width: "100%", background: cartItems.length ? C.clay : "#D8CFBC", color: "#fff", border: "none",
                      borderRadius: 8, padding: "13px", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                  >
                    Proceed to Checkout <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="addbtn"
                    style={{ width: "100%", background: C.clay, color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontWeight: 600, fontSize: 15 }}
                  >
                    Place Order
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
