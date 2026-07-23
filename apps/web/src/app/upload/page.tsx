import { UploadZonePlaceholder } from "@/components/upload/upload-zone-placeholder";

export default function UploadPage() {
  return (
    <div className="shell section-space">
      <section className="page-intro">
        <span className="eyebrow">Tải dữ liệu</span>
        <h1>Nạp file CSV và Excel</h1>
        <p>
          Luồng upload thật sau này sẽ được đưa vào cùng hệ card, badge và trạng thái tương tác để
          việc kiểm tra file, xem trước dữ liệu và cập nhật biểu đồ vẫn giữ đúng nhịp điệu thị giác
          của toàn bộ app.
        </p>
      </section>

      <UploadZonePlaceholder />
    </div>
  );
}
