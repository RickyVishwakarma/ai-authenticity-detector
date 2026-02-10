export default function MetricsGrid({ metrics }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} style={{
          padding: "14px 16px", background: "#ffffff06", borderRadius: 10,
          border: "1px solid #ffffff0d",
        }}>
          <div style={{
            fontSize: 10, color: "#6b7280", fontFamily: "Space Mono, monospace",
            textTransform: "uppercase", letterSpacing: 1, marginBottom: 4,
          }}>
            {key.replace(/_/g, " ")}
          </div>
          <div style={{
            fontSize: 15, color: "#e0e0e0", fontFamily: "Outfit, sans-serif",
            fontWeight: 600, wordBreak: "break-all",
          }}>
            {String(value)}
          </div>
        </div>
      ))}
    </div>
  );
}