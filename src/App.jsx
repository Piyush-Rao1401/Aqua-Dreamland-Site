import React, { useState, useMemo } from "react";
import {
  ShoppingBag, X, Plus, Minus, Check, ChevronRight, Waves,
  Fish, Flower2, Gem, Heart, MapPin, Phone, Search, Menu, Grid2X2, Sparkles, MessageCircle, Truck, Gift
} from "lucide-react";

// ---------- Design tokens ----------
// Deep water navy, glass teal, sand, brick-clay accent — an aquarium-shop-meets-craft-market identity
const C = {
  deep: "#06152B",
  deep2: "#0A1E3A",
  deepDark: "#020914",
  cyan: "#28D7FF",
  cyanSoft: "#9FEFFF",
  blue: "#4B7BFF",
  purple: "#A855F7",
  pink: "#F05BFF",
  white: "#F7FBFF",
  muted: "#A9BCD2",
  glass: "rgba(7, 24, 50, 0.56)",
  border: "rgba(116, 220, 255, 0.24)",
  ink: "#132025",
  cream: "#F7FBFF",
  sandDeep: "rgba(120,170,200,0.18)",
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

const CATEGORY_IMAGES = {
  aquariums: "/aquarium-card.jpg",
  "soft-toys": "/soft-toys-card.jpg",
  pots: "/pots-card.jpg",
  resin: "/resin-card.jpg",
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
  const meta = {
    aquariums: { icon: Fish, bg: "linear-gradient(135deg,#062B55,#0D8AB5,#182B77)" },
    "soft-toys": { icon: Heart, bg: "linear-gradient(135deg,#26124B,#8B3DB8,#E05ACB)" },
    pots: { icon: Flower2, bg: "linear-gradient(135deg,#062E38,#168A83,#9ACB6A)" },
    resin: { icon: Gem, bg: "linear-gradient(135deg,#251144,#6A39A6,#C05BFF)" },
  }[cat];
  const Icon = meta.icon;
  return (
    <div className="productArt" style={{ background: meta.bg }}>
      <div className="productArtGlow" />
      <Icon className="prodart-icon" size={48} color="rgba(255,255,255,.94)" strokeWidth={1.25} />
      <span className="productArtLabel">AQUA DREAMLAND</span>
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
    <div style={{ fontFamily: "'Work Sans', sans-serif", color: C.ink, background: C.deepDark, minHeight: "100%" }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${C.deepDark}}
button,input,textarea{font-family:inherit}
button{cursor:pointer}
.sg{font-family:'Space Grotesk',sans-serif}
.glass{backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.navLink{color:#B9C8DA;text-decoration:none;font-weight:700;font-size:14px;padding:11px 15px;border-radius:14px;transition:.22s}
.navLink:hover,.navLink.active{color:#fff;background:rgba(54,203,255,.11);box-shadow:inset 0 -2px 0 ${C.cyan},0 0 24px rgba(40,215,255,.12)}
.neonBtn{transition:.22s;position:relative;overflow:hidden}
.neonBtn:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(40,215,255,.25),0 0 24px rgba(168,85,247,.18)}
.neonBtn:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 20%,rgba(255,255,255,.25) 50%,transparent 80%);transform:translateX(-120%);transition:.7s}
.neonBtn:hover:before{transform:translateX(120%)}
.heroCard{position:relative;overflow:hidden;transition:.25s;min-height:194px}
.heroCard:hover{transform:translateY(-5px) scale(1.01);border-color:rgba(40,215,255,.7)!important;box-shadow:0 18px 45px rgba(0,0,0,.32),0 0 28px rgba(40,215,255,.13)}
.heroCard:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,.08) 48%,transparent 68%);transform:translateX(-130%);transition:.8s;pointer-events:none}
.heroCard:hover:after{transform:translateX(130%)}
.iconBubble{width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(40,215,255,.17),rgba(168,85,247,.16));border:1px solid rgba(126,225,255,.35);box-shadow:0 0 22px rgba(40,215,255,.11)}
.bubble{position:absolute;border:1px solid rgba(180,235,255,.35);border-radius:50%;background:rgba(80,200,255,.07);animation:floatBubble 7s ease-in-out infinite;pointer-events:none}
@keyframes floatBubble{0%,100%{transform:translateY(0) translateX(0);opacity:.2}50%{transform:translateY(-28px) translateX(9px);opacity:.8}}
@keyframes glow{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.95;transform:scale(1.08)}}
@keyframes drift{0%{transform:translateX(-10%)}100%{transform:translateX(10%)}}
.heroGlow{position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(72,102,255,.28),rgba(168,85,247,.12) 42%,transparent 70%);filter:blur(16px);animation:glow 8s ease-in-out infinite;pointer-events:none}
.lightRay{position:absolute;top:-10%;width:30%;height:125%;background:linear-gradient(180deg,rgba(120,220,255,.13),transparent 72%);filter:blur(25px);transform:rotate(14deg);pointer-events:none}
.gradientText{background:linear-gradient(90deg,#35E4FF 5%,#7AA8FF 42%,#D56CFF 82%);-webkit-background-clip:text;background-clip:text;color:transparent}
.statsPill{background:rgba(2,12,29,.58);border:1px solid rgba(102,210,255,.18);box-shadow:0 15px 40px rgba(0,0,0,.22)}
.statDivider{width:1px;height:34px;background:rgba(171,217,255,.18)}
.collection{background:radial-gradient(circle at 50% 0%,rgba(54,113,255,.12),transparent 32%),linear-gradient(180deg,#03112A,#020A18)}
.prodcard{transition:.25s;border:1px solid rgba(116,170,210,.18)!important;background:rgba(7,22,44,.72)!important;color:#fff}
.prodcard:hover{transform:translateY(-7px);border-color:rgba(40,215,255,.5)!important;box-shadow:0 20px 50px rgba(0,0,0,.32),0 0 26px rgba(40,215,255,.09)}
.productArt{aspect-ratio:4/3;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.productArtGlow{position:absolute;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.15);filter:blur(35px)}
.productArtLabel{position:absolute;bottom:10px;left:12px;font-size:9px;letter-spacing:.18em;color:rgba(255,255,255,.65)}
.catbtn{transition:.2s!important}
input:focus,textarea:focus{outline:2px solid ${C.cyan};outline-offset:1px}
.chatBtn{position:fixed;right:24px;bottom:24px;z-index:40;width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#21D4FD,#7A4DFF);color:white;border:1px solid rgba(255,255,255,.35);box-shadow:0 0 0 8px rgba(67,110,255,.08),0 14px 35px rgba(0,0,0,.35)}
@media(max-width:1100px){.heroMain{grid-template-columns:1fr!important}.fishSpace{min-height:470px!important}.heroGrid{max-width:760px;margin:0 auto}}\n@media(max-width:900px){.navLinks{display:none!important}.heroGrid{grid-template-columns:1fr 1fr!important}.heroTitle{font-size:clamp(42px,9vw,70px)!important}.navWrap{padding-left:16px!important;padding-right:16px!important}}
@media(max-width:620px){.heroGrid{grid-template-columns:1fr!important}.heroTitle{font-size:clamp(36px,12vw,54px)!important}.statsPill{display:grid!important;grid-template-columns:1fr!important}.statDivider{display:none}.chatBtn{right:16px;bottom:16px}.navWrap{padding-left:14px!important;padding-right:14px!important}.heroMain{gap:12px!important}.fishSpace{min-height:430px!important}.heroCard{min-height:170px!important}}
`}</style>

      {/* ---------- Header ---------- */}
      <header style={{ position:"sticky", top:0, zIndex:30, background:"rgba(2,9,20,.72)", backdropFilter:"blur(18px)", borderBottom:"1px solid rgba(93,205,255,.13)", color:C.white }}>
        <div className="navWrap" style={{ maxWidth:1550, margin:"0 auto", padding:"10px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
          <a href="#home" style={{display:"flex",alignItems:"center",gap:11,textDecoration:"none",color:"#fff"}}>
            <div style={{width:48,height:48,borderRadius:15,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg,rgba(22,188,255,.16),rgba(123,64,255,.18))",border:"1px solid rgba(55,220,255,.55)",boxShadow:"0 0 25px rgba(40,215,255,.13)"}}>
              <Waves size={25} color={C.cyan}/>
            </div>
            <div>
              <div className="sg" style={{fontSize:22,fontWeight:700,letterSpacing:"-.025em"}}>Aqua Dreamland</div>
              <div style={{fontSize:9.5,color:"#87A4BE",letterSpacing:".16em",textTransform:"uppercase"}}>Aquarium · Décor · More</div>
            </div>
          </a>
          <nav className="navLinks" style={{display:"flex",alignItems:"center",gap:4}}>
            <a className="navLink active" href="#home">Home</a>
            <a className="navLink" href="#shop" onClick={()=>setActiveCat("aquariums")}>Aquariums</a>
            <a className="navLink" href="#shop" onClick={()=>setActiveCat("soft-toys")}>Soft Toys</a>
            <a className="navLink" href="#shop" onClick={()=>setActiveCat("pots")}>Pots</a>
            <a className="navLink" href="#shop" onClick={()=>setActiveCat("resin")}>Resin Décor</a>
            <a className="navLink" href="#story">Our Story</a>
          </nav>
          <button onClick={openCart} className="neonBtn" style={{background:"linear-gradient(135deg,#20C8F4,#4A8CFF 55%,#A855F7)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",borderRadius:15,padding:"12px 18px",display:"flex",alignItems:"center",gap:8,fontWeight:800,fontSize:14,boxShadow:"0 8px 28px rgba(60,120,255,.18)"}}>
            <ShoppingBag size={17}/> Cart {cartCount>0?`· ${cartCount}`:"· 0"}
          </button>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section id="home" style={{position:"relative",overflow:"hidden",minHeight:"calc(100vh - 69px)",color:C.white,isolation:"isolate",backgroundImage:`linear-gradient(90deg,rgba(1,9,22,.78) 0%,rgba(2,13,32,.60) 34%,rgba(2,11,29,.18) 62%,rgba(2,7,18,.28) 100%),url("/betta-fish.jpg")`,backgroundSize:"cover",backgroundPosition:"center center",padding:"54px 22px 72px"}}>
        <div className="heroGlow" style={{top:-220,right:"16%"}}/>
        <div className="lightRay" style={{left:"34%"}}/><div className="lightRay" style={{left:"54%",opacity:.55}}/>
        {[["14px","14%","5%",""],["9px","42%","13%","1s"],["18px","22%","88%","2s"],["12px","64%","8%","2.8s"],["24px","10%","79%","1.7s"],["8px","48%","94%","3.2s"],["16px","74%","73%","2.1s"]].map((b,i)=><div key={i} className="bubble" style={{width:b[0],height:b[0],top:b[1],left:b[2],animationDelay:b[3]}}/>)}
        <div className="heroMain" style={{maxWidth:1550,margin:"0 auto",display:"grid",gridTemplateColumns:"1.02fr .98fr",gap:34,alignItems:"center",position:"relative",zIndex:2}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:9,padding:"8px 13px",borderRadius:999,background:"rgba(10,24,55,.58)",border:"1px solid rgba(76,213,255,.45)",boxShadow:"0 0 25px rgba(53,126,255,.13)",backdropFilter:"blur(14px)"}}>
              <Sparkles size={14} color={C.cyan}/><span style={{fontSize:11,fontWeight:800,letterSpacing:".16em",textTransform:"uppercase",color:"#D8F8FF"}}>Handpicked aquarium collection</span>
            </div>
            <div style={{color:"#A6D8E9",fontWeight:700,fontSize:12.5,margin:"22px 0 13px",letterSpacing:".18em",textTransform:"uppercase"}}>Aquariums · Soft Toys · Pots · Resin Décor</div>
            <h1 className="sg heroTitle" style={{fontSize:"clamp(44px,4.25vw,68px)",lineHeight:1.02,margin:0,fontWeight:700,letterSpacing:"-.055em",maxWidth:760}}>
              Everything for your<br/>
              <span className="gradientText" style={{fontStyle:"italic"}}>tank and everything</span><br/>
              around it.
            </h1>
            <p style={{marginTop:22,fontSize:16.2,lineHeight:1.65,color:"#C9D9E8",maxWidth:600}}>
              From a first 1-foot starter tank to a fully fitted 3-footer — plus the soft toys, pots, and resin pieces that finish a room. Built and picked by hand.
            </p>
            <div style={{display:"flex",gap:13,flexWrap:"wrap",marginTop:28}}>
              <button onClick={()=>{setActiveCat("aquariums");document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}} className="neonBtn" style={{background:"linear-gradient(135deg,#B83DFF,#4A75FF 48%,#18D7FF)",color:"#fff",border:"1px solid rgba(255,255,255,.28)",borderRadius:15,padding:"14px 22px",fontWeight:800,fontSize:15,boxShadow:"0 10px 34px rgba(84,83,255,.25)",display:"flex",alignItems:"center",gap:7}}>
                <ShoppingBag size={17}/> Shop Aquariums <ChevronRight size={16}/>
              </button>
              <button onClick={()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})} style={{background:"rgba(5,20,44,.45)",color:"#fff",border:"1px solid rgba(112,214,255,.42)",borderRadius:15,padding:"14px 22px",fontWeight:800,fontSize:15,backdropFilter:"blur(12px)",display:"flex",alignItems:"center",gap:7}}>
                <Grid2X2 size={17}/> Browse All Products <ChevronRight size={16}/>
              </button>
            </div>
            <div className="statsPill" style={{display:"flex",alignItems:"center",gap:0,marginTop:28,width:"fit-content",borderRadius:18,padding:"13px 16px"}}>
              {[["1–3 ft","aquarium sizes",Truck],["₹500+","starting tanks",Fish],["Handpicked","decor & gifts",Gift]].map(([a,b,I],i)=><React.Fragment key={a}>
                {i>0&&<div className="statDivider" style={{margin:"0 18px"}}/>}
                <div style={{display:"flex",alignItems:"center",gap:9,minWidth:130}}><I size={21} color={i===1?C.cyan:C.purple}/><div><div style={{fontWeight:800,fontSize:14}}>{a}</div><div style={{fontSize:10.5,color:"#89A6BE",marginTop:2}}>{b}</div></div></div>
              </React.Fragment>)}
            </div>
          </div>

          <div className="fishSpace" style={{position:"relative",minHeight:520}}>
            <div style={{position:"absolute",inset:"0 12% 0 0",background:"radial-gradient(circle at 45% 46%,rgba(74,146,255,.28),rgba(176,54,255,.18) 30%,transparent 68%)",filter:"blur(12px)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",inset:"6% 2% 4% 0",background:"radial-gradient(circle at 48% 48%,rgba(77,128,255,.25),rgba(161,74,255,.16) 28%,transparent 66%)",filter:"blur(16px)"}}/>
            <div className="heroGrid" style={{position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,paddingTop:34}}>
              {["aquariums","soft-toys","pots","resin"].map((c,idx)=>{
                const Icon=CAT_META[c].icon;
                const colors=["#1FD6FF","#D957FF","#44E5B7","#C36BFF"];
                return <button key={c} className="heroCard glass" onClick={()=>{setActiveCat(c);document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}} style={{textAlign:"left",position:"relative",background:"rgba(4,17,43,.60)",border:`1px solid ${colors[idx]}88`,borderRadius:18,padding:18,color:"#fff",boxShadow:"0 16px 42px rgba(0,0,0,.32)",minHeight:194}}>
                  <img src={CATEGORY_IMAGES[c]} alt="" loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.92,filter:"saturate(1.08) contrast(1.03)"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(3,14,35,.98) 0%,rgba(3,14,35,.90) 32%,rgba(3,14,35,.48) 66%,rgba(3,14,35,.12) 100%)"}}/>
                  <div style={{position:"relative",zIndex:2}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div className="iconBubble" style={{borderColor:colors[idx]+"88",background:"rgba(4,18,50,.72)"}}><Icon size={21} color={colors[idx]}/></div>
                      <div style={{width:36,height:36,borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(4,20,48,.48)",border:`1px solid ${colors[idx]}77`,boxShadow:`0 0 18px ${colors[idx]}22`}}><ChevronRight size={18} color="#fff"/></div>
                    </div>
                    <div className="sg" style={{fontSize:19,fontWeight:800,marginTop:15,textShadow:"0 2px 18px rgba(0,0,0,.72)"}}>{c==="soft-toys"?"Soft Toys":c==="resin"?"Resin Décor":c[0].toUpperCase()+c.slice(1)}</div>
                    <div style={{fontSize:12.3,lineHeight:1.52,color:"#E1ECF7",marginTop:7,maxWidth:235,textShadow:"0 2px 12px rgba(0,0,0,.82)"}}>{CAT_META[c].blurb}</div>
                  </div>
                </button>
              })}
            </div>
            <div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:5,color:"#CDEBFF",zIndex:3}}>
              <div style={{width:22,height:35,border:"1px solid rgba(255,255,255,.7)",borderRadius:14,display:"flex",justifyContent:"center",paddingTop:5}}><div style={{width:3,height:7,borderRadius:4,background:"#fff"}}/></div>
              <span style={{fontSize:9.5,letterSpacing:".18em"}}>EXPLORE MORE</span><ChevronRight size={15} style={{transform:"rotate(90deg)"}}/>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" style={{position:"absolute",bottom:-1,left:0,width:"100%",height:80,zIndex:3}}><path d="M0 46 C210 82 390 10 600 42 C800 74 1010 13 1200 40 L1200 80 L0 80 Z" fill="#020A18"/></svg>
      </section>

      {/* ---------- Collection intro ---------- */}
      <section id="story" className="collection" style={{color:"#fff",padding:"38px 20px 20px",textAlign:"center"}}>
        <div style={{display:"inline-flex",padding:"7px 13px",borderRadius:999,border:"1px solid rgba(120,125,255,.35)",background:"rgba(76,71,180,.12)",color:"#DCA7FF",fontSize:10.5,fontWeight:800,letterSpacing:".16em",textTransform:"uppercase"}}>Our collection</div>
        <h2 className="sg" style={{fontSize:"clamp(28px,4vw,42px)",margin:"12px 0 8px",letterSpacing:"-.035em"}}>Discover Our <span className="gradientText">Bestsellers</span></h2>
        <p style={{margin:"0 auto",maxWidth:610,color:"#8EA6BF",fontSize:14,lineHeight:1.6}}>Aquariums, gifts and décor designed to make your space feel a little more alive.</p>
      </section>

      {/* ---------- Shop ---------- */}
      <section id="shop" className="collection" style={{maxWidth:1280,margin:"0 auto",padding:"22px 22px 78px",color:"#fff"}}>
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
                    background: active ? "linear-gradient(135deg,#24D6FF,#5C70FF,#A855F7)" : "rgba(255,255,255,.035)",
                    color: "#fff",
                    border: `1px solid ${active ? "rgba(255,255,255,.28)" : "rgba(125,191,230,.18)"}`,
                    borderRadius: 999, padding: "9px 16px", fontSize: 14, fontWeight: 500,
                    boxShadow: active ? "0 8px 24px rgba(67,102,255,.24)" : "none",
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

        <p style={{ color: "#8EA6BF", fontSize: 14.5, marginBottom: 22, maxWidth: 620 }}>
          {CAT_META[activeCat].blurb}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
          {filtered.map((p) => (
            <div key={p.id} className="prodcard" style={{ background: "#fff", borderRadius: 18, overflow: "hidden" }}>
              <ProductArt cat={p.cat} />
              <div style={{ padding: 14 }}>
                <div className="sg" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 12.5, color: "#86A0BA", marginTop: 4 }}>{p.note}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <span className="sg" style={{ fontSize: 16.5, fontWeight: 700, color: C.cyan }}>{priceLabel(p)}</span>
                  {cart[p.id] ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => changeQty(p.id, -1)} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 14, textAlign: "center" }}>{cart[p.id]}</span>
                      <button onClick={() => changeQty(p.id, 1)} style={{ background: "linear-gradient(135deg,#1BCDF8,#586DFF)", border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={13} color="#fff" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="addbtn"
                      onClick={() => addToCart(p.id)}
                      style={{ background: "linear-gradient(135deg,#1BCDF8,#586DFF)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 600 }}
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

      <button className="chatBtn" aria-label="Chat with Aqua Dreamland"><MessageCircle size={28}/></button>

      {/* ---------- Footer ---------- */}
      <footer style={{ background: "#020914", color: "#7E99B3", padding: "34px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Waves size={17} color={C.tealLight} />
            <span className="sg" style={{ color: "#fff", fontWeight: 700 }}>Aqua Dreamland</span>
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
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(420px, 100%)", background: "#06152B", color:"#fff", display: "flex", flexDirection: "column", boxShadow:"-20px 0 60px rgba(0,0,0,.35)" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(140,200,240,.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                          <div style={{ fontSize: 12.5, color: "#86A0BA" }}>{priceLabel(i)} × {i.qty}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => changeQty(i.id, -1)} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, width: 24, height: 24 }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: 13.5, minWidth: 12, textAlign: "center" }}>{i.qty}</span>
                          <button onClick={() => changeQty(i.id, 1)} style={{ background: "linear-gradient(135deg,#1BCDF8,#586DFF)", border: "none", borderRadius: 8, width: 24, height: 24 }}>
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
                  <p style={{ fontSize: 12.5, color: "#86A0BA", lineHeight: 1.5 }}>
                    This demo captures the full order flow. Once the site is live, this step hands off to a payment gateway (UPI/cards) for real transactions.
                  </p>
                </form>
              )}

              {checkoutStep === "done" && (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#20D6FF,#7564FF)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Check size={26} color="#fff" />
                  </div>
                  <div className="sg" style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Thanks, {form.name.split(" ")[0] || "there"}!</div>
                  <p style={{ fontSize: 14, color: "#8EA6BF" }}>Your order for {money(cartTotal)} has been noted. We'll reach out on {form.phone} to confirm.</p>
                </div>
              )}
            </div>

            {checkoutStep !== "done" && (
              <div style={{ padding: 20, borderTop: "1px solid rgba(140,200,240,.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 15 }}>
                  <span style={{ color: "#8EA6BF" }}>Total</span>
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
