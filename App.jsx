import { useState } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id:"fb",  label:"Facebook",  icon:"📘", color:"#1877F2" },
  { id:"ig",  label:"Instagram", icon:"📸", color:"#E1306C" },
  { id:"wa",  label:"WhatsApp",  icon:"💬", color:"#25D366" },
  { id:"msg", label:"Messenger", icon:"💬", color:"#0099FF" },
];

const OBJECTIVES = [
  { id:"sales",   label:"Product Sales",   icon:"🛒", desc:"Drive purchases on website, landing page or shop" },
  { id:"leads",   label:"Lead Generation", icon:"🎯", desc:"Collect emails/phone numbers of real buyers" },
  { id:"traffic", label:"Traffic",         icon:"🌐", desc:"Send warm audiences to your landing page" },
  { id:"aware",   label:"Awareness",       icon:"📣", desc:"Reach new audiences at low CPM before retargeting" },
];

const AUDIENCE_TIERS = [
  {
    tier:"TOP (Cold)", color:"#3B82F6", bgColor:"#1e3a5f",
    desc:"Find new buyers who don't know you yet",
    methods:[
      { name:"Advantage+ Sales Campaign (ASC)", impact:"★★★★★",
        detail:"Let Meta AI find buyers automatically. No manual audiences. Works best with 50+ purchases/week. Set existing customer cap to 10-15%." },
      { name:"Lookalike 1-3% (from purchasers)", impact:"★★★★",
        detail:"Upload your customer email list → Meta finds people who behave identically. 1% = most similar. Use 2M-15M audience size for ideal balance." },
      { name:"Value-Based Lookalike (High LTV)", impact:"★★★★★",
        detail:"Upload customer list WITH purchase values. Meta finds high-spending lookalikes. Reduces CPO by up to 35% vs standard LLA." },
      { name:"Broad Targeting (AI-Guided)", impact:"★★★★",
        detail:"Age + gender only. No interests. Let Meta's algorithm explore freely. Works with ASC. Consolidate budget — don't fragment." },
      { name:"Interest Stacking (Niche Buyers)", impact:"★★★",
        detail:"Stack 3-5 tightly related interests. Audience size: 2M-15M. Avoid broad interests like 'Shopping' — too generic, wastes budget." },
    ]
  },
  {
    tier:"MIDDLE (Warm)", color:"#F59E0B", bgColor:"#3d2e0f",
    desc:"Re-engage people who showed interest but didn't buy",
    methods:[
      { name:"Video View Retargeting (75%+)", impact:"★★★★★",
        detail:"People who watched 75%+ of your video ads are hot leads. Retarget with direct offer/purchase CTA. CPO is typically 40-60% lower." },
      { name:"Website Visitors (30-day)", impact:"★★★★",
        detail:"All website visitors last 30 days. Exclude purchasers. Show social proof, reviews, urgency. Optimal audience: 10K-500K people." },
      { name:"Instagram Profile Engagers", impact:"★★★★",
        detail:"People who liked, saved, commented, or messaged your IG profile. Very warm. High purchase intent for product-based brands." },
      { name:"Add-to-Cart / Initiate Checkout", impact:"★★★★★",
        detail:"Highest purchase intent possible. Exclude purchasers. Use countdown offers, free shipping, or discount to close. Often 2-5x ROAS." },
      { name:"Lead Form Openers", impact:"★★★",
        detail:"People who opened but didn't submit your lead form. Retarget with simplified form or direct WhatsApp CTA." },
    ]
  },
  {
    tier:"BOTTOM (Hot)", color:"#EF4444", bgColor:"#3d1515",
    desc:"Convert people who almost bought — highest ROI segment",
    methods:[
      { name:"Initiate Checkout (7-day) Retarget", impact:"★★★★★",
        detail:"Last-mile conversion. Show testimonials, guarantee, scarcity. Use Cost Cap bidding. CPO can drop 60-80% vs cold traffic." },
      { name:"Dynamic Product Retargeting (Catalog)", impact:"★★★★★",
        detail:"Auto-shows exact products viewed/carted. Catalog-integrated. Meta data shows this delivers highest ROAS of any format." },
      { name:"Past Purchasers (Upsell/Cross-sell)", impact:"★★★★",
        detail:"Existing customers convert at 3-5x lower CPO than cold audiences. Show complementary products, bundles, or subscriptions." },
      { name:"WhatsApp Abandoned Cart Sequence", impact:"★★★★★",
        detail:"Click-to-WhatsApp retargeting → automated message → purchase link. Conversion rates 3-5x higher than email for product brands." },
    ]
  },
];

const CREATIVE_TYPES = [
  { name:"UGC Video (User-Generated)", score:98, platforms:["fb","ig"],
    why:"Authentic, raw content. Scrolling thumb stops. Highest CTR in 2026. Film on phone, not studio.",
    hooks:["'I tried this for 7 days...'", "'Stop scrolling if you have [problem]'", "'This changed everything about my [routine]'"],
    specs:"9:16 vertical, 15-60 sec, captions on (85% watch silent)" },
  { name:"Before/After (Product Result)", score:95, platforms:["fb","ig"],
    why:"Immediate visual proof. Drives curiosity. Works for beauty, fitness, home, food brands.",
    hooks:["Split-screen result reveal", "Timelapse transformation", "Side-by-side comparison"],
    specs:"1:1 or 4:5 for feed, 9:16 for Stories/Reels" },
  { name:"Collection Ad + Product Catalog", score:92, platforms:["fb","ig"],
    why:"Catalog-integrated collection ads = highest ROAS format for ecommerce. Meta AI dynamically shows most relevant products per user.",
    hooks:["Hero video/image top + 4 products grid below", "Personalized per user by Meta algorithm"],
    specs:"Requires product catalog in Commerce Manager. Min 4 products." },
  { name:"Click-to-WhatsApp Ad", score:90, platforms:["fb","ig","wa"],
    why:"Direct conversation = highest conversion rate for service/product brands. No website needed. Meta pushes this format heavily.",
    hooks:["'Chat with us for custom quote'", "'Message us — reply in 60 seconds'", "'Free consultation via WhatsApp'"],
    specs:"Any image/video format. CTA: 'Send Message' → WhatsApp" },
  { name:"Testimonial/Review Video", score:88, platforms:["fb","ig"],
    why:"Social proof builds trust instantly. Real customer face > polished ad. Reduces CPO by showing real results.",
    hooks:["Customer talks to camera", "Screenshot of 5-star review animated in", "Reaction video to product"],
    specs:"Keep under 30 seconds. First 3 seconds = face + problem statement." },
  { name:"Problem-Solution Hook Video", score:86, platforms:["fb","ig"],
    why:"Agitate the problem → present product as solution. High relevance = low CPM from Meta algorithm.",
    hooks:["'Are you still [doing painful thing]?'", "'Most people don't know this about [topic]'", "'Here's why your [product] isn't working'"],
    specs:"15-30 sec. Hook in first 2 seconds. CTA in last 5 seconds." },
];

const TRACKING_STEPS = [
  {
    step:1, title:"Install Meta Pixel (Base Code)",
    priority:"CRITICAL", impact:"Foundation",
    desc:"Every page of your website/landing page must have the Meta Pixel base code in the <head> section.",
    action:"Events Manager → Data Sources → Add → Web → Meta Pixel → Copy code → Paste on every page",
    tool:"Meta Events Manager (free)",
    result:"Tracks pageviews, starts building audience data"
  },
  {
    step:2, title:"Enable Conversions API (CAPI) — One Click",
    priority:"CRITICAL", impact:"−17.8% CPA",
    desc:"Since April 2026 Meta offers one-click CAPI setup — no code, no server, free. Pixel-only setups miss 50%+ of conversions. CAPI fills that gap.",
    action:"Events Manager → Data Sources → Your Pixel → Settings → Meta-enabled Conversions API → Enable",
    tool:"Built into Meta Events Manager (free, no-code)",
    result:"Recovers missing conversion data. CPA drops 17.8% average."
  },
  {
    step:3, title:"Set Up Purchase + Key Events",
    priority:"CRITICAL", impact:"Trains the Algorithm",
    desc:"You must fire correct events in the right order: ViewContent → AddToCart → InitiateCheckout → Purchase. Each event trains Meta's AI.",
    action:"Use Meta Pixel Helper Chrome extension to verify all events fire correctly on each page",
    tool:"Meta Pixel Helper (free Chrome extension)",
    result:"Algorithm knows who to target → lower CPO"
  },
  {
    step:4, title:"Optimize Event Match Quality (EMQ) to 7+",
    priority:"HIGH", impact:"−18 to −25% CPA",
    desc:"EMQ score measures how well Meta can match your conversion events to user profiles. Score 7-9 = major CPA reduction. Add email, phone, name to events.",
    action:"Events Manager → Your Pixel → Events → Check EMQ score. Add hashed customer identifiers: email, phone number, first/last name",
    tool:"CustomerLabs or native Shopify/WooCommerce CAPI connector",
    result:"EMQ 7+ → CPA drops 18-25%, ROAS increases 20-30%"
  },
  {
    step:5, title:"Enable Advanced Matching",
    priority:"HIGH", impact:"More Conversions Attributed",
    desc:"Auto-captures email/phone from form fields on your site and sends hashed data to Meta for better matching.",
    action:"Events Manager → Data Sources → Your Pixel → Settings → Automatic Advanced Matching → Turn ON",
    tool:"Meta Events Manager toggle",
    result:"More conversions attributed = better optimization signal"
  },
  {
    step:6, title:"Connect Your Product Catalog",
    priority:"HIGH (Ecommerce)", impact:"Enables Dynamic Ads",
    desc:"Required for Collection Ads, Dynamic Product Ads, and Advantage+ catalog campaigns — the highest-ROAS formats for product businesses.",
    action:"Commerce Manager → Catalog → Add Products → Connect your Shopify/WooCommerce store or upload CSV",
    tool:"Commerce Manager (free) + Shopify/WooCommerce integration",
    result:"Unlocks Collection Ads + Dynamic Retargeting — up to 5x ROAS"
  },
  {
    step:7, title:"Upload Customer Email List (First-Party Data)",
    priority:"HIGH", impact:"−25 to −35% CPA",
    desc:"Your customer email list = your most powerful targeting asset. Used to create Lookalikes and exclude existing buyers from cold campaigns.",
    action:"Ads Manager → Audiences → Custom Audience → Customer List → Upload CSV with email/phone/name columns",
    tool:"Ads Manager Audiences",
    result:"Lookalike audiences perform 25-35% better than interest targeting"
  },
  {
    step:8, title:"Set Up WhatsApp Business API",
    priority:"MEDIUM-HIGH", impact:"3-5x Higher Conversions",
    desc:"Connect your WhatsApp Business number to Meta for Click-to-WhatsApp ads. Direct conversation = highest conversion intent touchpoint.",
    action:"Business Manager → WhatsApp Accounts → Connect → Set up automated greeting message and quick replies",
    tool:"WhatsApp Business Manager + WhatsApp Business API",
    result:"Conversation-based sales. No website needed."
  },
];

const CAMPAIGN_STRUCTURE = {
  name:"3-Layer Meta Funnel (2026 Optimal)",
  layers:[
    {
      name:"LAYER 1 — AWARENESS (Cold Traffic)",
      budget:"30% of total budget",
      color:"#3B82F6",
      campaign:"Advantage+ Sales Campaign (ASC) OR Video Views",
      audience:"Broad / Lookalike 1-3% / ASC Auto",
      creative:"UGC video, Problem-Solution, Educational content",
      bidding:"Highest Volume (let Meta learn)",
      goal:"50+ purchases/week to exit learning phase",
      kpi:"CPM under $15, CTR above 1.5%, Video ThruPlay rate 20%+"
    },
    {
      name:"LAYER 2 — CONSIDERATION (Warm Retargeting)",
      budget:"30% of total budget",
      color:"#F59E0B",
      campaign:"Retargeting Campaign — Website Visitors + Video Viewers",
      audience:"Video 75%+ viewers, Website visitors 30-day, IG engagers",
      creative:"Testimonials, Before/After, Collection Ads with products",
      bidding:"Cost Cap (set at 1.2-1.5x target CPO)",
      goal:"Move warm leads to product page / checkout",
      kpi:"CTR above 3%, Add-to-Cart rate above 5%"
    },
    {
      name:"LAYER 3 — CONVERSION (Hot Retargeting)",
      budget:"40% of total budget",
      color:"#EF4444",
      campaign:"Dynamic Product Ads + Click-to-WhatsApp",
      audience:"Add-to-Cart, Initiate Checkout (7-day), exclude purchasers",
      creative:"Dynamic catalog ads, Countdown offer, WhatsApp CTA",
      bidding:"Cost Cap OR Bid Cap (protect CPO tightly)",
      goal:"Close the sale at lowest possible CPO",
      kpi:"ROAS 3x+, CPO below industry benchmark"
    },
  ]
};

const COST_BENCHMARKS = [
  { category:"Fashion/Apparel",    cpc:"$0.45", cpm:"$9.50",  cpa:"$29.99", roas:"3.8x" },
  { category:"Beauty & Skincare",  cpc:"$0.68", cpm:"$11.20", cpa:"$32.40", roas:"4.52x" },
  { category:"Home & Garden",      cpc:"$0.85", cpm:"$12.80", cpa:"$38.10", roas:"3.1x" },
  { category:"Food & Beverage",    cpc:"$0.52", cpm:"$10.40", cpa:"$31.20", roas:"3.5x" },
  { category:"Electronics",        cpc:"$1.20", cpm:"$14.90", cpa:"$49.48", roas:"2.6x" },
  { category:"Health/Supplements", cpc:"$1.45", cpm:"$18.20", cpa:"$78.90", roas:"2.3x" },
  { category:"Lead Generation",    cpc:"$1.92", cpm:"$14.19", cpa:"$27.66", roas:"—"    },
];

const BUDGET_GUIDE = [
  { range:"$5–$20/day",   stage:"Learning Phase",    advice:"Optimize for Add-to-Cart first, not Purchase. Need 50 events/week to exit learning. Start with 1 campaign, 1 ad set, 3-5 creatives." },
  { range:"$20–$100/day", stage:"Early Optimization", advice:"Switch optimization to Purchase once you have data. Test ASC vs manual. Consolidate — don't split into many campaigns. Scale winning creatives." },
  { range:"$100–$500/day",stage:"Scale Phase",        advice:"One consolidated campaign beats five smaller ones. Increase budget max 20-30% every 3-4 days. Add 2nd campaign for retargeting layer." },
  { range:"$500+/day",    stage:"Full Funnel Scale",  advice:"Full 3-layer funnel. 30/30/40 budget split. Dedicated creative team. Walk-forward creative testing. ASC + manual hybrid." },
];

// ── COMPONENTS ───────────────────────────────────────────────────────────────
const C = {
  accent: "#0866FF",
  green:  "#00C851",
  amber:  "#FF8800",
  red:    "#FF3333",
  card:   "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
};

function Badge({ children, color = C.accent }) {
  return (
    <span style={{
      display:"inline-block", fontSize:9, fontWeight:700, letterSpacing:1,
      color, border:`1px solid ${color}55`, borderRadius:4, padding:"2px 7px",
      background:`${color}11`
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.border}`, borderRadius:14,
      padding:"18px 20px", ...style
    }}>{children}</div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:20, fontWeight:700,
        color:"#fff", lineHeight:1.2 }}>{children}</div>
      {sub && <div style={{ fontSize:11, color:"#5a6a80", marginTop:4, letterSpacing:0.5 }}>{sub}</div>}
    </div>
  );
}

function ImpactStars({ val }) {
  const n = val.split("★").length - 1;
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:10, color: i <= n ? "#F59E0B" : "#2a3a50" }}>★</span>
      ))}
    </div>
  );
}

// ── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"overview",   label:"🗺 System Overview" },
  { id:"audience",   label:"🎯 Audience Layers" },
  { id:"creative",   label:"🎬 Creative Engine" },
  { id:"tracking",   label:"📡 Tracking Setup" },
  { id:"structure",  label:"🏗 Campaign Structure" },
  { id:"budget",     label:"💰 Budget & Costs" },
];

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function MetaAdsSystem() {
  const [tab, setTab] = useState("overview");
  const [openAudience, setOpenAudience] = useState(null);
  const [openCreative, setOpenCreative] = useState(null);
  const [openTracking, setOpenTracking] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);

  return (
    <div style={{
      minHeight:"100vh", background:"#080c14",
      color:"#c8d4e8", fontFamily:"'DM Sans', system-ui, sans-serif",
      padding:"20px 16px", boxSizing:"border-box"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#1e2e44;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.5}}
        .tab-btn:hover{background:rgba(255,255,255,0.06)!important;color:#aaa!important}
        .expand-btn:hover{border-color:rgba(255,255,255,0.15)!important}
        .method-row:hover{background:rgba(255,255,255,0.04)!important}
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:26, fontWeight:800, color:"#fff",
              lineHeight:1.1, marginBottom:6 }}>
              Meta Ads<br/>
              <span style={{ color:C.accent }}>Intelligence System</span>
            </div>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:1 }}>
              REAL CUSTOMER TARGETING · LOW COST-PER-ORDER · 2026
            </div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {PLATFORMS.map(p => (
              <div key={p.id} style={{
                display:"flex", alignItems:"center", gap:5, padding:"5px 10px",
                background:`${p.color}18`, border:`1px solid ${p.color}40`,
                borderRadius:8, fontSize:10, color:p.color
              }}>
                <span>{p.icon}</span>{p.label}
              </div>
            ))}
          </div>
        </div>

        {/* Key numbers from research */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:16 }}>
          {[
            { val:"−17.8%", label:"CPA with CAPI", color:C.green },
            { val:"−35%",   label:"CPA with Value LLA", color:C.green },
            { val:"5x",     label:"ROAS possible (bottom funnel)", color:"#F59E0B" },
            { val:"50+",    label:"Purchases/week to exit learning", color:C.accent },
          ].map(m => (
            <div key={m.label} style={{
              background:C.card, border:`1px solid ${C.border}`, borderRadius:10,
              padding:"10px 12px", textAlign:"center"
            }}>
              <div style={{ fontFamily:"'DM Mono', monospace", fontSize:18, fontWeight:700, color:m.color }}>
                {m.val}
              </div>
              <div style={{ fontSize:9, color:"#3a5070", marginTop:3, lineHeight:1.4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{ display:"flex", gap:4, marginBottom:20, flexWrap:"wrap",
        borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:4 }}>
        {TABS.map(t => (
          <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{
            background: tab===t.id ? "rgba(8,102,255,0.18)" : "transparent",
            border: tab===t.id ? `1px solid ${C.accent}44` : "1px solid transparent",
            borderRadius:8, padding:"7px 13px", cursor:"pointer", fontSize:11, fontWeight:500,
            color: tab===t.id ? C.accent : "#3a5070", transition:"all 0.2s", whiteSpace:"nowrap"
          }}>{t.label}</button>
        ))}
      </div>

      {/* ══ TAB: OVERVIEW ══ */}
      {tab==="overview" && (
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <SectionTitle sub="The complete picture of how the system works to get real buyers at the lowest cost">
            How to Get Real Buyers at Low Cost
          </SectionTitle>

          {/* The core problem → solution */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <Card style={{ borderColor:"#ff333333" }}>
              <div style={{ fontSize:11, color:C.red, letterSpacing:2, marginBottom:10, fontWeight:600 }}>
                ❌ WHY YOUR ADS ARE EXPENSIVE NOW
              </div>
              {[
                "Pixel-only tracking misses 50%+ of conversions → algorithm trains on bad data",
                "Too many small campaigns fragment your budget → each learns slowly",
                "Targeting too narrow (&lt;500K) → CPM jumps 40-60%",
                "Only running cold traffic → no retargeting = wasted awareness spend",
                "Creative fatigue → same ad too long → CTR drops → Meta charges more",
                "No first-party data → interest targeting = guessing, not targeting",
                "Optimizing for wrong event (Leads instead of Purchase) → wrong buyers",
              ].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                  <span style={{ color:C.red, fontSize:12, marginTop:1 }}>✗</span>
                  <span style={{ fontSize:11, color:"#8899aa", lineHeight:1.5 }}>{t}</span>
                </div>
              ))}
            </Card>
            <Card style={{ borderColor:"#00C85133" }}>
              <div style={{ fontSize:11, color:C.green, letterSpacing:2, marginBottom:10, fontWeight:600 }}>
                ✅ HOW THIS SYSTEM FIXES IT
              </div>
              {[
                "Pixel + CAPI together → recover all conversions → algorithm learns correctly",
                "1 consolidated campaign → more budget per pool → faster learning phase exit",
                "Audience 2M-15M sweet spot → Meta AI has room to optimize",
                "3-Layer Funnel → Cold + Warm + Hot all running → full buyer journey covered",
                "Fresh UGC creative every 2-4 weeks → maintains CTR → CPM stays low",
                "Customer email list → Lookalike audiences → 25-35% lower CPO",
                "Optimize for Purchase (or Initiate Checkout) → attract real buyers",
              ].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                  <span style={{ color:C.green, fontSize:12, marginTop:1 }}>✓</span>
                  <span style={{ fontSize:11, color:"#8899aa", lineHeight:1.5 }}>{t}</span>
                </div>
              ))}
            </Card>
          </div>

          {/* Campaign objectives */}
          <Card style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2, marginBottom:14, fontWeight:600 }}>
              CHOOSE YOUR CAMPAIGN OBJECTIVE CORRECTLY
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
              {OBJECTIVES.map(o => (
                <div key={o.id} style={{ padding:"12px 14px",
                  background:"rgba(255,255,255,0.03)", borderRadius:10,
                  border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize:14, marginBottom:5 }}>{o.icon}
                    <span style={{ fontSize:11, fontWeight:600, color:"#ccc", marginLeft:8 }}>{o.label}</span>
                  </div>
                  <div style={{ fontSize:11, color:"#5a6a80", lineHeight:1.5 }}>{o.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(8,102,255,0.08)",
              borderRadius:8, border:"1px solid rgba(8,102,255,0.2)" }}>
              <span style={{ fontSize:11, color:C.accent, fontWeight:600 }}>⚡ Key Rule: </span>
              <span style={{ fontSize:11, color:"#8899aa" }}>
                Always choose "Sales" objective and optimize for "Purchase" if you sell products. Never use Traffic or Engagement objectives for ecommerce — Meta will find clickers, not buyers.
              </span>
            </div>
          </Card>

          {/* Quick start checklist */}
          <Card>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2, marginBottom:14, fontWeight:600 }}>
              🚀 QUICK START — DO THESE FIRST (IN ORDER)
            </div>
            {[
              { n:1, t:"Install Meta Pixel on ALL pages of your website/landing page", done:false },
              { n:2, t:"Enable Conversions API (CAPI) — one-click in Events Manager (April 2026, free)", done:false },
              { n:3, t:"Verify Purchase event fires on thank-you/confirmation page", done:false },
              { n:4, t:"Upload customer email list to create Custom Audience + Lookalike 1%", done:false },
              { n:5, t:"Connect product catalog in Commerce Manager (ecommerce)", done:false },
              { n:6, t:"Create 3-5 UGC video creatives (film on phone, authentic)", done:false },
              { n:7, t:"Launch 1 ASC campaign with Highest Volume bid, $30-50/day minimum", done:false },
              { n:8, t:"Wait 7-14 days for learning phase. Do NOT edit campaign during this period.", done:false },
              { n:9, t:"Set up retargeting campaign (Layer 2) once Layer 1 gets 50+ purchases/week", done:false },
              { n:10,t:"Add Click-to-WhatsApp ad for bottom-funnel hot leads", done:false },
            ].map(item => (
              <div key={item.n} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                <div style={{ minWidth:22, height:22, borderRadius:"50%",
                  background:"rgba(8,102,255,0.2)", border:"1px solid rgba(8,102,255,0.4)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:9, fontWeight:700, color:C.accent, flexShrink:0 }}>{item.n}</div>
                <span style={{ fontSize:11, color:"#8899aa", lineHeight:1.5, paddingTop:3 }}>{item.t}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══ TAB: AUDIENCE ══ */}
      {tab==="audience" && (
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <SectionTitle sub="3-tier funnel: find new buyers → warm up → convert at lowest CPO">
            Audience Targeting Layers
          </SectionTitle>
          {AUDIENCE_TIERS.map((tier, ti) => (
            <div key={ti} style={{ marginBottom:16 }}>
              <div style={{
                display:"flex", alignItems:"center", gap:10, marginBottom:10,
                padding:"10px 14px", background:tier.bgColor, borderRadius:10,
                border:`1px solid ${tier.color}40`
              }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:tier.color, flexShrink:0 }}/>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:tier.color, letterSpacing:1 }}>{tier.tier}</div>
                  <div style={{ fontSize:10, color:"#5a6a80" }}>{tier.desc}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {tier.methods.map((m, mi) => {
                  const key = `${ti}-${mi}`;
                  const open = openAudience === key;
                  return (
                    <div key={mi} style={{
                      background:C.card, border:`1px solid ${C.border}`, borderRadius:10,
                      overflow:"hidden"
                    }}>
                      <div className="method-row" onClick={() => setOpenAudience(open ? null : key)}
                        style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                          padding:"12px 16px", cursor:"pointer", transition:"background 0.2s" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:11, fontWeight:600, color:"#ccd" }}>{m.name}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <ImpactStars val={m.impact}/>
                          <span style={{ fontSize:14, color:"#3a5070", transition:"transform 0.2s",
                            transform: open ? "rotate(90deg)" : "none" }}>›</span>
                        </div>
                      </div>
                      {open && (
                        <div style={{ padding:"0 16px 14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ fontSize:11, color:"#8899aa", lineHeight:1.7, marginTop:12 }}>
                            {m.detail}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <Card>
            <div style={{ fontSize:11, color:"#F59E0B", letterSpacing:2, marginBottom:10, fontWeight:600 }}>
              ⚠ AUDIENCE SIZE RULES (2026)
            </div>
            {[
              ["Too Narrow (&lt;500K)", "CPM increases 40-60%. Limited inventory. Algorithm can't optimize.", C.red],
              ["Sweet Spot (2M–15M)", "Best balance of relevance + scale. Ideal for most product brands.", C.green],
              ["Too Broad (&gt;50M)", "Wastes budget on unqualified clicks. Only works with strong ASC + pixel data.", C.amber],
            ].map(([label, desc, color]) => (
              <div key={label} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                <Badge color={color}>{label}</Badge>
                <span style={{ fontSize:11, color:"#8899aa", lineHeight:1.5 }}>{desc}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══ TAB: CREATIVE ══ */}
      {tab==="creative" && (
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <SectionTitle sub="Creative is the #1 lever for lowering CPO in 2026 — Meta's algorithm finds the buyer, your creative makes them buy">
            Creative Engine — What Actually Works
          </SectionTitle>
          <div style={{ padding:"10px 14px", background:"rgba(8,102,255,0.08)", borderRadius:8,
            border:"1px solid rgba(8,102,255,0.2)", marginBottom:16 }}>
            <span style={{ fontSize:11, color:C.accent, fontWeight:600 }}>2026 Reality: </span>
            <span style={{ fontSize:11, color:"#8899aa" }}>
              UGC (user-generated content) consistently outperforms polished studio ads by 2-3x CTR. Film on your phone. Authentic &gt; Perfect. Refresh creative every 2-4 weeks to prevent fatigue.
            </span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {CREATIVE_TYPES.map((c, i) => {
              const open = openCreative === i;
              return (
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                  <div className="method-row" onClick={() => setOpenCreative(open ? null : i)}
                    style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"14px 16px", cursor:"pointer", transition:"background 0.2s" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:"#dde" }}>{c.name}</span>
                        <div style={{ display:"flex", gap:4 }}>
                          {c.platforms.map(p => {
                            const pl = PLATFORMS.find(x => x.id === p);
                            return pl ? <span key={p} style={{ fontSize:9, color:pl.color }}>{pl.icon}</span> : null;
                          })}
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:"#3a5070" }}>Effectiveness Score: {c.score}/100</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:40, height:4, background:"#1a2535", borderRadius:2 }}>
                        <div style={{ width:`${c.score}%`, height:"100%", background:
                          c.score >= 90 ? C.green : c.score >= 80 ? C.amber : C.red,
                          borderRadius:2 }}/>
                      </div>
                      <span style={{ fontSize:14, color:"#3a5070", transition:"transform 0.2s",
                        transform: open ? "rotate(90deg)" : "none" }}>›</span>
                    </div>
                  </div>
                  {open && (
                    <div style={{ padding:"0 16px 16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <div>
                          <div style={{ fontSize:9, color:"#3a5070", letterSpacing:2, marginBottom:6 }}>WHY IT WORKS</div>
                          <div style={{ fontSize:11, color:"#8899aa", lineHeight:1.6 }}>{c.why}</div>
                          <div style={{ marginTop:10 }}>
                            <div style={{ fontSize:9, color:"#3a5070", letterSpacing:2, marginBottom:6 }}>SPECS</div>
                            <div style={{ fontSize:11, color:"#5a6a80", fontFamily:"'DM Mono', monospace" }}>{c.specs}</div>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize:9, color:"#3a5070", letterSpacing:2, marginBottom:8 }}>PROVEN HOOKS / ANGLES</div>
                          {c.hooks.map((h, hi) => (
                            <div key={hi} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                              <span style={{ color:C.accent, fontSize:10, flexShrink:0, marginTop:1 }}>→</span>
                              <span style={{ fontSize:11, color:"#8899aa", lineHeight:1.5, fontStyle:"italic" }}>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Card style={{ marginTop:16 }}>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2, marginBottom:12, fontWeight:600 }}>
              🔄 CREATIVE REFRESH SCHEDULE
            </div>
            {[
              ["Week 1-2",  "Launch 3-5 creatives. Monitor CTR and hook rate (3-sec video views).", "#3B82F6"],
              ["Week 3",    "Kill bottom 2 performers. Scale budget 20% on top performer.", C.green],
              ["Week 4",    "Introduce 2 new creative variations based on top performer's angle.", C.amber],
              ["Week 5-6",  "If CTR drops 30%+ vs baseline → creative fatigue. Launch new batch.", C.red],
              ["Ongoing",   "Maintain minimum 2-3 active creatives per ad set at all times.", "#9333EA"],
            ].map(([week, action, color]) => (
              <div key={week} style={{ display:"flex", gap:10, marginBottom:9, alignItems:"flex-start" }}>
                <Badge color={color}>{week}</Badge>
                <span style={{ fontSize:11, color:"#8899aa", lineHeight:1.5 }}>{action}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══ TAB: TRACKING ══ */}
      {tab==="tracking" && (
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <SectionTitle sub="Tracking quality = algorithm quality = lower CPO. This is the foundation everything else depends on.">
            Tracking Setup — Signal Quality System
          </SectionTitle>
          <div style={{ padding:"12px 14px", background:"rgba(239,68,68,0.08)", borderRadius:8,
            border:"1px solid rgba(239,68,68,0.2)", marginBottom:16 }}>
            <span style={{ fontSize:11, color:C.red, fontWeight:600 }}>Critical: </span>
            <span style={{ fontSize:11, color:"#8899aa" }}>
              Pixel-only setups in 2026 miss 50%+ of real conversions due to iOS restrictions + ad blockers. Meta's AI optimizes toward the signal it receives — bad signal = wrong buyers = high CPO.
            </span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {TRACKING_STEPS.map((s, i) => {
              const open = openTracking === i;
              const priColor = s.priority==="CRITICAL" ? C.red : s.priority==="HIGH" ? C.amber : C.green;
              return (
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                  <div className="method-row" onClick={() => setOpenTracking(open ? null : i)}
                    style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"13px 16px", cursor:"pointer", transition:"background 0.2s" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ minWidth:26, height:26, borderRadius:"50%",
                        background:`${priColor}22`, border:`1px solid ${priColor}55`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:10, fontWeight:700, color:priColor, flexShrink:0 }}>{s.step}</div>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color:"#cdd", marginBottom:4 }}>{s.title}</div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          <Badge color={priColor}>{s.priority}</Badge>
                          <Badge color="#9333EA">{s.impact}</Badge>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize:14, color:"#3a5070", transition:"transform 0.2s", flexShrink:0, marginLeft:8,
                      transform: open ? "rotate(90deg)" : "none" }}>›</span>
                  </div>
                  {open && (
                    <div style={{ padding:"0 16px 16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ marginTop:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <div>
                          <div style={{ fontSize:9, color:"#3a5070", letterSpacing:2, marginBottom:6 }}>WHAT IT DOES</div>
                          <div style={{ fontSize:11, color:"#8899aa", lineHeight:1.6 }}>{s.desc}</div>
                          <div style={{ marginTop:10 }}>
                            <div style={{ fontSize:9, color:"#3a5070", letterSpacing:2, marginBottom:6 }}>RESULT</div>
                            <div style={{ fontSize:11, color:C.green, lineHeight:1.5 }}>{s.result}</div>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize:9, color:"#3a5070", letterSpacing:2, marginBottom:6 }}>HOW TO DO IT</div>
                          <div style={{ fontSize:11, color:"#8899aa", lineHeight:1.6, fontFamily:"'DM Mono', monospace",
                            background:"rgba(0,0,0,0.3)", padding:"8px 10px", borderRadius:6 }}>{s.action}</div>
                          <div style={{ marginTop:8 }}>
                            <div style={{ fontSize:9, color:"#3a5070", letterSpacing:2, marginBottom:4 }}>TOOL</div>
                            <div style={{ fontSize:11, color:C.accent }}>{s.tool}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ TAB: STRUCTURE ══ */}
      {tab==="structure" && (
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <SectionTitle sub="The exact campaign architecture that maximizes Meta's AI while minimizing wasted spend">
            Campaign Structure — 3-Layer Funnel
          </SectionTitle>
          <div style={{ padding:"10px 14px", background:"rgba(249,115,22,0.08)", borderRadius:8,
            border:"1px solid rgba(249,115,22,0.2)", marginBottom:16 }}>
            <span style={{ fontSize:11, color:"#F59E0B", fontWeight:600 }}>2026 Rule: </span>
            <span style={{ fontSize:11, color:"#8899aa" }}>
              Budget fragmentation kills performance. One campaign at $500/day outperforms five campaigns at $100/day. Consolidate, then scale.
            </span>
          </div>

          {CAMPAIGN_STRUCTURE.layers.map((layer, i) => (
            <Card key={i} style={{ marginBottom:14, borderColor:`${layer.color}33` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:layer.color }}/>
                <div style={{ fontSize:12, fontWeight:700, color:layer.color, letterSpacing:1 }}>{layer.name}</div>
                <Badge color={layer.color}>{layer.budget}</Badge>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  ["Campaign Type", layer.campaign],
                  ["Audience",      layer.audience],
                  ["Creative",      layer.creative],
                  ["Bidding",       layer.bidding],
                  ["Goal",          layer.goal],
                  ["KPIs",          layer.kpi],
                ].map(([label, val]) => (
                  <div key={label} style={{ padding:"9px 11px", background:"rgba(0,0,0,0.2)", borderRadius:8 }}>
                    <div style={{ fontSize:9, color:"#3a5070", letterSpacing:1.5, marginBottom:5 }}>{label}</div>
                    <div style={{ fontSize:10, color:"#aab", lineHeight:1.5 }}>{val}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <Card>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2, marginBottom:14, fontWeight:600 }}>
              BIDDING STRATEGY GUIDE
            </div>
            {[
              { strat:"Highest Volume",    use:"Starting out, learning phase. Let Meta explore freely.", best:"Layer 1 cold traffic, new products", color:C.accent },
              { strat:"Cost Cap",          use:"You have a target CPO. Meta tries to stay at/below your cap.", best:"Layer 2 warm retargeting, stable campaigns", color:C.green },
              { strat:"Bid Cap",           use:"Strict maximum bid per auction. Protects CPO tightly.", best:"Layer 3 hot retargeting, bottom funnel", color:C.amber },
              { strat:"Value Optimization",use:"Maximizes total purchase value, not just conversion count.", best:"High-AOV ecommerce brands with purchase value data", color:"#9333EA" },
            ].map(s => (
              <div key={s.strat} style={{ marginBottom:12, padding:"10px 12px",
                background:"rgba(255,255,255,0.02)", borderRadius:8, border:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4, flexWrap:"wrap", gap:6 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#cdd" }}>{s.strat}</div>
                  <Badge color={s.color}>{s.best}</Badge>
                </div>
                <div style={{ fontSize:10, color:"#5a6a80", lineHeight:1.5 }}>{s.use}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ══ TAB: BUDGET ══ */}
      {tab==="budget" && (
        <div style={{ animation:"fadeUp 0.3s ease" }}>
          <SectionTitle sub="Real 2026 benchmarks by industry + budget strategy by spend level">
            Budget, Costs & Benchmarks
          </SectionTitle>

          {/* Budget tiers */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2, marginBottom:12, fontWeight:600 }}>
              SELECT YOUR DAILY BUDGET
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:12 }}>
              {BUDGET_GUIDE.map((b, i) => (
                <div key={i} onClick={() => setSelectedBudget(selectedBudget === i ? null : i)}
                  style={{ padding:"12px 14px", background: selectedBudget===i ? "rgba(8,102,255,0.15)" : C.card,
                    border: `1px solid ${selectedBudget===i ? C.accent+"66" : C.border}`,
                    borderRadius:10, cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ fontSize:13, fontWeight:700, color: selectedBudget===i ? C.accent : "#fff",
                    fontFamily:"'DM Mono', monospace", marginBottom:4 }}>{b.range}</div>
                  <div style={{ fontSize:9, color:C.accent, letterSpacing:1, marginBottom:6 }}>{b.stage}</div>
                  {selectedBudget === i && (
                    <div style={{ fontSize:11, color:"#8899aa", lineHeight:1.6, marginTop:8,
                      borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:8 }}>{b.advice}</div>
                  )}
                </div>
              ))}
            </div>
            {selectedBudget === null && (
              <div style={{ fontSize:10, color:"#3a5070", textAlign:"center" }}>
                Tap a budget tier to see the strategy
              </div>
            )}
          </div>

          {/* Industry benchmarks */}
          <Card>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2, marginBottom:12, fontWeight:600 }}>
              2026 META ADS BENCHMARKS BY INDUSTRY
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
                <thead>
                  <tr>
                    {["Category","CPC","CPM","CPA (CPO)","ROAS"].map(h => (
                      <th key={h} style={{ textAlign:"left", padding:"6px 10px",
                        fontSize:8, color:"#3a5070", letterSpacing:2, fontWeight:600,
                        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COST_BENCHMARKS.map((row, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding:"8px 10px", color:"#aab", fontWeight:500 }}>{row.category}</td>
                      <td style={{ padding:"8px 10px", color:C.green, fontFamily:"'DM Mono', monospace" }}>{row.cpc}</td>
                      <td style={{ padding:"8px 10px", color:"#778899", fontFamily:"'DM Mono', monospace" }}>{row.cpm}</td>
                      <td style={{ padding:"8px 10px", color:C.amber, fontFamily:"'DM Mono', monospace" }}>{row.cpa}</td>
                      <td style={{ padding:"8px 10px", color:C.accent, fontFamily:"'DM Mono', monospace" }}>{row.roas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop:10, fontSize:9, color:"#2a3a50" }}>
              Source: Meta Ads Benchmarks 2026 · Median CPA across all industries: $38.19 (38% increase from 2025 due to iOS changes)
            </div>
          </Card>

          {/* Learning phase */}
          <Card style={{ marginTop:12 }}>
            <div style={{ fontSize:11, color:"#3a5070", letterSpacing:2, marginBottom:12, fontWeight:600 }}>
              ⏳ THE LEARNING PHASE — WHY YOUR ADS COST MORE AT START
            </div>
            {[
              ["What it is", "Meta needs 50 optimization events/week before its AI stabilizes. During this period, CPA is 20-50% higher than normal."],
              ["Fast exit (7 days)", "Budget $300+/day, high-converting product, optimized pixel. Gets enough signal quickly."],
              ["Normal exit (14 days)", "Budget $100-300/day. Standard for most businesses."],
              ["Stuck in learning", "Budget under $50/day or low-conversion product. Solution: Optimize for Add-to-Cart first, switch to Purchase later."],
              ["Critical rule", "DO NOT edit your campaign during learning phase. Every significant edit resets the learning clock."],
            ].map(([label, val]) => (
              <div key={label} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                <div style={{ minWidth:100, fontSize:9, color:C.accent, letterSpacing:1,
                  paddingTop:2, fontWeight:600 }}>{label}</div>
                <div style={{ fontSize:11, color:"#8899aa", lineHeight:1.5 }}>{val}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ marginTop:20, padding:"10px 14px", background:"rgba(0,0,0,0.3)",
        borderRadius:8, border:"1px solid rgba(255,255,255,0.04)",
        fontSize:9, color:"#1e2e44", lineHeight:1.7 }}>
        Meta Ads Intelligence System · Based on 2026 data from Meta Business, industry benchmarks, and performance research ·
        All platform names and trademarks belong to Meta Platforms Inc. · For educational and strategic use.
      </div>
    </div>
  );
}
