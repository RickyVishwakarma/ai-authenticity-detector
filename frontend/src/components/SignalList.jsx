const COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#6b7280" };
const BG = { high: "#ef444415", medium: "#f59e0b15", low: "#6b728015" };

export default function SignalList({ signals }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {signals.map((s, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px",
          background: BG[s.weight], borderRadius: 10,
          border: `1px solid ${COLORS[s.weight]}30`, fontSize: 13, fontFamily: "Outfit, sans-serif",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: COLORS[s.weight],
            boxShadow: `0 0 8px ${COLORS[s.weight]}66`, flexShrink: 0, marginTop: 5,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#e0e0e0" }}>{s.label}</div>
            {s.detail && (
              <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "Space Mono, monospace", marginTop: 3 }}>
                {s.detail}
              </div>
            )}
          </div>
          <span style={{
            fontSize: 10, color: COLORS[s.weight], fontFamily: "Space Mono, monospace",
            textTransform: "uppercase", letterSpacing: 1, flexShrink: 0, marginTop: 2,
          }}>
            {s.weight}
          </span>
        </div>
      ))}
    </div>
  );
}