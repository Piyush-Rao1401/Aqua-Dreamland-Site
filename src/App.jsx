import React, { useMemo, useState } from "react";
import {
  ShoppingCart, X, Plus, Minus, Check, ChevronRight, Waves,
  Fish, Flower2, Gem, Heart, MapPin, Phone, Search, Sparkles,
  ShieldCheck, Truck, Leaf, Menu, ArrowUpRight, MessageCircle
} from "lucide-react";

const C = {
  navy: "#041321",
  navy2: "#071C2E",
  ink: "#10252B",
  aqua: "#12D7E6",
  aqua2: "#42B8FF",
  purple: "#7A5CFF",
  cream: "#F7F4EC",
  white: "#FFFFFF",
  muted: "#66777A",
  line: "#DDE5DF",
};

const CATEGORIES = [
  { id: "aquariums", label: "Aquariums", icon: Fish, blurb: "Tanks built and glazed in-house, from a 1 ft starter to an 8mm-glass 3 footer.", image: "tank" },
  { id: "soft-toys", label: "Soft Toys", icon: Heart, blurb: "Soft toys for every corner of the house, starting at ₹150.", image: "toy" },
  { id: "pots", label: "Pots", icon: Flower2, blurb: "Plastic to ceramic, sized and priced for any plant.", image: "pot" },
  { id: "resin", label: "Resin Décor", icon: Gem, blurb: "Handmade resin pieces — frames, coasters, and table décor.", image: "resin" },
];

const PRODUCTS = [
  { id: "aq-1e", cat: "aquariums", name: "Aquarium 1 ft — Empty", price: 500, note: "Glass tank only", badge: "Starter" },
  { id: "aq-1c", cat: "aquariums", name: "Aquarium 1 ft — Complete Set", price: 1000, note: "5mm glass · full setup", badge: "Popular" },
  { id: "aq-15e", cat: "aquariums", name: "Aquarium 1.5 ft — Empty", price: 900, note: "Glass tank only" },
  { id: "aq-15c", cat: "aquariums", name: "Aquarium 1.5 ft — Complete Set", price: 2500, priceMax: 3000, note: "5mm glass · full setup" },
  { id: "aq-2e", cat: "aquariums", name: "Aquarium 2 ft — Empty", price: 1100, note: "Glass tank only" },
  { id: "aq-2c", cat: "aquariums", name: "Aquarium 2 ft — Complete Set", price: 4000, priceFrom: true, note: "5mm glass · full setup", badge: "Popular" },
  { id: "aq-3e", cat: "aquariums", name: "Aquarium 3 ft — Empty", price: 2500, note: "8mm glass tank only" },
  { id: "aq-3c", cat: "aquariums", name: "Aquarium 3 ft — Complete Set", price: 6000, priceFrom: true, note: "8mm glass · full setup" },
  { id: "st-1", cat: "soft-toys", name: "Teddy Bear — Small", price: 150, note: "Starting price · size varies", badge: "From ₹150" },
  { id: "st-2", cat: "soft-toys", name: "Teddy Bear — Medium", price: 280, note: "Soft plush · medium" },
  { id: "st-3", cat: "soft-toys", name: "Plush Bunny", price: 200, note: "Soft plush · assorted" },
  { id: "st-4", cat: "soft-toys", name: "Cartoon Character Plush", price: 350, note: "Assorted designs" },
  { id: "pt-1", cat: "pots", name: "Plastic Pot — Small", price: 15, note: "Starting price · varies by size" },
  { id: "pt-2", cat: "pots", name: "Plastic Pot — Medium", price: 40, note: "Lightweight · indoor/outdoor" },
  { id: "pt-3", cat: "pots", name: "Ceramic Pot — Small", price: 120, note: "Decorative ceramic" },
  { id: "pt-4", cat: "pots", name: "Decorative Pot — Large", price: 250, note: "Statement planter" },
  { id: "rs-1", cat: "resin", name: "Resin Photo Frame", price: 300, note: "Handmade · starting price" },
  { id: "rs-2", cat: "resin", name: "Resin Keychain", price: 350, note: "Handmade · assorted" },
  { id: "rs-3", cat: "resin", name: "Resin Coaster Set", price: 450, note: "Handmade · set" },
  { id: "rs-4", cat: "resin", name: "Resin Table Decor", price: 600, note: "Handmade · statement piece" },
];

const CAT_META = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const money = n => "₹" + n.toLocaleString("en-IN");
const priceLabel = p => p.priceMax ? `${money(p.price)}–${money(p.priceMax)}` : p.priceFrom ? `From ${money(p.price)}` : money(p.price);

function ProductArt({ cat, compact = false }) {
  const Icon = CAT_META[cat].icon;
  return (
    <div className={`product-art ${compact ? "compact" : ""} art-${cat}`}>
      <div className="art-glow" />
      {cat === "aquariums" ? <div className="mini-tank"><span /><i /><b /></div> : cat === "soft-toys" ? <div className="plush"><div className="ear e1" /><div className="ear e2" /><div className="face"><em /><em /><small /></div></div> : cat === "pots" ? <div className="plant-pot"><span className="leaf l1" /><span className="leaf l2" /><span className="leaf l3" /><div /></div> : <div className="resin-piece"><Gem size={compact ? 28 : 38} /></div>}
      <div className="art-icon"><Icon size={compact ? 15 : 17} /></div>
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
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter(p => p.cat === activeCat);
    if (!query.trim()) return list;
    return list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeCat, query]);
  const featured = PRODUCTS.filter(p => p.cat === "aquariums").slice(0, 4);
  const cartItems = useMemo(() => Object.entries(cart).filter(([,q]) => q > 0).map(([id, qty]) => ({ ...PRODUCTS.find(p => p.id === id), qty })), [cart]);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const addToCart = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const changeQty = (id, delta) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) }));
  const openCart = () => { setCheckoutStep("cart"); setCartOpen(true); };
  const placeOrder = e => { e.preventDefault(); setCheckoutStep("done"); };

  return (
    <div className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:${C.cream};color:${C.ink};font-family:Manrope,sans-serif}.sg{font-family:'Space Grotesk',sans-serif}button,input,textarea{font:inherit}button{cursor:pointer}.site{min-height:100vh;overflow:hidden}
        .nav{position:sticky;top:0;z-index:40;background:rgba(3,15,27,.88);backdrop-filter:blur(18px);border-bottom:1px solid rgba(164,238,238,.12);color:#fff}.nav-inner{max-width:1620px;margin:auto;padding:11px 24px;display:flex;align-items:center;gap:30px}.brand{display:flex;align-items:center;gap:11px;min-width:245px}.brand-mark{width:43px;height:43px;border-radius:13px;border:1px solid rgba(18,215,230,.6);display:grid;place-items:center;background:linear-gradient(145deg,rgba(18,215,230,.17),rgba(122,92,255,.08));box-shadow:0 0 24px rgba(18,215,230,.15)}.brand-name{font:700 22px 'Space Grotesk';letter-spacing:-.035em}.brand-sub{font-size:10px;color:#8fb2b4;letter-spacing:.14em;text-transform:uppercase;margin-top:2px}.navlinks{display:flex;align-items:center;gap:7px;flex:1;justify-content:center}.navlinks button{border:0;background:transparent;color:#c9dddd;padding:12px 13px;border-radius:10px;font-weight:600;font-size:14px;transition:.2s}.navlinks button:hover,.navlinks button.active{color:#fff;background:rgba(255,255,255,.05)}.navlinks button.active{box-shadow:inset 0 -2px ${C.aqua}}.cart-btn{border:1px solid rgba(18,215,230,.55);background:linear-gradient(135deg,#24b7cf,#2d91c5);color:#041321;border-radius:13px;padding:11px 16px;font-weight:800;display:flex;align-items:center;gap:8px;box-shadow:0 8px 28px rgba(18,215,230,.17)}.mobile-menu{display:none;background:transparent;color:#fff;border:0}
        .hero{position:relative;color:#fff;min-height:calc(100vh - 76px);;display:flex;align-items:center;background:#031321 url('/betta-fish.jpg') center 42%/cover no-repeat;isolation:isolate}.hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(2,11,22,.97) 0%,rgba(3,17,32,.86) 33%,rgba(2,12,25,.48) 62%,rgba(2,9,18,.58) 100%);z-index:-1}.hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 64% 44%,rgba(81,59,212,.25),transparent 32%),linear-gradient(0deg,rgba(3,13,24,.35),transparent 25%);z-index:-1}.hero-inner{max-width:1620px;width:100%;margin:auto;padding:58px 34px 74px;display:grid;grid-template-columns:minmax(0,1.03fr) minmax(520px,.97fr);gap:48px;align-items:center}.badge{display:inline-flex;align-items:center;gap:9px;padding:8px 13px;border:1px solid rgba(18,215,230,.32);background:rgba(3,22,38,.45);border-radius:999px;backdrop-filter:blur(10px);font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c9f8f4}.dot{width:8px;height:8px;border-radius:50%;background:#5ff4e4;box-shadow:0 0 14px #5ff4e4}.hero-kicker{color:#a9d7d7;font-weight:700;font-size:15px;margin:19px 0 12px}.hero h1{font:700 clamp(52px,5.15vw,82px)/.96 'Space Grotesk';letter-spacing:-.055em;margin:0;max-width:770px}.hero h1 .accent{color:#16dbe7}.hero p{max-width:600px;color:#c9dcdd;font-size:17px;line-height:1.72;margin:23px 0 0}.hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:29px}.primary,.secondary{border-radius:13px;padding:14px 20px;font-weight:800;font-size:15px;display:inline-flex;align-items:center;gap:7px;transition:.22s}.primary{border:1px solid rgba(255,255,255,.1);background:linear-gradient(135deg,#18d8e5,#3a8eff);color:#041321;box-shadow:0 12px 34px rgba(18,215,230,.23)}.secondary{border:1px solid rgba(201,243,238,.3);background:rgba(3,16,31,.3);color:#fff;backdrop-filter:blur(8px)}.primary:hover,.secondary:hover{transform:translateY(-3px)}.stats{display:flex;gap:0;flex-wrap:wrap;margin-top:35px}.stat{padding:0 24px 0 0;margin-right:24px;border-right:1px solid rgba(201,243,238,.2);color:#9bb8ba;font-size:12px}.stat:last-child{border:0}.stat strong{display:block;color:#fff;font:700 16px 'Space Grotesk';margin-bottom:3px}.hero-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px}.hero-card{position:relative;min-height:224px;padding:17px;border-radius:18px;overflow:hidden;border:1px solid rgba(173,239,240,.27);background:linear-gradient(145deg,rgba(4,24,42,.68),rgba(8,20,39,.4));backdrop-filter:blur(13px);box-shadow:0 18px 55px rgba(0,0,0,.2);transition:.25s}.hero-card:hover{transform:translateY(-5px);border-color:rgba(18,215,230,.62)}.hero-card .hc-top{display:flex;justify-content:space-between;align-items:flex-start}.hc-icon{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:rgba(18,215,230,.12);color:#baf8f1;border:1px solid rgba(18,215,230,.17)}.hero-card .hc-arrow{width:29px;height:29px;border-radius:50%;display:grid;place-items:center;background:rgba(18,215,230,.12);color:#8ceff2}.hero-card h3{font:700 19px 'Space Grotesk';margin:17px 0 5px}.hero-card p{font-size:13px;line-height:1.48;color:#aac3c4;margin:0;max-width:205px}.hero-card .mini-image{position:absolute;right:-8px;bottom:-16px;opacity:.98;transform:scale(1.02)}

        .hero-card .mini-image .product-art{background:transparent!important;overflow:visible}
        .hero-card .mini-image .product-art .art-glow,
        .hero-card .mini-image .product-art .art-icon{display:none}
        .hero-card .mini-image .product-art:after{content:"";position:absolute;right:0;bottom:0;width:180px;height:150px;border-radius:28px 0 0 0;background-size:cover;background-position:center;opacity:.95;mask-image:linear-gradient(90deg,transparent 0%,#000 25%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 25%)}
        .hero-card:nth-child(1) .mini-image .product-art:after{background-image:url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80')}
        .hero-card:nth-child(2) .mini-image .product-art:after{background-image:url('https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=500&q=80')}
        .hero-card:nth-child(3) .mini-image .product-art:after{background-image:url('https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80')}
        .hero-card:nth-child(4) .mini-image .product-art:after{background-image:url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=80')}
        .hero-card:nth-child(1),.hero-card:nth-child(2),.hero-card:nth-child(3),.hero-card:nth-child(4){
          background:linear-gradient(135deg,rgba(5,30,50,.74),rgba(4,17,32,.46));
        }
        .hero-card:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 90% 65%,rgba(24,217,232,.13),transparent 42%);pointer-events:none}
        @media(max-width:1250px){.hero-inner{grid-template-columns:1fr 1fr;gap:28px}.hero h1{font-size:clamp(48px,5.3vw,70px)}.hero-card{min-height:205px}}
        .wave-bottom{position:absolute;bottom:-1px;left:0;width:100%;height:38px;z-index:3}.wave-bottom path{fill:${C.cream}}
        .section{max-width:1180px;margin:auto;padding:70px 24px}.eyebrow{color:#168d9a;font-size:11px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:30px}.section-title{font:700 clamp(30px,3.6vw,46px)/1.05 'Space Grotesk';letter-spacing:-.045em;margin:7px 0 0}.section-copy{color:#718084;max-width:560px;line-height:1.6;font-size:14px;margin:9px 0 0}.text-link{border:0;background:none;color:#137f8c;font-weight:800;display:inline-flex;align-items:center;gap:4px}.trust{max-width:1180px;margin:-8px auto 0;padding:0 24px 38px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.trust-card{background:#fff;border:1px solid ${C.line};border-radius:16px;padding:18px;display:flex;gap:13px;align-items:center;box-shadow:0 10px 28px rgba(8,43,51,.05)}.trust-icon{width:42px;height:42px;flex:none;border-radius:13px;background:#edf9f5;display:grid;place-items:center;color:#148c8b}.trust-card strong{font:700 14px 'Space Grotesk'}.trust-card span{display:block;color:#829093;font-size:11.5px;margin-top:3px}
        .featured{background:#fff}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:17px}.product-card{background:#fff;border:1px solid ${C.line};border-radius:17px;overflow:hidden;transition:.23s;position:relative}.product-card:hover{transform:translateY(-5px);box-shadow:0 18px 42px rgba(5,37,45,.11);border-color:#b8e5e3}.product-art{height:225px;position:relative;overflow:hidden;display:grid;place-items:center}.product-art.compact{height:155px}.art-aquariums{background:radial-gradient(circle at 68% 30%,#16d8e7,transparent 25%),linear-gradient(145deg,#071e31,#07364b)}.art-soft-toys{background:radial-gradient(circle at 70% 25%,#ffd6a6,transparent 24%),linear-gradient(145deg,#5b4550,#c77d75)}.art-pots{background:radial-gradient(circle at 68% 22%,#b5db8f,transparent 22%),linear-gradient(145deg,#304c3e,#91a96f)}.art-resin{background:radial-gradient(circle at 60% 25%,#d8b6ff,transparent 24%),linear-gradient(145deg,#2b2551,#b77961)}.art-glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 60%,rgba(255,255,255,.18),transparent 35%)}.art-icon{position:absolute;left:13px;top:13px;width:33px;height:33px;border-radius:10px;display:grid;place-items:center;color:#fff;background:rgba(2,15,28,.42);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(8px)}.mini-tank{width:145px;height:92px;border:3px solid rgba(220,255,255,.72);border-top-width:5px;border-radius:5px 5px 12px 12px;position:relative;background:linear-gradient(180deg,rgba(10,212,228,.12),rgba(16,98,130,.48));box-shadow:0 18px 45px rgba(0,0,0,.25),inset 0 -20px 35px rgba(3,23,38,.4)}.mini-tank:before{content:"";position:absolute;left:13px;right:10px;bottom:13px;height:22px;background:linear-gradient(160deg,#234e49,#6c9d6c);clip-path:polygon(0 100%,20% 20%,36% 80%,56% 0,72% 82%,100% 28%,100% 100%)}.mini-tank span,.mini-tank i,.mini-tank b{position:absolute;width:7px;height:4px;border-radius:50%;background:#ffc45c;top:48px;left:50px;transform:rotate(15deg)}.mini-tank i{left:77px;top:39px}.mini-tank b{left:97px;top:57px}.plush{width:108px;height:108px;border-radius:45% 45% 42% 42%;background:#e2ad88;position:relative;box-shadow:inset -12px -15px 20px rgba(121,59,44,.12),0 15px 30px rgba(0,0,0,.18)}.ear{position:absolute;width:39px;height:39px;border-radius:50%;background:#d7977a;top:-8px}.e1{left:0}.e2{right:0}.face{position:absolute;inset:25px 20px 18px;background:#efc29d;border-radius:48%}.face em{position:absolute;width:6px;height:8px;border-radius:50%;background:#4b3b36;top:30px}.face em:first-child{left:20px}.face em:nth-child(2){right:20px}.face small{position:absolute;width:20px;height:9px;border-bottom:2px solid #7c5048;border-radius:50%;left:calc(50% - 10px);top:43px}.plant-pot{position:relative;width:105px;height:120px}.plant-pot:before,.plant-pot:after{content:"";position:absolute;left:48px;bottom:45px;width:10px;height:70px;background:#75a86c;border-radius:100%;transform:rotate(-20deg);transform-origin:bottom}.plant-pot:after{transform:rotate(24deg);left:53px}.leaf{position:absolute;width:34px;height:67px;background:#70aa69;border-radius:100% 0 100% 0;bottom:45px}.l1{left:18px;transform:rotate(-35deg)}.l2{left:39px;bottom:51px;transform:rotate(-8deg)}.l3{right:13px;transform:rotate(38deg)}.plant-pot div{position:absolute;bottom:0;left:18px;width:78px;height:56px;background:linear-gradient(145deg,#d7c5a3,#8d7354);border-radius:8px 8px 25px 25px;clip-path:polygon(6% 0,94% 0,80% 100%,20% 100%)}.resin-piece{width:110px;height:110px;display:grid;place-items:center;border-radius:28px;background:linear-gradient(145deg,#9d7cff,#ef9f80);color:#fff;transform:rotate(10deg);box-shadow:inset 0 0 25px rgba(255,255,255,.3),0 20px 35px rgba(0,0,0,.2)}.product-body{padding:15px}.product-badge{display:inline-block;background:#e8fbf9;color:#087e83;border-radius:999px;padding:4px 7px;font-size:9.5px;font-weight:800;margin-bottom:8px}.product-name{font:700 15px/1.25 'Space Grotesk'}.product-note{font-size:11.5px;color:#899597;margin-top:5px}.product-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}.price{font:700 17px 'Space Grotesk';color:#0a737d}.add{border:0;background:${C.navy};color:#fff;border-radius:9px;padding:8px 11px;font-weight:800;font-size:12px}.qty{display:flex;align-items:center;gap:7px}.qty button{width:27px;height:27px;border:0;border-radius:8px;background:#eaf4f1;display:grid;place-items:center}.qty button:last-child{background:${C.navy};color:#fff}
        .categories{background:${C.cream}}.category-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px}.category-card{border-radius:20px;overflow:hidden;min-height:290px;position:relative;color:#fff;padding:20px;display:flex;flex-direction:column;justify-content:end;border:1px solid rgba(255,255,255,.25);transition:.25s}.category-card:hover{transform:translateY(-5px)}.category-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 25%,rgba(1,11,20,.82) 100%)}.category-card>*{position:relative;z-index:1}.cat-a{background:radial-gradient(circle at 70% 25%,#25e0ec,transparent 25%),linear-gradient(145deg,#082339,#073e55)}.cat-b{background:radial-gradient(circle at 70% 22%,#ffd4ac,transparent 25%),linear-gradient(145deg,#60434d,#bd7c76)}.cat-c{background:radial-gradient(circle at 65% 20%,#b7dc94,transparent 24%),linear-gradient(145deg,#344e40,#839d69)}.cat-d{background:radial-gradient(circle at 65% 25%,#d3b4ff,transparent 25%),linear-gradient(145deg,#2a2450,#a86d5f)}.cat-icon{width:40px;height:40px;border-radius:13px;background:rgba(255,255,255,.13);display:grid;place-items:center;backdrop-filter:blur(8px);margin-bottom:auto}.category-card h3{font:700 22px 'Space Grotesk';margin:0 0 5px}.category-card p{font-size:12px;color:#d0e0df;line-height:1.5;margin:0;max-width:240px}.cat-link{margin-top:13px;color:#a9fbf7;font-size:12px;font-weight:800;display:flex;align-items:center;gap:3px}
        .story{background:${C.navy};color:#fff}.story-grid{display:grid;grid-template-columns:1fr 1fr;gap:65px;align-items:center}.story-copy p{color:#a9c0c2;line-height:1.7;font-size:15px}.story-points{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:24px}.point{border:1px solid rgba(201,243,238,.13);background:rgba(255,255,255,.035);padding:16px;border-radius:15px}.point svg{color:${C.aqua};margin-bottom:9px}.point strong{display:block;font:700 14px 'Space Grotesk'}.point span{display:block;color:#89a6a8;font-size:11.5px;margin-top:4px;line-height:1.45}.story-visual{min-height:390px;border-radius:28px;position:relative;overflow:hidden;background:url('/betta-fish.jpg') center/cover}.story-visual:after{content:"";position:absolute;inset:0;background:linear-gradient(145deg,rgba(2,15,28,.15),rgba(3,13,25,.68))}.quote{position:absolute;z-index:1;left:25px;right:25px;bottom:24px;padding:18px;border-radius:17px;background:rgba(2,14,25,.58);border:1px solid rgba(201,243,238,.2);backdrop-filter:blur(12px)}.quote strong{font:700 18px 'Space Grotesk'}.quote span{display:block;color:#a9c2c2;font-size:12px;margin-top:5px}
        .shop{background:#fff}.shop-toolbar{display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap;margin-bottom:24px}.pills{display:flex;gap:8px;flex-wrap:wrap}.pill{border:1px solid ${C.line};background:#fff;color:${C.navy};border-radius:999px;padding:9px 14px;font-size:12.5px;font-weight:700;display:flex;gap:6px;align-items:center}.pill.active{background:${C.navy};color:#fff;border-color:${C.navy}}.search{position:relative}.search input{width:220px;border:1px solid ${C.line};border-radius:10px;padding:10px 12px 10px 33px;outline:none}.search svg{position:absolute;left:11px;top:11px;color:#8a9799}.empty{padding:35px;text-align:center;color:#839093;background:#f8faf7;border-radius:16px}
        .custom{background:linear-gradient(120deg,#dffaf5,#eef5ff);border-top:1px solid #d6ecea}.custom-box{max-width:1180px;margin:auto;padding:60px 24px;display:flex;justify-content:space-between;gap:30px;align-items:center}.custom h2{font:700 40px 'Space Grotesk';letter-spacing:-.04em;margin:6px 0}.custom p{color:#637478;max-width:620px;line-height:1.6}.custom-btn{border:0;border-radius:12px;background:${C.navy};color:#fff;padding:14px 20px;font-weight:800;white-space:nowrap}
        footer{background:#020c16;color:#91abad}.footer-inner{max-width:1180px;margin:auto;padding:42px 24px;display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap}.footer-brand{color:#fff;font:700 19px 'Space Grotesk'}.footer-inner p{font-size:12px;max-width:360px;line-height:1.6}.footer-links{display:flex;gap:22px;font-size:12px;align-items:center;flex-wrap:wrap}.footer-links span{display:flex;align-items:center;gap:6px}
        .overlay{position:fixed;inset:0;background:rgba(0,12,20,.56);z-index:60}.drawer{position:absolute;right:0;top:0;bottom:0;width:min(440px,100%);background:${C.cream};display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,.22)}.drawer-head{padding:18px 20px;border-bottom:1px solid ${C.line};display:flex;justify-content:space-between;align-items:center}.drawer-body{flex:1;overflow:auto;padding:20px}.drawer-foot{padding:20px;border-top:1px solid ${C.line}}.icon-btn{border:0;background:transparent}.drawer-item{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid #e4e9e5}.form{display:flex;flex-direction:column;gap:13px}.form label{font-size:12px;font-weight:800}.form input,.form textarea{display:block;width:100%;margin-top:5px;border:1px solid ${C.line};border-radius:9px;padding:10px;background:#fff;outline:none}.form input:focus,.form textarea:focus{border-color:${C.aqua};box-shadow:0 0 0 3px rgba(18,215,230,.1)}
        @media(max-width:1050px){.navlinks{display:none}.mobile-menu{display:block}.nav-inner{justify-content:space-between}.navlinks.mobile{display:flex;position:absolute;top:66px;left:0;right:0;background:rgba(3,15,27,.97);padding:12px 20px;flex-direction:column;align-items:stretch;border-bottom:1px solid rgba(255,255,255,.1)}.navlinks.mobile button{text-align:left}.hero-inner{grid-template-columns:1fr}.hero-cards{max-width:820px}.product-grid{grid-template-columns:repeat(2,1fr)}.category-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:700px){.nav-inner{padding:9px 15px}.brand{min-width:0}.brand-mark{width:38px;height:38px}.brand-name{font-size:18px}.brand-sub{font-size:8.5px}.cart-btn{padding:9px 11px}.hero{min-height:auto}.hero-inner{padding:55px 18px 75px;gap:35px}.hero h1{font-size:clamp(42px,13vw,60px)}.hero p{font-size:14.5px}.hero-cards{grid-template-columns:1fr 1fr;gap:9px}.hero-card{min-height:175px;padding:13px}.hero-card h3{font-size:15px;margin-top:12px}.hero-card p{font-size:11px}.trust{grid-template-columns:1fr;padding:0 18px 25px}.section{padding:52px 18px}.section-head{align-items:flex-start;flex-direction:column}.product-grid{grid-template-columns:1fr 1fr;gap:11px}.product-art{height:170px}.product-body{padding:12px}.product-name{font-size:13px}.product-note{font-size:10.5px}.price{font-size:15px}.add{padding:7px 9px}.category-grid{grid-template-columns:1fr 1fr;gap:10px}.category-card{min-height:240px;padding:14px}.category-card h3{font-size:18px}.category-card p{font-size:10.5px}.story-grid{grid-template-columns:1fr;gap:25px}.story-visual{min-height:290px;order:-1}.story-points{gap:9px}.custom-box{padding:45px 18px;flex-direction:column;align-items:flex-start}.custom h2{font-size:32px}.search input{width:100%}.search{width:100%}.footer-inner{padding:35px 18px}.stats{gap:16px}.stat{margin-right:0;padding-right:16px}.hero-cards .hero-card:nth-child(n+3){min-height:160px}}
        .whatsapp-float{position:fixed;right:22px;bottom:22px;z-index:70;width:58px;height:58px;border-radius:50%;background:#25D366;color:#fff;display:grid;place-items:center;box-shadow:0 12px 32px rgba(37,211,102,.45);transition:.2s}
        .whatsapp-float:hover{transform:scale(1.08)}
        @media(max-width:700px){.whatsapp-float{right:16px;bottom:16px;width:52px;height:52px}}
      `}</style>

      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-mark"><Waves size={23} color={C.aqua} /></div>
            <div><div className="brand-name">Aqua Dreamland</div><div className="brand-sub">Aquarium • Décor • More</div></div>
          </div>
          <button className="mobile-menu" onClick={() => setMobileNav(v => !v)}><Menu /></button>
          <nav className={`navlinks ${mobileNav ? "mobile" : ""}`}>
            <button className="active" onClick={() => {scrollTo("home");setMobileNav(false)}}>Home</button>
            {CATEGORIES.map(c => <button key={c.id} onClick={() => {setActiveCat(c.id);scrollTo("shop");setMobileNav(false)}}>{c.label}</button>)}
            <button onClick={() => {scrollTo("story");setMobileNav(false)}}>Our Story</button>
          </nav>
          <button className="cart-btn" onClick={openCart}><ShoppingCart size={17}/> Cart {cartCount ? `· ${cartCount}` : ""}</button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-inner">
            <div>
              <div className="badge"><span className="dot"/> Handpicked aquarium collection</div>
              <div className="hero-kicker">Aquariums · Soft Toys · Pots · Resin Décor</div>
              <h1>Everything for your <span className="accent">tank</span> and everything around it.</h1>
              <p>From a first 1-foot starter tank to a fully fitted 3-footer — plus the soft toys, pots, and resin pieces that finish a room. Built and picked by hand.</p>
              <div className="hero-ctas"><button className="primary" onClick={() => {setActiveCat("aquariums");scrollTo("shop")}}>Shop Aquariums <ChevronRight size={17}/></button><button className="secondary" onClick={() => scrollTo("featured")}>Browse Products <ArrowUpRight size={16}/></button></div>
              <div className="stats"><div className="stat"><strong>1–3 ft</strong>aquarium sizes</div><div className="stat"><strong>₹500+</strong>starting tanks</div><div className="stat"><strong>Handpicked</strong>decor & gifts</div></div>
            </div>
            <div className="hero-cards">
              {CATEGORIES.map((c, i) => {const Icon=c.icon; return <div key={c.id} className="hero-card" onClick={() => {setActiveCat(c.id);scrollTo("shop")}} role="button" tabIndex={0}><div className="hc-top"><div className="hc-icon"><Icon size={19}/></div><div className="hc-arrow"><ChevronRight size={16}/></div></div><h3>{c.label}</h3><p>{c.blurb}</p><div className="mini-image"><ProductArt cat={c.id} compact/></div></div>})}
            </div>
          </div>
          <svg className="wave-bottom" viewBox="0 0 1200 55" preserveAspectRatio="none"><path d="M0 28 C160 58 340 0 580 24 C830 51 1020 8 1200 27 L1200 55 L0 55Z"/></svg>
        </section>

        <section className="trust">
          <div className="trust-card"><div className="trust-icon"><Fish size={19}/></div><div><strong>Built in-house</strong><span>Tanks glazed and fitted by hand</span></div></div>
          <div className="trust-card"><div className="trust-icon"><Leaf size={19}/></div><div><strong>Picked with care</strong><span>Décor and gifts selected thoughtfully</span></div></div>
          <div className="trust-card"><div className="trust-icon"><ShieldCheck size={19}/></div><div><strong>Made for your space</strong><span>Starter setups to statement tanks</span></div></div>
        </section>

        <section id="featured" className="section featured">
          <div className="section-head"><div><div className="eyebrow">Featured aquariums</div><h2 className="section-title">Built for your little underwater world.</h2><p className="section-copy">Start simple or go all-in. These are the aquarium sizes customers can shop right now.</p></div><button className="text-link" onClick={() => {setActiveCat("aquariums");scrollTo("shop")}}>View all <ChevronRight size={16}/></button></div>
          <div className="product-grid">{featured.map(p => <ProductCard key={p.id} p={p} cart={cart} addToCart={addToCart} changeQty={changeQty}/>)}</div>
        </section>

        <section className="section categories">
          <div className="section-head"><div><div className="eyebrow">Shop by category</div><h2 className="section-title">More than just aquariums.</h2><p className="section-copy">Bring the same underwater personality into the rest of your space.</p></div></div>
          <div className="category-grid">{CATEGORIES.map((c,i) => {const Icon=c.icon;return <div key={c.id} className={`category-card ${["cat-a","cat-b","cat-c","cat-d"][i]}`} onClick={() => {setActiveCat(c.id);scrollTo("shop")}}><div className="cat-icon"><Icon size={20}/></div><div><h3>{c.label}</h3><p>{c.blurb}</p><div className="cat-link">Explore collection <ChevronRight size={14}/></div></div></div>})}</div>
        </section>

        <section id="story" className="section story"><div className="story-grid"><div className="story-copy"><div className="eyebrow">Why Aqua Dreamland</div><h2 className="section-title">Small tanks. Big personality.</h2><p>We wanted aquarium shopping to feel less like picking a box of glass and more like building a little world. So we pair practical tank sizes with the small details that make a room feel yours.</p><div className="story-points"><div className="point"><Truck size={20}/><strong>Careful handling</strong><span>Designed around safe packing and easy handover.</span></div><div className="point"><Sparkles size={20}/><strong>Handpicked décor</strong><span>Pieces chosen to work around your tank and room.</span></div><div className="point"><Fish size={20}/><strong>Real tank sizes</strong><span>Clear 1 ft, 1.5 ft, 2 ft and 3 ft options.</span></div><div className="point"><Heart size={20}/><strong>Made with care</strong><span>In-house builds with a personal-shop feel.</span></div></div></div><div className="story-visual"><div className="quote"><strong>“Your tank should feel like part of your home.”</strong><span>Aqua Dreamland · Aquarium, décor & more</span></div></div></div></section>

        <section id="shop" className="section shop">
          <div className="section-head"><div><div className="eyebrow">Shop everything</div><h2 className="section-title">Find your next favourite piece.</h2><p className="section-copy">Choose a category, search it, and add products straight to your cart.</p></div></div>
          <div className="shop-toolbar"><div className="pills">{CATEGORIES.map(c => {const Icon=c.icon;return <button key={c.id} className={`pill ${activeCat===c.id?"active":""}`} onClick={() => {setActiveCat(c.id);setQuery("")}}><Icon size={14}/>{c.label}</button>})}</div><div className="search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${CAT_META[activeCat].label.toLowerCase()}`}/></div></div>
          {filtered.length ? <div className="product-grid">{filtered.map(p => <ProductCard key={p.id} p={p} cart={cart} addToCart={addToCart} changeQty={changeQty}/>)}</div> : <div className="empty">No products matched “{query}”. Try another search.</div>}
        </section>

        <section className="custom"><div className="custom-box"><div><div className="eyebrow">Have a tank idea?</div><h2>Let’s build your little world.</h2><p>Want a different size, a fitted setup, or a tank that works with your space? Start the conversation and we can turn the idea into a plan.</p></div><button className="custom-btn" onClick={() => window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}>Talk to Aqua Dreamland <ArrowUpRight size={16} style={{verticalAlign:"middle"}}/></button></div></section>
      </main>

      <footer><div className="footer-inner"><div><div className="footer-brand">Aqua Dreamland</div><p>Aquariums, décor, gifts and little things that make your space feel alive.</p></div><div className="footer-links"><span><MapPin size={14}/> Visit the shop in person</span><span><Phone size={14}/> Add your contact number</span><span>© 2026 Aqua Dreamland</span></div></div></footer>

      {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><div className="drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><span className="sg" style={{fontWeight:700,fontSize:17}}>{checkoutStep === "cart" ? "Your Cart" : checkoutStep === "details" ? "Delivery Details" : "Order Placed"}</span><button className="icon-btn" onClick={() => setCartOpen(false)}><X size={20}/></button></div><div className="drawer-body">{checkoutStep === "cart" && (cartItems.length ? cartItems.map(i => <div className="drawer-item" key={i.id}><div><div style={{fontWeight:700,fontSize:13}}>{i.name}</div><div style={{fontSize:11.5,color:C.muted}}>{priceLabel(i)} × {i.qty}</div></div><div className="qty"><button onClick={() => changeQty(i.id,-1)}><Minus size={12}/></button><span style={{fontSize:13}}>{i.qty}</span><button onClick={() => changeQty(i.id,1)}><Plus size={12}/></button></div></div>) : <div className="empty">Your cart is empty. Add something you love.</div>)}{checkoutStep === "details" && <form id="checkout-form" className="form" onSubmit={placeOrder}><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Phone number<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Delivery address<textarea required rows={4} value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label><p style={{fontSize:11.5,color:C.muted,lineHeight:1.5}}>Demo checkout: connect your preferred UPI/card gateway before accepting live payments.</p></form>}{checkoutStep === "done" && <div style={{textAlign:"center",padding:"45px 12px"}}><div style={{width:56,height:56,borderRadius:"50%",background:C.aqua,display:"grid",placeItems:"center",margin:"0 auto 16px"}}><Check size={28}/></div><div className="sg" style={{fontWeight:700,fontSize:18}}>Thanks, {form.name.split(" ")[0] || "there"}!</div><p style={{fontSize:13,color:C.muted,lineHeight:1.6}}>Your order for {money(cartTotal)} has been noted. We’ll reach out on {form.phone} to confirm.</p></div>}</div>{checkoutStep !== "done" && <div className="drawer-foot"><div style={{display:"flex",justifyContent:"space-between",marginBottom:13}}><span style={{color:C.muted,fontSize:13}}>Total</span><strong className="sg">{money(cartTotal)}</strong></div>{checkoutStep === "cart" ? <button className="primary" disabled={!cartItems.length} onClick={() => setCheckoutStep("details")} style={{width:"100%",justifyContent:"center",background:cartItems.length?`linear-gradient(135deg,${C.aqua},${C.aqua2})`:`#ccd5d2`,border:0}}>Proceed to Checkout <ChevronRight size={16}/></button> : <button className="primary" type="submit" form="checkout-form" style={{width:"100%",justifyContent:"center",background:C.navy,color:"#fff",border:0}}>Place Order</button>}</div>}</div></div>}

      <a className="whatsapp-float" href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <MessageCircle size={27} />
      </a>
    </div>
  );
}

function ProductCard({ p, cart, addToCart, changeQty }) {
  return <div className="product-card"><ProductArt cat={p.cat}/><div className="product-body">{p.badge && <span className="product-badge">{p.badge}</span>}<div className="product-name">{p.name}</div><div className="product-note">{p.note}</div><div className="product-row"><span className="price">{priceLabel(p)}</span>{cart[p.id] ? <div className="qty"><button onClick={() => changeQty(p.id,-1)}><Minus size={12}/></button><span>{cart[p.id]}</span><button onClick={() => changeQty(p.id,1)}><Plus size={12}/></button></div> : <button className="add" onClick={() => addToCart(p.id)}>Add to cart</button>}</div></div></div>;
}
