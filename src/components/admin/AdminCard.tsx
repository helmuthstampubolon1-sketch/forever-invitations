import type { ReactNode } from "react";

export function AdminCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
      }}
    >
      {title && (
        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, marginBottom: "1rem" }}>{title}</h3>
      )}
      {children}
    </div>
  );
}
