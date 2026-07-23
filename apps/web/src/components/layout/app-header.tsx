import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/", label: "Tổng quan" },
  { href: "/upload", label: "Tải dữ liệu" },
  { href: "/dashboard", label: "Biểu đồ" },
  { href: "/map", label: "Bản đồ" }
];

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="shell header-inner">
        <div className="brand-block">
          <img
            alt="Logo Trung tâm Kỹ thuật và Công nghệ đường bộ phía Bắc"
            className="brand-logo"
            height="40"
            src="/logo-n-retc.png"
            width="40"
          />
          <div className="brand-copy">
            <strong className="brand-title">Trung tâm Kỹ thuật và Công nghệ đường bộ phía Bắc (GTTM)</strong>
            <div className="brand-subtitle">
              Nền điều hành nội bộ cho trạm, hành trình và dữ liệu lưu lượng Bắc Nam
            </div>
          </div>
        </div>

        <div className="header-actions">
          <nav className="header-nav">
            {navItems.map((item) => (
              <a className="header-nav-link" key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
