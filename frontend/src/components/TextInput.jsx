export default function TextInput({ value, onChange }) {
  const wordCount = value.split(/\s+/).filter((w) => w).length;

  return (
    <>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"Paste text here to analyze...\n\nMinimum 20 characters required."}
        style={{
          width: "100%", minHeight: 200, background: "#ffffff04",
          border: "1px solid #ffffff0a", borderRadius: 12, padding: 18,
          color: "#e0e0e0", fontSize: 14, fontFamily: "Outfit, sans-serif",
          resize: "vertical", lineHeight: 1.8,
        }}
      />
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 10, fontSize: 12, color: "#6b7280",
        fontFamily: "Space Mono, monospace",
      }}>
        <span>{wordCount} words · {value.length} characters</span>
        <span>{value.length < 20 ? `${20 - value.length} more chars needed` : "✓ Ready"}</span>
      </div>
    </>
  );
}