import { ChartPlaceholder } from "@/components/charts/chart-placeholder";

export default function DashboardPage() {
  return (
    <div className="shell section-space">
      <section className="page-intro">
        <span className="eyebrow">Biểu đồ</span>
        <h1>Trung tâm biểu đồ và chỉ số lưu lượng</h1>
        <p>
          Khu vực này dự kiến tổng hợp biểu đồ đường, cột, tròn, bảng chi tiết và bộ lọc theo
          trạm, hướng, khung giờ, ngày và tháng.
        </p>
      </section>

      <ChartPlaceholder />
    </div>
  );
}
