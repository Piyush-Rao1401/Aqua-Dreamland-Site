import React, { useMemo, useState } from "react";
import { ShoppingBag, X, Plus, Minus, Check, ChevronRight, Fish, Heart, Flower2, Gem, Search, Waves } from "lucide-react";

const C = {
  bg: "#03111f",
  bg2: "#061a2b",
  card: "rgba(8, 28, 48, .78)",
  line: "rgba(41, 199, 229, .35)",
  cyan: "#13d9ee",
  cyan2: "#2b8cff",
  white: "#f8fbff",
  muted: "#a9c9d2",
};

const CATEGORIES = [
  { id: "aquariums", label: "Aquariums", icon: Fish },
  { id: "soft-toys", label: "Soft Toys", icon: Heart },
  { id: "pots", label: "Pots", icon: Flower2 },
  { id: "resin", label: "Resin Décor", icon: Gem },
];

const PRODUCTS = [
  { id: "aq-1e", cat: "aquariums", name: "Aquarium 1 ft — Empty", price: 500, note: "Glass tank only" },
  { id: "aq-1c", cat: "aquariums", name: "Aquarium 1 ft — Complete Set", price: 1000, note: "5mm glass, full setup" },
  { id: "aq-15e", cat: "aquariums", name: "Aquarium 1.5 ft — Empty", price: 900, note: "Glass tank only" },
  { id: "aq-15c", cat: "aquariums", name: "Aquarium 1.5 ft — Complete Set", price: 2500, priceMax: 3000, note: "5mm glass, full setup" },
  { id: "aq-2e", cat: "aquariums", name: "Aquarium 2 ft — Empty", price: 1100, note: "Glass tank only" },
  { id: "aq-2c", cat: "aquariums", name: "Aquarium 2 ft — Complete Set", price: 4000, priceFrom: true, note: "5mm glass, full setup" },
  { id: "aq-3e", cat: "aquariums", name: "Aquarium 3 ft — Empty", price: 2500, note: "8mm glass tank only" },
  { id: "aq-3c", cat: "aquariums", name: "Aquarium 3 ft — Complete Set", price: 6000, priceFrom: true, note: "8mm glass, full setup" },
  { id: "st-1", cat: "soft-toys", name: "Teddy Bear — Small", price: 150, note: "Starting price" },
  { id: "st-2", cat: "soft-toys", name: "Teddy Bear — Medium", price: 280, note: "Size varies" },
  { id: "st-3", cat: "soft-toys", name: "Plush Bunny", price: 200, note: "Soft plush" },
  { id: "st-4", cat: "soft-toys", name: "Cartoon Character Plush", price: 350, note: "Soft plush" },
  { id: "pt-1", cat: "pots", name: "Plastic Pot — Small", price: 15, note: "Starting price" },
  { id: "pt-2", cat: "pots", name: "Plastic Pot — Medium", price: 40, note: "Medium size" },
  { id: "pt-3", cat: "pots", name: "Ceramic Pot — Small", price: 120, note: "Ceramic finish" },
  { id: "pt-4", cat: "pots", name: "Decorative Pot — Large", price: 250, note: "Large size" },
  { id: "rs-1", cat: "resin", name: "Resin Photo Frame", price: 300, note: "Starting price" },
  { id: "rs-2", cat: "resin", name: "Resin Keychain", price: 350, note: "Handmade" },
  { id: "rs-3", cat: "resin", name: "Resin Coaster Set", price: 450, note: "Set of coasters" },
  { id: "rs-4", cat: "resin", name: "Resin Table Decor", price: 600, note: "Handmade decor" },
];

const CAT_META = {
  aquariums: { icon: Fish, blurb: "Tanks built and glazed in-house, from a 1 ft starter to an 8mm-glass 3 footer." },
  "soft-toys": { icon: Heart, blurb: "Soft toys for every corner of the house, starting at ₹150." },
  pots: { icon: Flower2, blurb: "Plastic to ceramic, sized and priced for any plant." },
  resin: { icon: Gem, blurb: "Handmade resin pieces — frames, coasters, and table decor." },
};

const money = (n) => "₹" + n.toLocaleString("en-IN");
const priceLabel = (p) => p.priceMax ? `${money(p.price)}–${money(p.priceMax)}` : p.priceFrom ? `Up to ${money(p.price)}` : money(p.price);

function ProductArt({ cat }) {
  const Icon = CAT_META[cat].icon;
  return (
    <div className="product-art">
      <div className="art-glow" />
      <Icon size={38} strokeWidth={1.5} />
    </div>
  );
}

export default function App() {
  const [activeCat, setActiveCat] = useState("aquariums");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const base = PRODUCTS.filter((p) => p.cat === activeCat);
    if (!query.trim()) return base;
    return base.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeCat, query]);

  const cartItems = useMemo(() => Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty })), [cart]);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const changeQty = (id, delta) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) }));
  const goShop = (cat = "aquariums") => {
    setActiveCat(cat);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:${C.bg};font-family:Inter,system-ui,sans-serif;color:${C.white}}
        button,input,textarea{font:inherit}button{cursor:pointer}.site{min-height:100vh;background:${C.bg}}
        .reference-hero{position:relative;width:100%;line-height:0;background:#02101d;overflow:hidden}
        .reference-hero img{display:block;width:100%;height:auto}
        .hit{position:absolute;display:block;background:transparent;border:0;padding:0;z-index:3}
        .nav-home{left:32.2%;top:2.6%;width:5.3%;height:6.4%}.nav-aq{left:38%;top:2.6%;width:7.5%;height:6.4%}.nav-toys{left:45%;top:2.6%;width:7%;height:6.4%}.nav-pots{left:52%;top:2.6%;width:4.3%;height:6.4%}.nav-resin{left:56.5%;top:2.6%;width:8%;height:6.4%}.nav-more{left:64%;top:2.6%;width:5.8%;height:6.4%}.nav-cart{right:3.8%;top:1.1%;width:7.8%;height:7.5%}
        .hero-shop{left:7.8%;top:69.6%;width:17.1%;height:8.4%}.hero-browse{left:23.1%;top:69.6%;width:16.1%;height:8.4%}
        .hero-card-aq{left:56%;top:29.3%;width:19.5%;height:26%}.hero-card-toys{left:76.5%;top:29.3%;width:19.5%;height:26%}.hero-card-pots{left:56%;top:57.5%;width:19.5%;height:26%}.hero-card-resin{left:76.5%;top:57.5%;width:19.5%;height:26%}
        .hero-card-aq,.hero-card-toys,.hero-card-pots,.hero-card-resin{border-radius:22px}
        .shop{max-width:1440px;margin:0 auto;padding:72px 5vw 100px;background:${C.bg}}
        .shop-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:30px}.eyebrow{color:${C.cyan};font-size:12px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}.title{font-family:'Space Grotesk';font-size:42px;line-height:1.05;margin:8px 0 8px;letter-spacing:-.04em}.sub{color:${C.muted};margin:0;max-width:650px;line-height:1.6}.filters{display:flex;gap:9px;flex-wrap:wrap;margin:28px 0}.filter{color:#d7f5fa;background:rgba(10,37,58,.65);border:1px solid rgba(44,194,220,.2);padding:10px 15px;border-radius:999px}.filter.active{background:linear-gradient(135deg,${C.cyan},${C.cyan2});color:#00131d;border-color:transparent;font-weight:700;box-shadow:0 10px 28px rgba(19,217,238,.16)}.search{position:relative}.search input{width:230px;background:#061a2b;color:white;border:1px solid rgba(44,194,220,.22);border-radius:999px;padding:10px 14px 10px 35px;outline:none}.search svg{position:absolute;left:13px;top:10px;color:#80aab5}
        .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.prodcard{background:linear-gradient(180deg,rgba(9,31,50,.95),rgba(5,22,37,.95));border:1px solid rgba(44,194,220,.18);border-radius:18px;overflow:hidden;transition:.25s}.prodcard:hover{transform:translateY(-6px);border-color:rgba(19,217,238,.55);box-shadow:0 22px 50px rgba(0,0,0,.3)}.product-art{height:190px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 40%,rgba(19,217,238,.2),transparent 48%),linear-gradient(145deg,#0b3150,#061522)}.product-art svg{color:#baf7ff;position:relative;z-index:2}.art-glow{position:absolute;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(19,217,238,.2),transparent 68%);filter:blur(3px)}.prodbody{padding:17px}.prodname{font-family:'Space Grotesk';font-size:16px;font-weight:700;line-height:1.25}.note{font-size:12px;color:#83a7b0;margin-top:5px}.price-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:16px}.price{font-family:'Space Grotesk';font-size:17px;font-weight:700;color:#eaffff}.add{background:linear-gradient(135deg,${C.cyan},${C.cyan2});border:0;border-radius:10px;padding:8px 12px;font-weight:800;color:#00131d}.qty{display:flex;align-items:center;gap:7px}.qty button{width:27px;height:27px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#0c304a;color:white}.empty{color:${C.muted};padding:40px 0}.footer{border-top:1px solid rgba(44,194,220,.13);padding:30px 5vw;background:#020d18;color:#82a7b1;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.brand{font-family:'Space Grotesk';font-weight:700;color:#f5fbff}
        .drawer-back{position:fixed;inset:0;background:rgba(0,5,12,.68);z-index:20}.drawer{position:fixed;right:0;top:0;bottom:0;width:min(440px,100%);z-index:21;background:#041523;border-left:1px solid rgba(19,217,238,.2);display:flex;flex-direction:column}.drawer-head{padding:20px;border-bottom:1px solid rgba(44,194,220,.15);display:flex;justify-content:space-between;align-items:center}.drawer-body{flex:1;overflow:auto;padding:20px}.drawer-foot{padding:20px;border-top:1px solid rgba(44,194,220,.15)}.close{background:transparent;border:0;color:white}.lineitem{display:flex;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.06)}label{display:block;font-size:13px;font-weight:700;margin-bottom:13px}label input,label textarea{display:block;width:100%;margin-top:6px;background:#061a2b;color:white;border:1px solid rgba(44,194,220,.2);border-radius:10px;padding:11px;outline:none}.checkout{width:100%;padding:13px;border:0;border-radius:11px;background:linear-gradient(135deg,${C.cyan},${C.cyan2});font-weight:800;color:#00131d}.success{text-align:center;padding:50px 10px}.success-icon{width:56px;height:56px;border-radius:50%;background:${C.cyan};color:#00131d;display:flex;align-items:center;justify-content:center;margin:0 auto 15px}
        @media(max-width:1000px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.shop{padding-top:52px}.search input{width:190px}}
        @media(max-width:700px){.reference-hero{min-height:0}.shop{padding:48px 18px 70px}.shop-head{display:block}.search{margin-top:18px}.search input{width:100%}.grid{grid-template-columns:1fr}.title{font-size:34px}.reference-hero img{min-width:980px;max-width:none;transform:translateX(-24%)}.hit{display:none}}
      `}</style>

      <section className="reference-hero" aria-label="Aqua Dreamland premium homepage hero">
        <img src="/aqua-dreamland-hero-reference.png" alt="Aqua Dreamland premium aquarium store homepage" />
        <button aria-label="Home" className="hit nav-home" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <button aria-label="Aquariums" className="hit nav-aq" onClick={() => goShop("aquariums")} />
        <button aria-label="Soft Toys" className="hit nav-toys" onClick={() => goShop("soft-toys")} />
        <button aria-label="Pots" className="hit nav-pots" onClick={() => goShop("pots")} />
        <button aria-label="Resin Décor" className="hit nav-resin" onClick={() => goShop("resin")} />
        <button aria-label="More" className="hit nav-more" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })} />
        <button aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`} className="hit nav-cart" onClick={() => setCartOpen(true)} />
        <button aria-label="Shop Aquariums" className="hit hero-shop" onClick={() => goShop("aquariums")} />
        <button aria-label="Browse All Products" className="hit hero-browse" onClick={() => goShop(activeCat)} />
        <button aria-label="Aquariums category" className="hit hero-card-aq" onClick={() => goShop("aquariums")} />
        <button aria-label="Soft Toys category" className="hit hero-card-toys" onClick={() => goShop("soft-toys")} />
        <button aria-label="Pots category" className="hit hero-card-pots" onClick={() => goShop("pots")} />
        <button aria-label="Resin category" className="hit hero-card-resin" onClick={() => goShop("resin")} />
      </section>

      <section id="shop" className="shop">
        <div className="shop-head">
          <div>
            <div className="eyebrow">Featured collection</div>
            <h2 className="title">Featured Aquariums</h2>
            <p className="sub">Beautiful tanks for every space, size and style. Start small or build a complete setup.</p>
          </div>
          <div className="search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" /></div>
        </div>

        <div className="filters">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return <button key={c.id} className={`filter ${activeCat === c.id ? "active" : ""}`} onClick={() => setActiveCat(c.id)}><Icon size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />{c.label}</button>;
          })}
        </div>

        <p className="sub" style={{ marginBottom: 22 }}>{CAT_META[activeCat].blurb}</p>
        {filtered.length ? <div className="grid">{filtered.map((p) => (
          <article key={p.id} className="prodcard">
            <ProductArt cat={p.cat} />
            <div className="prodbody"><div className="prodname">{p.name}</div><div className="note">{p.note}</div><div className="price-row"><span className="price">{priceLabel(p)}</span>{cart[p.id] ? <div className="qty"><button onClick={() => changeQty(p.id,-1)}><Minus size={13}/></button><b>{cart[p.id]}</b><button onClick={() => changeQty(p.id,1)}><Plus size={13}/></button></div> : <button className="add" onClick={() => addToCart(p.id)}>Add</button>}</div></div>
          </article>
        ))}</div> : <div className="empty">No products found in this category.</div>}
      </section>

      <footer className="footer"><div><Waves size={18} style={{ verticalAlign: "-4px", marginRight: 7 }} /><span className="brand">Aqua Dreamland</span></div><div>Handpicked aquariums • Décor • More</div></footer>

      {cartOpen && <>
        <div className="drawer-back" onClick={() => setCartOpen(false)} />
        <aside className="drawer">
          <div className="drawer-head"><b>{checkoutStep === "cart" ? "Your Cart" : checkoutStep === "details" ? "Delivery Details" : "Order Placed"}</b><button className="close" onClick={() => setCartOpen(false)}><X /></button></div>
          <div className="drawer-body">
            {checkoutStep === "cart" && (cartItems.length ? cartItems.map(i => <div className="lineitem" key={i.id}><div><b>{i.name}</b><div className="note">{priceLabel(i)} × {i.qty}</div></div><div className="qty"><button onClick={() => changeQty(i.id,-1)}><Minus size={12}/></button><b>{i.qty}</b><button onClick={() => changeQty(i.id,1)}><Plus size={12}/></button></div></div>) : <p className="sub">Your cart is empty.</p>)}
            {checkoutStep === "details" && <form id="order-form" onSubmit={(e) => { e.preventDefault(); setCheckoutStep("done"); }}><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Phone number<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Delivery address<textarea required rows="4" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label></form>}
            {checkoutStep === "done" && <div className="success"><div className="success-icon"><Check/></div><h3>Thanks, {form.name.split(" ")[0] || "there"}!</h3><p className="sub">Your order for {money(cartTotal)} has been noted. We'll reach out on {form.phone} to confirm.</p></div>}
          </div>
          {checkoutStep !== "done" && <div className="drawer-foot"><div style={{display:"flex",justifyContent:"space-between",marginBottom:13}}><span className="sub">Total</span><b>{money(cartTotal)}</b></div>{checkoutStep === "cart" ? <button className="checkout" disabled={!cartItems.length} onClick={() => setCheckoutStep("details")}>Proceed to Checkout <ChevronRight size={15} style={{verticalAlign:"-3px"}}/></button> : <button className="checkout" type="submit" form="order-form">Place Order</button>}</div>}
        </aside>
      </>}
    </div>
  );
}
