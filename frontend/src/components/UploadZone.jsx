import { useRef, useState } from "react";

export default function UploadZone({ type, file, preview, onFile }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const formats = type === "image" ? "PNG, JPG, WEBP, GIF" : "MP4, WEBM, MOV";

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); onFile(e.dataTransfer.files[0]); }}
      onClick={() => fileRef.current?.click()}
      style={{
        minHeight: 220, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", cursor: "pointer",
        borderRadius: 12, border: `2px dashed ${dragOver ? "#8b5cf6" : "#ffffff15"}`,
        background: dragOver ? "#8b5cf608" : "#ffffff02", transition: "all 0.2s",
      }}
    >
      <input ref={fileRef} type="file" hidden
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
      {preview ? (
        type === "image"
          ? <img src={preview} alt="Preview" style={{ maxHeight: 280, maxWidth: "100%", borderRadius: 10 }} />
          : <video src={preview} controls style={{ maxHeight: 280, maxWidth: "100%", borderRadius: 10 }} />
      ) : (
        <>
          <div style={{ fontSize: 56, marginBottom: 14 }}>{type === "image" ? "🖼️" : "🎬"}</div>
          <div style={{ color: "#9ca3af", fontSize: 15 }}>
            Drop your {type} here or <span style={{ color: "#8b5cf6", textDecoration: "underline" }}>click to browse</span>
          </div>
          <div style={{ color: "#4b5563", fontSize: 12, fontFamily: "Space Mono, monospace", marginTop: 8 }}>
            {formats} · Max 100MB
          </div>
        </>
      )}
      {file && (
        <div style={{ marginTop: 14, fontSize: 12, color: "#6b7280", fontFamily: "Space Mono, monospace" }}>
          ● {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}
    </div>
  );
}