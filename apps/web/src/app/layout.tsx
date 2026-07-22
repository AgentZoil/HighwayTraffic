import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
  title: "Cổng giám sát cao tốc Bắc Nam",
  description: "Cổng giám sát cao tốc Bắc Nam với bản đồ, dữ liệu trạm và biểu đồ lưu lượng."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>
        <AppHeader />
        <main>{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}
