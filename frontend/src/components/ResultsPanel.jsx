import ConfidenceGauge from "./ConfidenceGauge";
import SignalList from "./SignalList";
import MetricsGrid from "./MetricsGrid";

export default function ResultsPanel({ result, contentType }) {
  if (!result) return null;

  return (
    <div className="fade-in" style={{ marginTop: 28 }}>
      <div style={{ background: "#0d0d1a", border: "1px solid #ffffff10", borderRadius: 16, padding: 28 }}>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 11, fontFamily: "Space Mono, monospace", color: "#6b7280",
            textTransform: "uppercase", letterSpacing: 2,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            Analysis Complete · {contentType.toUpperCase()}
          </div>
          <div style={{ fontSize: 11, fontFamily: "Space Mono, monospace", color: "#4b5563" }}>
            {result.processing_time_ms}ms
          </div>
        </div>

        <ConfidenceGauge aiPercent={result.ai_probability} />

        <div style={{ marginTop: 28 }}>
          <div style={{
            fontSize: 12, fontFamily: "Space Mono, monospace", color: "#6b7280",
            marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700,
          }}>
            Detection Signals ({result.signals.length})
          </div>
          <SignalList signals={result.signals} />
        </div>

        {result.metrics && Object.keys(result.metrics).length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{
              fontSize: 12, fontFamily: "Space Mono, monospace", color: "#6b7280",
              marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700,
            }}>
              Forensic Metrics
            </div>
            <MetricsGrid metrics={result.metrics} />
          </div>
        )}

        <div style={{
          marginTop: 28, padding: "14px 18px", background: "#ffffff04",
          borderRadius: 10, fontSize: 12, color: "#6b7280",
          fontFamily: "Space Mono, monospace", lineHeight: 1.7, border: "1px solid #ffffff08",
        }}>
          ⓘ {result.disclaimer || "Probabilistic assessment. Not a definitive verdict."}
        </div>
      </div>
    </div>
  );
}