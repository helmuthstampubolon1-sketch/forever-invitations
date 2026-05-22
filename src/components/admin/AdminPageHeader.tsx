import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>{title}</h1>
        {subtitle && (
          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>{subtitle}</div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
