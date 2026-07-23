import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { MapPlaceholder } from "@/components/maps/map-placeholder";
import { UploadZonePlaceholder } from "@/components/upload/upload-zone-placeholder";

const highlights = [
  {
    title: "Cập Nhật Dữ Liệu Có Kiểm Soát",
    text: "Chuẩn bị luồng nạp CSV hoặc Excel theo đợt để số liệu từ từng trạm được làm sạch và hiển thị nhất quán."
  },
  {
    title: "Biểu Đồ Theo Dõi Xu Hướng",
    text: "Biến số liệu đầu vào thành các lớp so sánh theo giờ, theo trạm, theo loại xe và theo từng kỳ vận hành."
  },
  {
    title: "Bản Đồ Hành Trình Trọng Tâm",
    text: "Theo dõi trạm, tuyến và các hành trình mẫu trong một không gian trực quan để phục vụ điều hành nội bộ."
  }
];

const quickStats = [
  {
    value: "22 trạm",
    label: "Tập trạm mẫu đã được gắn lên bản đồ để mô phỏng khung giám sát ban đầu."
  },
  {
    value: "2 hành trình",
    label: "Hai hành trình trọng tâm đang được cấu hình để kiểm tra luồng điều hướng và khối thông tin."
  },
  {
    value: "1 nền tảng",
    label: "Map, upload và dashboard cùng bám chung một design language để scale không bị chắp vá."
  }
];

export default function HomePage() {
  return (
    <div className="shell section-space">
      <section className="hero-shell">
        <div className="page-intro page-intro-home">
          <span className="eyebrow">Điều hành nội bộ</span>
          <h1>
            Quản lý tuyến và dữ liệu cao tốc theo một giao diện{" "}
            <span className="gradient-text">rõ ràng, hiện đại</span>
          </h1>
          <p>
            Web app này được dựng như một khung điều hành có thể mở rộng: map là trọng tâm ở giai
            đoạn đầu, sau đó nối tiếp bằng upload dữ liệu, biểu đồ lưu lượng và các chỉ số giám sát
            trong cùng một ngôn ngữ thiết kế tối giản nhưng vẫn có điểm nhấn mạnh.
          </p>
          <div className="hero-actions">
            <a className="action-button" href="/map">
              Mở bản đồ giám sát
            </a>
            <a className="action-button is-secondary" href="/upload">
              Chuẩn bị luồng dữ liệu
            </a>
          </div>
        </div>

        <div className="panel hero-visual">
          <div className="hero-rings" aria-hidden="true" />
          <div className="hero-stack">
            <article className="signal-card">
              <span className="signal-label">
                <span className="signal-dot" />
                Tuyến đang theo dõi
              </span>
              <div className="signal-metric">Mai Sơn - Diễn Cát</div>
              <p className="signal-copy">
                Hành trình mẫu đang dùng để kiểm tra định tuyến ô tô, popup trạm và tổ chức không
                gian hiển thị.
              </p>
              <span className="signal-trend">Định tuyến đang hoạt động</span>
            </article>

            <article className="signal-card-accent">
              <span className="signal-label">
                <span className="signal-dot" />
                Trạng thái nền tảng
              </span>
              <div className="signal-metric">Map trước</div>
              <p className="signal-copy">
                Bố cục và token đã được thiết kế để sau này gắn thêm upload CSV và dashboard mà
                không phải làm lại giao diện từ đầu.
              </p>
              <span className="signal-trend">Sẵn sàng mở rộng biểu đồ</span>
            </article>
          </div>
        </div>
      </section>

      <section className="inverted-section">
        <div className="inverted-section-content">
          <div className="section-heading">
            <span className="eyebrow">Tổng quan nhanh</span>
            <h2>
              Một nền điều hành <span className="gradient-text">gọn mà có nhịp</span>
            </h2>
            <p>
              Kiến trúc hiện tại đang ưu tiên tốc độ dựng MVP nhưng vẫn giữ chỗ cho các lớp nghiệp
              vụ sẽ đến sau. Mỗi phần nhìn đơn giản, nhưng tất cả đều đã được đặt trong một cấu
              trúc có thể dùng lâu dài.
            </p>
          </div>

          <div className="stat-grid">
            {quickStats.map((item) => (
              <article className="stat-card" key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
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
