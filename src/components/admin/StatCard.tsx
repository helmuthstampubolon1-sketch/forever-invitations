export function StatCard({
  label,
  value,
  sub,
  valueColor = "#C9A96E",
}: {
  label: string;
  value: number | string;
  sub?: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "1.25rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#6b7280",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 600, color: valueColor, marginTop: "0.5rem" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>{sub}</div>}
    </div>
  );
}
