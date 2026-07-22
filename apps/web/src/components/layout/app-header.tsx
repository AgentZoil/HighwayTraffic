const navItems = [
  { href: "/", label: "Tổng quan" },
  { href: "/upload", label: "Tải dữ liệu" },
  { href: "/dashboard", label: "Biểu đồ" },
  { href: "/map", label: "Bản đồ" }
];

export function AppHeader() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--line)",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)"
      }}
    >
      <div
        className="shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          minHeight: "76px"
        }}
        >
        <div>
          <strong>Giám sát cao tốc</strong>
          <div style={{ color: "var(--muted)", fontSize: "14px" }}>
            Cổng giám sát cao tốc Bắc Nam
          </div>
        </div>

        <nav style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
