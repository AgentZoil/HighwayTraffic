import { ChartPlaceholder } from "@/components/charts/chart-placeholder";

export default function DashboardPage() {
  return (
    <div className="shell section-space">
      <section className="page-intro">
        <span className="eyebrow">Biểu đồ</span>
        <h1>Trung tâm biểu đồ và chỉ số lưu lượng</h1>
        <p>
          Khi đi tiếp sang lớp analytics, khu vực này sẽ dùng cùng typography, accent và card
          system hiện tại để biểu đồ, KPI, bộ lọc và bảng số liệu vẫn nhìn như một phần tự nhiên
          của cùng một sản phẩm.
        </p>
      </section>

      <ChartPlaceholder />
    </div>
  );
}
