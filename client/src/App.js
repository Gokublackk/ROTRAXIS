import { useState, useEffect, useRef } from "react";

// ── Smooth scroll helper ──────────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Intersection observer hook ────────────────────────────────────────
function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const v = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`, ...style }}>
      {children}
    </div>
  );
}

// ── Palette ───────────────────────────────────────────────────────────
const C = {
  bg: "#f4f6fb",
  card: "#ffffff",
  navy: "#0b1f3a",
  accent: "#0057ff",
  accent2: "#00b4d8",
  red: "#e63946",
  green: "#06d6a0",
  text: "#1a2840",
  muted: "#5a6e8a",
  border: "#dde4f0",
  grad: "linear-gradient(135deg,#0057ff 0%,#00b4d8 100%)",
};

// ── NAVBAR ────────────────────────────────────────────────────────────
const LINKS = [
  { label: "Home",        id: "home" },
  { label: "Problem",     id: "problem" },
  { label: "Solution",    id: "solution" },
  { label: "Features",    id: "features" },
  { label: "How It Works",id: "howitworks" },
  { label: "Use Cases",   id: "usecases" },
  { label: "Vision",      id: "vision" },
  { label: "Contact",     id: "contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      // highlight active section
      for (let i = LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(LINKS[i].id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(LINKS[i].id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${C.bg};font-family:'DM Sans',sans-serif;color:${C.text}}
        ::selection{background:${C.accent};color:#fff}
        input,textarea{font-family:'DM Sans',sans-serif}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all 0.3s", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "1.25rem", letterSpacing: 2 }}>
            <span style={{ color: C.navy }}>ROT</span><span style={{ color: C.accent }}>RAXIS</span>
          </button>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: "0.2rem" }}>
            {LINKS.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                background: active === l.id ? `${C.accent}12` : "none",
                border: "none", cursor: "pointer", padding: "0.45rem 0.85rem", borderRadius: 8,
                color: active === l.id ? C.accent : C.muted,
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.82rem",
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}
                onMouseEnter={e => { if (active !== l.id) e.currentTarget.style.color = C.accent; }}
                onMouseLeave={e => { if (active !== l.id) e.currentTarget.style.color = C.muted; }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button onClick={() => scrollTo("contact")} style={{
            background: C.grad, color: "#fff", border: "none", borderRadius: 8,
            padding: "0.55rem 1.4rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
            fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,87,255,0.25)",
            transition: "all 0.25s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Get Started
          </button>
        </div>
      </nav>
    </>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────
function Hero() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  const stats = tick % 3 === 0 ? ["99.2%", "Fault Detection Rate"] : tick % 3 === 1 ? ["<2s", "Analysis Time"] : ["50K+", "Log Records Handled"];

  return (
    <section id="home" style={{ minHeight: "100vh", paddingTop: 64, display: "flex", alignItems: "center",
      background: `linear-gradient(160deg,#eef3ff 0%,#f4f6fb 50%,#e8f4ff 100%)`, position: "relative", overflow: "hidden" }}>

      {/* decorative rings */}
      <div style={{ position: "absolute", right: "-10%", top: "10%", width: 520, height: 520, borderRadius: "50%", border: `1px solid ${C.accent}18`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "-5%", top: "15%", width: 380, height: 380, borderRadius: "50%", border: `1px solid ${C.accent}28`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "5%", top: "22%", width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle,${C.accent}10,transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem 5rem", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>

        {/* Left */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${C.accent}12`, border: `1px solid ${C.accent}30`, borderRadius: 40, padding: "0.4rem 1rem", marginBottom: "1.5rem", animation: "fadeUp 0.6s ease both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 1.5s infinite" }} />
            <span style={{ color: C.accent, fontSize: "0.78rem", fontWeight: 600, letterSpacing: 1 }}>AI-POWERED TURBOMACHINERY INTELLIGENCE</span>
          </div>

          <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 900, color: C.navy, lineHeight: 1.08, marginBottom: "1.2rem", animation: "fadeUp 0.7s 0.1s ease both" }}>
            ROT<span style={{ color: C.accent }}>RAXIS</span>
          </h1>

          <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.25rem", color: C.muted, marginBottom: "1.2rem", lineHeight: 1.6, animation: "fadeUp 0.7s 0.2s ease both" }}>
            Where Simulation Meets Machine Intelligence
          </p>

          <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "2.2rem", maxWidth: 480, animation: "fadeUp 0.7s 0.3s ease both" }}>
            Transform raw turbomachinery sensor data into actionable diagnostics. Prevent failures before they happen, reduce operational costs, and make smarter decisions — in real time.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", animation: "fadeUp 0.7s 0.4s ease both" }}>
            <button onClick={() => scrollTo("solution")} style={{ background: C.grad, color: "#fff", border: "none", borderRadius: 10, padding: "0.85rem 2rem", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 6px 24px rgba(0,87,255,0.3)", transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Explore Platform →
            </button>
            <button onClick={() => scrollTo("contact")} style={{ background: "#fff", color: C.accent, border: `2px solid ${C.border}`, borderRadius: 10, padding: "0.85rem 2rem", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
              Get In Touch
            </button>
          </div>
        </div>

        {/* Right — live stat card */}
        <Reveal delay={0.2}>
          <div style={{ background: C.card, borderRadius: 20, padding: "2rem", boxShadow: "0 20px 60px rgba(0,87,255,0.1)", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: "0.8rem", color: C.navy, letterSpacing: 1 }}>LIVE DASHBOARD</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: C.green, fontSize: "0.75rem", fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 1.2s infinite" }} /> ONLINE
              </span>
            </div>

            {[["System Status", "● NORMAL", C.green], ["Anomaly Score", "0.04", C.accent], ["Health Score", "96 / 100", C.accent2], ["Fault %", "2.1%", "#ff9f1c"], ["Last Scan", "0.8s ago", C.muted]].map(([label, val, col]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.muted, fontSize: "0.85rem" }}>{label}</span>
                <span style={{ color: col, fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Orbitron',monospace" }}>{val}</span>
              </div>
            ))}

            {/* animated stat */}
            <div style={{ marginTop: "1.5rem", background: `linear-gradient(135deg,${C.accent}08,${C.accent2}08)`, border: `1px solid ${C.accent}20`, borderRadius: 12, padding: "1.2rem", textAlign: "center", transition: "all 0.5s" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: "2rem", fontWeight: 900, color: C.accent }}>{stats[0]}</div>
              <div style={{ color: C.muted, fontSize: "0.78rem", marginTop: 4, letterSpacing: 1 }}>{stats[1]}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── PROBLEM ───────────────────────────────────────────────────────────
function Problem() {
  const items = [
    ["⚠️", "Data Underutilised", "Sensor data is manually analysed or simply ignored, missing critical fault signals."],
    ["🔴", "Late Fault Detection", "Failures are caught only after they happen — reactive, not predictive."],
    ["📉", "No Predictive Insight", "Engineers lack real-time AI-driven warnings to act before breakdowns."],
    ["🔀", "Siloed Data", "Simulation and real-world sensor data are never combined into one view."],
    ["💸", "Costly Downtime", "Unexpected failures cause massive maintenance costs and safety risks."],
  ];
  return (
    <section id="problem" style={{ background: "#fff", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ background: `${C.red}12`, color: C.red, borderRadius: 30, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>THE CHALLENGE</span>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: C.navy, fontWeight: 900, marginTop: "0.8rem" }}>The Problem We Solve</h2>
            <p style={{ color: C.muted, maxWidth: 520, margin: "0.8rem auto 0", lineHeight: 1.7 }}>Modern turbomachinery generates enormous data. Yet industries still operate blind — relying on reactive maintenance.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.2rem" }}>
          {items.map(([icon, title, desc], i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.5rem", transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.red + "50"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${C.red}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{icon}</div>
                <div style={{ fontWeight: 700, color: C.navy, marginBottom: "0.4rem", fontSize: "0.95rem" }}>{title}</div>
                <div style={{ color: C.muted, fontSize: "0.88rem", lineHeight: 1.7 }}>{desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div style={{ marginTop: "2rem", background: `${C.red}08`, border: `1px solid ${C.red}25`, borderRadius: 12, padding: "1.2rem 2rem", textAlign: "center" }}>
            <p style={{ color: C.red, fontWeight: 700, fontFamily: "'DM Serif Display',serif", fontSize: "1rem", margin: 0 }}>
              Current systems are monitoring tools — not intelligent decision systems.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── SOLUTION ──────────────────────────────────────────────────────────
function Solution() {
  const pillars = [["🧠", "AI Detection", "Trained models classify Normal vs Fault"], ["⚛️", "Physics Insights", "Domain knowledge meets data science"], ["📊", "Live Dashboard", "Real-time visualization and alerts"]];
  return (
    <section id="solution" style={{ background: C.bg, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ background: `${C.accent}12`, color: C.accent, borderRadius: 30, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>OUR ANSWER</span>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: C.navy, fontWeight: 900, marginTop: "0.8rem" }}>The ROTRAXIS Solution</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <Reveal>
            <p style={{ color: C.muted, lineHeight: 1.85, marginBottom: "1.5rem" }}>
              ROTRAXIS bridges the gap between raw sensor data and intelligent action — combining AI anomaly detection, physics-informed insights, and a real-time diagnostics dashboard into one platform.
            </p>
            <p style={{ color: C.muted, lineHeight: 1.85, marginBottom: "2rem" }}>
              Unlike traditional tools that just display data, ROTRAXIS <strong style={{ color: C.accent }}>explains what is happening and why</strong> — and tells engineers exactly what to do next.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              {pillars.map(([icon, title, sub]) => (
                <div key={title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1.2rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>{icon}</div>
                  <div style={{ fontWeight: 700, color: C.navy, fontSize: "0.85rem", marginBottom: "0.3rem" }}>{title}</div>
                  <div style={{ color: C.muted, fontSize: "0.75rem", lineHeight: 1.5 }}>{sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2rem", boxShadow: "0 12px 40px rgba(0,87,255,0.08)" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.75rem", color: C.accent, letterSpacing: 1, marginBottom: "1.2rem", fontWeight: 700 }}>DIAGNOSTIC OUTPUT</div>
              {[["Status", "NORMAL", C.green], ["Anomaly Score", "0.04 / 1.00", C.accent], ["Health Score", "96%", C.accent2], ["Alert Level", "LOW", "#06d6a0"], ["Recommendation", "Continue Ops", C.navy]].map(([k, v, col]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted, fontSize: "0.85rem" }}>{k}</span>
                  <span style={{ fontWeight: 700, color: col, fontSize: "0.85rem" }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: "1.2rem", background: `linear-gradient(90deg,${C.green}22,${C.accent2}22)`, borderRadius: 8, padding: "0.8rem", textAlign: "center" }}>
                <span style={{ color: C.green, fontWeight: 700, fontSize: "0.85rem" }}>✓ System operating within safe parameters</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── FEATURES ──────────────────────────────────────────────────────────
const FEATS = [
  ["🧠", "AI Diagnostics Engine", "Detects abnormal turbomachinery behaviour. Trained models classify Normal vs Fault conditions in real time with high precision."],
  ["📊", "Anomaly Scoring System", "Every sensor data point receives a quantified anomaly score, helping engineers instantly prioritize critical issues."],
  ["🖥️", "Real-Time Dashboard", "Upload CSV or input sensor values manually. View system status, trends, and threshold alerts instantly."],
  ["📈", "Visual Analytics", "Fault vs normal distribution charts, anomaly score trends, and health indicators — all visual, all clear."],
  ["📝", "Automated Reports", "Downloadable diagnostic reports with executive-level summaries of system condition and recommended actions."],
  ["⚡", "Fast API Processing", "FastAPI backend for scalable, lightweight, real-time analysis — deployable across any industrial environment."],
];

function Features() {
  return (
    <section id="features" style={{ background: "#fff", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ background: `${C.accent2}18`, color: C.accent2, borderRadius: 30, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>CAPABILITIES</span>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: C.navy, fontWeight: 900, marginTop: "0.8rem" }}>What We Offer</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.2rem" }}>
          {FEATS.map(([icon, title, desc], i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.8rem", height: "100%", transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.accent + "40"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,87,255,0.1)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{icon}</div>
                <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.6rem" }}>{title}</h3>
                <p style={{ color: C.muted, fontSize: "0.88rem", lineHeight: 1.75, margin: 0 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────
const STEPS = [
  ["01", "📥", "Input Data", "Feed sensor data — temperature, pressure, vibration — via CSV upload or manual entry."],
  ["02", "⚙️", "AI Processing", "Our model analyses patterns and deviations against trained baselines to detect anomalies."],
  ["03", "📤", "Get Output", "Receive status (Normal/Fault), anomaly score, and rich visual insights within seconds."],
  ["04", "✅", "Take Action", "Engineers act before failure occurs. ROTRAXIS turns data into timely, informed decisions."],
];

function HowItWorks() {
  return (
    <section id="howitworks" style={{ background: C.bg, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ background: `${C.navy}10`, color: C.navy, borderRadius: 30, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>THE PROCESS</span>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: C.navy, fontWeight: 900, marginTop: "0.8rem" }}>How It Works</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "1.5rem", position: "relative" }}>
          {STEPS.map(([num, icon, title, desc], i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "2rem 1.5rem", textAlign: "center", position: "relative", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,87,255,0.1)`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ position: "absolute", top: 14, right: 16, fontFamily: "'Orbitron',monospace", fontSize: "2.5rem", fontWeight: 900, color: `${C.accent}0d`, lineHeight: 1 }}>{num}</div>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent}18,${C.accent2}18)`, border: `2px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem" }}>{icon}</div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, color: C.navy, fontSize: "0.82rem", marginBottom: "0.6rem", letterSpacing: 0.5 }}>{title}</div>
                <p style={{ color: C.muted, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── USE CASES ─────────────────────────────────────────────────────────
const CASES = [
  ["✈️", "Aerospace Propulsion", "Jet engine health monitoring"],
  ["⚙️", "Gas Turbine Plants", "Power generation reliability"],
  ["🏭", "Industrial Compressors", "Manufacturing uptime"],
  ["🔬", "Research & Academia", "Simulation-driven studies"],
  ["🛠️", "Rotating Machinery", "Predictive maintenance"],
  ["☁️", "IoT & Cloud", "Future-ready deployment"],
];
const COMPARE = [
  ["Data display only", "Intelligent, explainable insights"],
  ["Reactive maintenance", "Predictive diagnostics"],
  ["Manual analysis", "Automated AI detection"],
  ["No scoring system", "Quantified anomaly score"],
  ["Siloed data", "Data + AI + Engineering unified"],
];

function UseCases() {
  return (
    <section id="usecases" style={{ background: "#fff", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ background: `${C.accent}12`, color: C.accent, borderRadius: 30, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>APPLICATIONS</span>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: C.navy, fontWeight: 900, marginTop: "0.8rem" }}>Use Cases</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {CASES.map(([icon, label, sub], i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.5rem 1rem", textAlign: "center", transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.accent + "40"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 10px 24px rgba(0,87,255,0.1)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>{icon}</div>
                <div style={{ fontWeight: 700, color: C.navy, fontSize: "0.88rem", marginBottom: "0.3rem" }}>{label}</div>
                <div style={{ color: C.muted, fontSize: "0.76rem" }}>{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Comparison table */}
        <Reveal>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: C.navy }}>
              <div style={{ padding: "1rem 1.5rem", color: "#f87171", fontFamily: "'Orbitron',monospace", fontSize: "0.72rem", letterSpacing: 1 }}>TRADITIONAL SYSTEMS</div>
              <div style={{ padding: "1rem 1.5rem", color: C.accent2, fontFamily: "'Orbitron',monospace", fontSize: "0.72rem", letterSpacing: 1 }}>ROTRAXIS</div>
            </div>
            {COMPARE.map(([trad, rotr], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.bg : C.card }}>
                <div style={{ padding: "0.9rem 1.5rem", color: C.muted, fontSize: "0.88rem" }}>✗ {trad}</div>
                <div style={{ padding: "0.9rem 1.5rem", color: C.green, fontSize: "0.88rem", fontWeight: 600 }}>✓ {rotr}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── VISION ────────────────────────────────────────────────────────────
function Vision() {
  const scope = ["IoT sensor integration", "Digital twin modelling", "Predictive maintenance scheduling", "Cloud deployment", "Physics + AI hybrid models"];
  return (
    <section id="vision" style={{ background: C.navy, padding: "5rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse at 70% 50%, ${C.accent}18 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <span style={{ background: `${C.accent2}22`, color: C.accent2, borderRadius: 30, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>OUR NORTH STAR</span>
          <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: "#fff", fontWeight: 900, marginTop: "0.8rem", marginBottom: "1.2rem" }}>Vision & Future Scope</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: 640, margin: "0 auto 2.5rem", fontSize: "1rem" }}>
            To become the next-generation engineering intelligence platform — integrating AI, simulation, and real-time systems to enable smart, autonomous diagnostics for critical machinery worldwide.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center" }}>
            {scope.map((s, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: "0.5rem 1.2rem", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>{s}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const inp = { width: "100%", padding: "0.85rem 1rem", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" };

  const submit = () => {
    if (!form.name || !form.email || !form.message) return alert("Please fill in required fields.");
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1200); // Replace with real API call
  };

  return (
    <section id="contact" style={{ background: C.bg, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ background: `${C.accent}12`, color: C.accent, borderRadius: 30, padding: "0.3rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>GET STARTED</span>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", color: C.navy, fontWeight: 900, marginTop: "0.8rem" }}>Contact ROTRAXIS</h2>
            <p style={{ color: C.muted, marginTop: "0.6rem" }}>Ready to transform your turbomachinery operations? Let's talk.</p>
          </div>
          {done ? (
            <div style={{ textAlign: "center", padding: "3rem 2rem", background: `${C.green}10`, border: `1px solid ${C.green}30`, borderRadius: 16 }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontFamily: "'Orbitron',monospace", color: C.green, marginBottom: "0.5rem" }}>Message Sent!</h3>
              <p style={{ color: C.muted }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2.5rem", boxShadow: "0 8px 32px rgba(0,87,255,0.07)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name *" style={inp}
                  onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email Address *" style={inp}
                  onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company / Organisation" style={{ ...inp, marginBottom: "1rem" }}
                onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your project *" rows={5}
                style={{ ...inp, resize: "vertical", marginBottom: "1.5rem" }}
                onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
              <button onClick={submit} disabled={loading} style={{ width: "100%", background: loading ? C.muted : C.grad, color: "#fff", border: "none", borderRadius: 10, padding: "1rem", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 20px rgba(0,87,255,0.25)", transition: "all 0.25s", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.navy, padding: "2rem 2rem", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "1rem", color: "#fff" }}>
          ROT<span style={{ color: C.accent }}>RAXIS</span>
        </span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>© 2025 ROTRAXIS. AI-Powered Turbomachinery Intelligence.</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {LINKS.slice(0, 4).map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>{l.label}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <UseCases />
      <Vision />
      <Contact />
      <Footer />
    </>
  );
}