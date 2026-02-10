import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { analyzeText, analyzeImage, analyzeVideo } from "../utils/api";

/* ═══════════════════════════════════════════════════════
   THEME CONTEXT — Dark/Light Mode
   ═══════════════════════════════════════════════════════ */

const ThemeContext = createContext();

const themes = {
  dark: {
    bg: "#06060e", bgCard: "#0d0d1a", bgInput: "#ffffff05",
    bgHover: "#ffffff0a", bgAccent: "#8b5cf615",
    border: "#ffffff0c", borderLight: "#ffffff15",
    text: "#e8e8f0", textSecondary: "#9ca3af", textMuted: "#6b7280", textDim: "#4b5563",
    accent: "#8b5cf6", accentLight: "#c4b5fd", cyan: "#06b6d4",
    green: "#22c55e", amber: "#f59e0b", red: "#ef4444",
    gradient: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    bgGradient: "radial-gradient(ellipse 60% 50% at 50% 0%, #1a103a 0%, transparent 70%)",
    shadow: "0 4px 35px #7c3aed33",
    navBg: "#06060eee",
  },
  light: {
    bg: "#f5f5f7", bgCard: "#ffffff", bgInput: "#f0f0f5",
    bgHover: "#e8e8f0", bgAccent: "#8b5cf612",
    border: "#e0e0e8", borderLight: "#d0d0d8",
    text: "#1a1a2e", textSecondary: "#555566", textMuted: "#777788", textDim: "#999aaa",
    accent: "#7c3aed", accentLight: "#8b5cf6", cyan: "#0891b2",
    green: "#16a34a", amber: "#d97706", red: "#dc2626",
    gradient: "linear-gradient(135deg, #7c3aed, #0891b2)",
    bgGradient: "radial-gradient(ellipse 60% 50% at 50% 0%, #e8e0ff 0%, transparent 70%)",
    shadow: "0 4px 35px #7c3aed22",
    navBg: "#f5f5f7ee",
  },
};

function useTheme() { return useContext(ThemeContext); }


/* ═══════════════════════════════════════════════════════
   ICONS (inline SVG)
   ═══════════════════════════════════════════════════════ */

const Icons = {
  sun: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  moon: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  shield: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  scan: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>,
  chart: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  clock: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trash: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>,
  arrow: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  user: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  github: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill={c}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  linkedin: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill={c}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
};


/* ═══════════════════════════════════════════════════════
   ANALYSIS ENGINE (same as before)
   ═══════════════════════════════════════════════════════ */

const TABS = [
  { id: "text", label: "Text", icon: "📝" },
  { id: "image", label: "Image", icon: "🖼️" },
  { id: "video", label: "Video", icon: "🎬" },
];


/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════ */

function Navbar({ page, setPage, user, setUser, mode, setMode }) {
  const t = useTheme();
  const links = [
    { id: "landing", label: "Home" },
    { id: "detector", label: "Detector" },
    { id: "history", label: "History" },
    { id: "about", label: "About" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: t.navBg, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${t.border}`, padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", height: 60 }}>
        {/* Logo */}
        <div onClick={() => setPage("landing")} style={{
          display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginRight: 40,
        }}>
          {Icons.shield(t.accent)}
          <span style={{ fontWeight: 700, fontSize: 16, color: t.text, fontFamily: "Outfit, sans-serif" }}>AuthDetect</span>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: page === l.id ? t.bgAccent : "transparent",
              color: page === l.id ? t.accent : t.textMuted,
              border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontWeight: 500, fontFamily: "Outfit, sans-serif",
              transition: "all 0.2s",
            }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{
            background: t.bgHover, border: `1px solid ${t.border}`, borderRadius: 8,
            padding: "7px 8px", cursor: "pointer", display: "flex", alignItems: "center",
          }}>
            {mode === "dark" ? Icons.sun(t.textMuted) : Icons.moon(t.textMuted)}
          </button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: t.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#fff",
              }}>
                {user.name[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: t.textSecondary, fontFamily: "Outfit, sans-serif" }}>{user.name}</span>
              <button onClick={() => setUser(null)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 4,
              }}>
                {Icons.logout(t.textMuted)}
              </button>
            </div>
          ) : (
            <button onClick={() => setPage("login")} style={{
              background: t.gradient, color: "#fff", border: "none",
              padding: "8px 20px", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "Outfit, sans-serif",
            }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function ConfidenceGauge({ aiPercent }) {
  const t = useTheme();
  const angle = (aiPercent / 100) * 180 - 90;
  const color = aiPercent > 70 ? t.red : aiPercent > 45 ? t.amber : t.green;
  const label = aiPercent > 70 ? "Likely AI Generated" : aiPercent > 45 ? "Uncertain — Mixed Signals" : "Likely Human-Created";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "28px 0" }}>
      <svg width="240" height="140" viewBox="0 0 240 140">
        <defs>
          <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={t.green} />
            <stop offset="50%" stopColor={t.amber} />
            <stop offset="100%" stopColor={t.red} />
          </linearGradient>
        </defs>
        <path d="M 25 125 A 95 95 0 0 1 215 125" fill="none" stroke={t.bgHover} strokeWidth="20" strokeLinecap="round" />
        <path d="M 25 125 A 95 95 0 0 1 215 125" fill="none" stroke="url(#gg)" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
        <line x1="120" y1="125" x2={120 + 75 * Math.cos((angle * Math.PI) / 180)} y2={125 - 75 * Math.sin((angle * Math.PI) / 180)} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="120" cy="125" r="7" fill={color} />
        <text x="18" y="138" fill={t.textMuted} fontSize="10" fontFamily="Space Mono, monospace">Human</text>
        <text x="185" y="138" fill={t.textMuted} fontSize="10" fontFamily="Space Mono, monospace">AI</text>
      </svg>
      <span style={{ fontSize: 42, fontWeight: 800, color, textShadow: `0 0 40px ${color}44`, fontFamily: "Outfit, sans-serif" }}>{aiPercent}%</span>
      <div style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color, marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function SignalList({ signals }) {
  const t = useTheme();
  const c = { high: t.red, medium: t.amber, low: t.textMuted };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {signals.map((s, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px",
          background: `${c[s.weight]}10`, borderRadius: 10,
          border: `1px solid ${c[s.weight]}25`, fontSize: 13, fontFamily: "Outfit, sans-serif",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: c[s.weight], boxShadow: `0 0 8px ${c[s.weight]}66`, flexShrink: 0, marginTop: 5 }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: t.text, fontWeight: 500 }}>{s.label}</div>
            {s.detail && <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "Space Mono, monospace", marginTop: 3 }}>{s.detail}</div>}
          </div>
          <span style={{ fontSize: 10, color: c[s.weight], fontFamily: "Space Mono, monospace", textTransform: "uppercase", letterSpacing: 1 }}>{s.weight}</span>
        </div>
      ))}
    </div>
  );
}

function MetricsGrid({ metrics }) {
  const t = useTheme();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {Object.entries(metrics).map(([k, v]) => (
        <div key={k} style={{ padding: "14px 16px", background: t.bgHover, borderRadius: 10, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "Space Mono, monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{k.replace(/_/g, " ")}</div>
          <div style={{ fontSize: 15, color: t.text, fontFamily: "Outfit, sans-serif", fontWeight: 600 }}>{String(v)}</div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  const t = useTheme();
  return (
    <div style={{ fontSize: 12, fontFamily: "Space Mono, monospace", color: t.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
      {children}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   PAGE: LANDING
   ═══════════════════════════════════════════════════════ */

function LandingPage({ setPage }) {
  const t = useTheme();

  const features = [
    { icon: "📝", title: "Text Analysis", desc: "Detect AI-written content using perplexity, burstiness, and stylometric analysis" },
    { icon: "🖼️", title: "Image Forensics", desc: "EXIF metadata, frequency domain analysis, GAN fingerprint detection" },
    { icon: "🎬", title: "Video Detection", desc: "Frame-level consistency, temporal coherence, deepfake facial tracking" },
    { icon: "📊", title: "Confidence Scoring", desc: "Probabilistic results with explainable signals, not binary yes/no" },
  ];

  const stats = [
    { value: "7+", label: "Detection Signals" },
    { value: "3", label: "Content Types" },
    { value: "<1s", label: "Analysis Time" },
    { value: "85%+", label: "Accuracy Target" },
  ];

  return (
    <div style={{ paddingTop: 60 }}>
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "100px 20px 80px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: t.bgGradient }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
            background: t.bgAccent, padding: "8px 20px", borderRadius: 30,
            border: `1px solid ${t.border}`, fontSize: 12, fontFamily: "Space Mono, monospace",
            color: t.accent, letterSpacing: 1.5, textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.green, animation: "pulse 2s infinite" }} />
            AI Content Detection Platform
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 7vw, 60px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.1,
            background: t.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Is It Real<br />Or AI Generated?
          </h1>
          <p style={{ marginTop: 20, color: t.textSecondary, fontSize: 17, lineHeight: 1.8, maxWidth: 520, margin: "20px auto 0" }}>
            Upload any image, video, or text and get instant forensic analysis with confidence scores and explainable detection signals.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("detector")} style={{
              background: t.gradient, color: "#fff", border: "none",
              padding: "14px 36px", borderRadius: 12, cursor: "pointer",
              fontSize: 15, fontWeight: 700, fontFamily: "Outfit, sans-serif",
              boxShadow: t.shadow, transition: "transform 0.2s",
            }}>
              Start Analyzing →
            </button>
            <button onClick={() => setPage("about")} style={{
              background: t.bgCard, color: t.text, border: `1px solid ${t.borderLight}`,
              padding: "14px 36px", borderRadius: 12, cursor: "pointer",
              fontSize: 15, fontWeight: 600, fontFamily: "Outfit, sans-serif",
            }}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "24px 16px", background: t.bgCard,
              borderRadius: 14, border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.accent, fontFamily: "Outfit, sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: t.textMuted, fontFamily: "Space Mono, monospace", marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: t.text, marginBottom: 40, fontFamily: "Outfit, sans-serif" }}>
          How It Works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: "28px", background: t.bgCard, borderRadius: 16,
              border: `1px solid ${t.border}`, transition: "border-color 0.2s",
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7, fontFamily: "Outfit, sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "60px 20px 80px", background: t.bgCard, borderTop: `1px solid ${t.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, fontFamily: "Outfit, sans-serif" }}>Ready to Detect?</h2>
        <p style={{ color: t.textMuted, marginTop: 10, fontSize: 15, fontFamily: "Outfit, sans-serif" }}>Start analyzing content for free. No sign-up required.</p>
        <button onClick={() => setPage("detector")} style={{
          marginTop: 24, background: t.gradient, color: "#fff", border: "none",
          padding: "14px 40px", borderRadius: 12, cursor: "pointer",
          fontSize: 15, fontWeight: 700, fontFamily: "Outfit, sans-serif", boxShadow: t.shadow,
        }}>
          Launch Detector →
        </button>
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   PAGE: LOGIN / SIGNUP
   ═══════════════════════════════════════════════════════ */

function LoginPage({ setPage, setUser }) {
  const t = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    if (!isLogin && !name) { setError("Please enter your name"); return; }
    // Simulate login/signup
    setUser({ name: name || email.split("@")[0], email });
    setPage("detector");
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", background: t.bgInput,
    border: `1px solid ${t.border}`, borderRadius: 10, color: t.text,
    fontSize: 14, fontFamily: "Outfit, sans-serif", marginBottom: 14,
  };

  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: t.bgGradient }} />
      <div style={{
        position: "relative", zIndex: 1, width: 400, padding: 36, background: t.bgCard,
        borderRadius: 20, border: `1px solid ${t.border}`,
        boxShadow: `0 20px 60px ${t.accent}15`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {Icons.shield(t.accent)}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text, marginTop: 12, fontFamily: "Outfit, sans-serif" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ fontSize: 13, color: t.textMuted, marginTop: 6, fontFamily: "Outfit, sans-serif" }}>
            {isLogin ? "Sign in to access your analysis history" : "Sign up to save your analysis results"}
          </p>
        </div>

        {!isLogin && (
          <input type="text" placeholder="Full Name" value={name}
            onChange={(e) => setName(e.target.value)} style={inputStyle} />
        )}
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

        {error && <div style={{ color: t.red, fontSize: 12, marginBottom: 12, fontFamily: "Space Mono, monospace" }}>{error}</div>}

        <button onClick={handleSubmit} style={{
          width: "100%", padding: "14px", background: t.gradient, color: "#fff",
          border: "none", borderRadius: 10, cursor: "pointer",
          fontSize: 15, fontWeight: 700, fontFamily: "Outfit, sans-serif",
        }}>
          {isLogin ? "Sign In" : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: t.textMuted, fontFamily: "Outfit, sans-serif" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ color: t.accent, cursor: "pointer", fontWeight: 600 }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   PAGE: DETECTOR (main analysis tool)
   ═══════════════════════════════════════════════════════ */

function DetectorPage({ addToHistory }) {
  const t = useTheme();
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const prevTab = useRef(tab);
  useEffect(() => {
    if (prevTab.current !== tab) {
      setFile(null); setPreview(null); setText(""); setResult(null); setError(null); setProgress(0);
      prevTab.current = tab;
    }
  });

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f); setResult(null); setError(null);
    if (tab === "image" && f.type.startsWith("image/")) {
      const r = new FileReader(); r.onload = (e) => setPreview(e.target.result); r.readAsDataURL(f);
    } else if (tab === "video" && f.type.startsWith("video/")) {
      setPreview(URL.createObjectURL(f));
    }
  }, [tab]);

  const handleAnalyze = async () => {
    setAnalyzing(true); setResult(null); setError(null); setProgress(0);
    const steps = [10, 25, 40, 55, 70, 82, 90, 95];
    let i = 0;
    const iv = setInterval(() => { if (i < steps.length) { setProgress(steps[i]); i++; } }, 300);
    try {
      let data;
      if (tab === "text") data = await analyzeText(text);
      else if (tab === "image") data = await analyzeImage(file);
      else data = await analyzeVideo(file);
      clearInterval(iv); setProgress(100); setResult(data);
      addToHistory({ type: tab, name: tab === "text" ? text.slice(0, 60) + "..." : file.name, result: data, date: new Date().toLocaleString() });
    } catch (err) { clearInterval(iv); setError(err.message); }
    finally { setAnalyzing(false); }
  };

  const canAnalyze = tab === "text" ? text.trim().length >= 20 : !!file;

  return (
    <div style={{ paddingTop: 80, maxWidth: 740, margin: "0 auto", padding: "80px 20px 40px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: t.text, fontFamily: "Outfit, sans-serif" }}>Content Analyzer</h1>
        <p style={{ color: t.textMuted, fontSize: 14, marginTop: 8, fontFamily: "Outfit, sans-serif" }}>Upload content and run forensic analysis</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: t.bgHover, borderRadius: 14, padding: 4, border: `1px solid ${t.border}`, marginBottom: 24 }}>
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            flex: 1, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: tab === tb.id ? t.bgAccent : "transparent",
            color: tab === tb.id ? t.accentLight : t.textMuted,
            fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
            borderBottom: tab === tb.id ? `2px solid ${t.accent}` : "2px solid transparent",
          }}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        {tab === "text" ? (
          <>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }}
              placeholder="Paste text here to analyze (min 20 characters)..."
              style={{ width: "100%", minHeight: 200, background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, color: t.text, fontSize: 14, fontFamily: "Outfit, sans-serif", resize: "vertical", lineHeight: 1.8 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>
              <span>{text.split(/\s+/).filter(w=>w).length} words · {text.length} chars</span>
              <span>{text.length < 20 ? `${20-text.length} more needed` : "✓ Ready"}</span>
            </div>
          </>
        ) : (
          <div onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            style={{
              minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", cursor: "pointer", borderRadius: 12,
              border: `2px dashed ${t.borderLight}`, background: t.bgInput, transition: "all 0.2s",
            }}>
            <input ref={fileRef} type="file" hidden accept={tab === "image" ? "image/*" : "video/*"}
              onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            {preview ? (
              tab === "image"
                ? <img src={preview} alt="" style={{ maxHeight: 280, maxWidth: "100%", borderRadius: 10 }} />
                : <video src={preview} controls style={{ maxHeight: 280, maxWidth: "100%", borderRadius: 10 }} />
            ) : (
              <>
                <div style={{ fontSize: 56, marginBottom: 14 }}>{tab === "image" ? "🖼️" : "🎬"}</div>
                <div style={{ color: t.textSecondary, fontSize: 15 }}>Drop your {tab} here or <span style={{ color: t.accent }}>browse</span></div>
                <div style={{ color: t.textDim, fontSize: 12, fontFamily: "Space Mono, monospace", marginTop: 8 }}>
                  {tab === "image" ? "PNG, JPG, WEBP" : "MP4, WEBM, MOV"} · Max 100MB
                </div>
              </>
            )}
            {file && <div style={{ marginTop: 14, fontSize: 12, color: t.textMuted, fontFamily: "Space Mono, monospace" }}>● {file.name} · {(file.size/1024/1024).toFixed(2)} MB</div>}
          </div>
        )}
      </div>

      {/* Button */}
      <button onClick={handleAnalyze} disabled={!canAnalyze || analyzing} style={{
        width: "100%", padding: "17px 0", borderRadius: 14, border: "none",
        cursor: canAnalyze && !analyzing ? "pointer" : "not-allowed",
        background: canAnalyze && !analyzing ? t.gradient : t.bgHover,
        color: canAnalyze ? "#fff" : t.textDim,
        fontSize: 16, fontWeight: 700, fontFamily: "Outfit, sans-serif",
        opacity: canAnalyze && !analyzing ? 1 : 0.5, boxShadow: canAnalyze && !analyzing ? t.shadow : "none",
        transition: "all 0.3s",
      }}>
        {analyzing ? "⏳ Analyzing..." : "🔍 Run Forensic Analysis"}
      </button>

      {/* Progress */}
      {analyzing && (
        <div style={{ marginTop: 18 }}>
          <div style={{ height: 5, background: t.bgHover, borderRadius: 5, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: t.gradient, borderRadius: 5, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, fontFamily: "Space Mono, monospace", color: t.textMuted }}>
            <span>{progress < 30 ? "Preprocessing..." : progress < 60 ? "Running models..." : progress < 90 ? "Computing signals..." : "Finalizing..."}</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {error && <div style={{ marginTop: 16, padding: "12px 16px", background: `${t.red}15`, border: `1px solid ${t.red}30`, borderRadius: 10, color: t.red, fontSize: 13, fontFamily: "Space Mono, monospace" }}>Error: {error}</div>}

      {/* Results */}
      {result && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontFamily: "Space Mono, monospace", color: t.textMuted, textTransform: "uppercase", letterSpacing: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.green }} />
                Analysis Complete · {tab.toUpperCase()}
              </div>
              <span style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: t.textDim }}>{result.processing_time_ms}ms</span>
            </div>
            <ConfidenceGauge aiPercent={result.ai_probability} />
            <div style={{ marginTop: 28 }}><SectionLabel>Detection Signals ({result.signals.length})</SectionLabel><SignalList signals={result.signals} /></div>
            {result.metrics && <div style={{ marginTop: 28 }}><SectionLabel>Forensic Metrics</SectionLabel><MetricsGrid metrics={result.metrics} /></div>}
            <div style={{ marginTop: 28, padding: "14px 18px", background: t.bgHover, borderRadius: 10, fontSize: 12, color: t.textMuted, fontFamily: "Space Mono, monospace", lineHeight: 1.7, border: `1px solid ${t.border}` }}>
              ⓘ {result.disclaimer || "Probabilistic assessment. Not a definitive verdict."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   PAGE: HISTORY
   ═══════════════════════════════════════════════════════ */

function HistoryPage({ history, clearHistory }) {
  const t = useTheme();
  const typeIcons = { text: "📝", image: "🖼️", video: "🎬" };

  return (
    <div style={{ paddingTop: 80, maxWidth: 800, margin: "0 auto", padding: "80px 20px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: t.text, fontFamily: "Outfit, sans-serif" }}>Analysis History</h1>
          <p style={{ color: t.textMuted, fontSize: 13, marginTop: 6, fontFamily: "Outfit, sans-serif" }}>{history.length} analyses performed</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: `${t.red}15`, color: t.red, border: `1px solid ${t.red}30`,
            padding: "8px 16px", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontFamily: "Outfit, sans-serif", fontWeight: 600,
          }}>
            {Icons.trash(t.red)} Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", background: t.bgCard, borderRadius: 16, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <h3 style={{ color: t.text, fontSize: 18, fontWeight: 600, fontFamily: "Outfit, sans-serif" }}>No analyses yet</h3>
          <p style={{ color: t.textMuted, fontSize: 14, marginTop: 8, fontFamily: "Outfit, sans-serif" }}>Your analysis results will appear here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...history].reverse().map((item, i) => {
            const color = item.result.ai_probability > 70 ? t.red : item.result.ai_probability > 45 ? t.amber : t.green;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`,
              }}>
                <div style={{ fontSize: 28 }}>{typeIcons[item.type]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: "Outfit, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    {Icons.clock(t.textDim)}
                    <span style={{ fontSize: 11, color: t.textDim, fontFamily: "Space Mono, monospace" }}>{item.date}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "Outfit, sans-serif" }}>{item.result.ai_probability}%</div>
                  <div style={{ fontSize: 10, color, fontFamily: "Space Mono, monospace", textTransform: "uppercase", letterSpacing: 1 }}>
                    {item.result.prediction.replace("_", " ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   PAGE: ABOUT
   ═══════════════════════════════════════════════════════ */

function AboutPage() {
  const t = useTheme();

  const team = [
    { name: "Your Name", role: "Full Stack Developer", avatar: "🧑‍💻" },
    { name: "Team Member 2", role: "ML Engineer", avatar: "🧑‍🔬" },
    { name: "Team Member 3", role: "UI/UX Designer", avatar: "🎨" },
    { name: "Guide Name", role: "Project Guide", avatar: "👨‍🏫" },
  ];

  const tech = [
    { name: "React", desc: "Frontend UI framework" },
    { name: "FastAPI", desc: "Python backend server" },
    { name: "PyTorch", desc: "ML model framework" },
    { name: "OpenCV", desc: "Video frame analysis" },
    { name: "Pillow", desc: "Image processing" },
    { name: "Vite", desc: "Frontend build tool" },
  ];

  return (
    <div style={{ paddingTop: 80, maxWidth: 800, margin: "0 auto", padding: "80px 20px 60px" }}>
      {/* About */}
      <section style={{ textAlign: "center", marginBottom: 60 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: t.text, fontFamily: "Outfit, sans-serif" }}>About This Project</h1>
        <p style={{ color: t.textSecondary, fontSize: 15, lineHeight: 1.8, maxWidth: 600, margin: "16px auto 0", fontFamily: "Outfit, sans-serif" }}>
          AI Content Authenticity Detector is a full-stack platform that uses forensic analysis techniques to detect AI-generated content across text, images, and video. Built as a final year project demonstrating expertise in machine learning, web development, and system design.
        </p>
      </section>

      {/* Team */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 24, textAlign: "center", fontFamily: "Outfit, sans-serif" }}>Our Team</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {team.map((m, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "28px 16px", background: t.bgCard,
              borderRadius: 16, border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{m.avatar}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "Outfit, sans-serif" }}>{m.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, fontFamily: "Space Mono, monospace" }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 24, textAlign: "center", fontFamily: "Outfit, sans-serif" }}>Tech Stack</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {tech.map((item, i) => (
            <div key={i} style={{
              padding: "20px", background: t.bgCard, borderRadius: 12,
              border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.accent, fontFamily: "Outfit, sans-serif" }}>{item.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, fontFamily: "Outfit, sans-serif" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{
        textAlign: "center", padding: "40px", background: t.bgCard,
        borderRadius: 16, border: `1px solid ${t.border}`,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, fontFamily: "Outfit, sans-serif" }}>Get In Touch</h2>
        <p style={{ color: t.textMuted, fontSize: 14, marginTop: 8, fontFamily: "Outfit, sans-serif" }}>Have questions? Want to collaborate?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20 }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            background: t.bgHover, borderRadius: 10, border: `1px solid ${t.border}`,
            color: t.text, textDecoration: "none", fontSize: 13, fontFamily: "Outfit, sans-serif",
          }}>
            {Icons.github(t.textMuted)} GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            background: t.bgHover, borderRadius: 10, border: `1px solid ${t.border}`,
            color: t.text, textDecoration: "none", fontSize: 13, fontFamily: "Outfit, sans-serif",
          }}>
            {Icons.linkedin(t.textMuted)} LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN APP — Router + Theme Provider
   ═══════════════════════════════════════════════════════ */

export default function App() {
  const [page, setPage] = useState("landing");
  const [mode, setMode] = useState("dark");
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const t = themes[mode];

  const addToHistory = useCallback((item) => {
    setHistory(prev => [...prev, item]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <ThemeContext.Provider value={t}>
      <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "Outfit, sans-serif", transition: "background 0.3s, color 0.3s" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${t.bg}; }
          textarea:focus, button:focus, input:focus { outline: none; }
          ::selection { background: #8b5cf644; color: #fff; }
          @keyframes pulse { 0%,100% { opacity:0.4 } 50% { opacity:1 } }
          @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          .fade-in { animation: slideUp 0.4s ease-out forwards; }
          a { color: inherit; }
          input { outline: none; }
        `}</style>

        <Navbar page={page} setPage={setPage} user={user} setUser={setUser} mode={mode} setMode={setMode} />

        {page === "landing" && <LandingPage setPage={setPage} />}
        {page === "login" && <LoginPage setPage={setPage} setUser={setUser} />}
        {page === "detector" && <DetectorPage addToHistory={addToHistory} />}
        {page === "history" && <HistoryPage history={history} clearHistory={clearHistory} />}
        {page === "about" && <AboutPage />}

        {/* Footer */}
        <footer style={{
          textAlign: "center", padding: "30px 20px", borderTop: `1px solid ${t.border}`,
          fontSize: 11, fontFamily: "Space Mono, monospace", color: t.textDim,
        }}>
          © 2025 AuthDetect · AI Content Authenticity Detector · Final Year Project
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}