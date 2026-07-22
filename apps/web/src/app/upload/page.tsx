import { UploadZonePlaceholder } from "@/components/upload/upload-zone-placeholder";

export default function UploadPage() {
  return (
    <div className="shell section-space">
      <section className="page-intro">
        <span className="eyebrow">Tải dữ liệu</span>
        <h1>Nạp file CSV và Excel</h1>
        <p>
          Khu vực này dự kiến kiểm tra file, ánh xạ cột dữ liệu, xem trước dữ liệu và chuyển đổi
          về một schema thống nhất trước khi đổ lên khu vực biểu đồ.
        </p>
      </section>

      <UploadZonePlaceholder />
    </div>
  );
}
