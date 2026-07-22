export function AppFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        background: "#f8fafb"
      }}
    >
      <div
        className="shell"
        style={{
          minHeight: "76px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          color: "var(--muted)",
          fontSize: "14px",
          flexWrap: "wrap"
        }}
      >
        <span>Cấu trúc MVP cho cổng giám sát</span>
        <span>Tích hợp nạp CSV/Excel, biểu đồ và bản đồ OSM</span>
      </div>
    </footer>
  );
}
