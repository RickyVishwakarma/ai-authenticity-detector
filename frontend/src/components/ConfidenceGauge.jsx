export default function ConfidenceGauge({ aiPercent }) {
  const angle = (aiPercent / 100) * 180 - 90;
  const color = aiPercent > 70 ? "#ef4444" : aiPercent > 45 ? "#f59e0b" : "#22c55e";
  const label = aiPercent > 70 ? "Likely AI Generated" : aiPercent > 45 ? "Uncertain — Mixed Signals" : "Likely Human-Created";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "24px 0" }}>
      <svg width="240" height="140" viewBox="0 0 240 140">
        <defs>
          <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M 25 125 A 95 95 0 0 1 215 125" fill="none" stroke="#1a1a2e" strokeWidth="20" strokeLinecap="round" />
        <path d="M 25 125 A 95 95 0 0 1 215 125" fill="none" stroke="url(#gg)" strokeWidth="16" strokeLinecap="round" opacity="0.25" />
        <line x1="120" y1="125"
          x2={120 + 75 * Math.cos((angle * Math.PI) / 180)}
          y2={125 - 75 * Math.sin((angle * Math.PI) / 180)}
          stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="120" cy="125" r="7" fill={color} />
        <text x="18" y="138" fill="#6b7280" fontSize="10" fontFamily="Space Mono, monospace">Human</text>
        <text x="185" y="138" fill="#6b7280" fontSize="10" fontFamily="Space Mono, monospace">AI</text>
      </svg>
      <span style={{ fontSize: 40, fontWeight: 800, color, textShadow: `0 0 40px ${color}44`, fontFamily: "Outfit, sans-serif" }}>
        {aiPercent}%
      </span>
      <div style={{ fontSize: 13, fontFamily: "Space Mono, monospace", color, marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}