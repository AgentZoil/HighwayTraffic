import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { MapPlaceholder } from "@/components/maps/map-placeholder";
import { UploadZonePlaceholder } from "@/components/upload/upload-zone-placeholder";

const highlights = [
  {
    title: "Tải Dữ Liệu Theo Đợt",
    text: "Nạp file CSV hoặc Excel từ từng trạm, từng ngày, từng tháng để cập nhật số liệu nhanh."
  },
  {
    title: "Biểu Đồ Lưu Lượng",
    text: "Tổng hợp lượt xe ra vào, tỷ lệ theo loại xe, biến động theo giờ và xu hướng theo thời gian."
  },
  {
    title: "Bản Đồ Giám Sát",
    text: "Hiển thị trạm thu phí, đoạn tuyến, điểm sự kiện và khu vực quản lý trên nền bản đồ OSM."
  }
];

export default function HomePage() {
  return (
    <div className="shell section-space">
      <section className="page-intro">
        <span className="eyebrow">Cổng MVP</span>
        <h1>Hệ thống quản lý và giám sát cao tốc Bắc Nam</h1>
        <p>
          Phiên bản này ưu tiên luồng dữ liệu đơn giản: tải file, xử lý dữ liệu trong ứng dụng,
          hiển thị biểu đồ và kết hợp bản đồ thành một cổng quản lý hoàn chỉnh.
        </p>
      </section>

      <section className="hero-grid">
        <UploadZonePlaceholder />
        <ChartPlaceholder />
        <MapPlaceholder />
      </section>

      <section className="feature-grid section-space">
        {highlights.map((item) => (
          <article className="panel feature-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
