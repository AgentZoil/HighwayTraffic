export function UploadZonePlaceholder() {
  return (
    <section className="panel placeholder">
      <div>
        <span className="eyebrow">Tải dữ liệu</span>
        <h3>Khu vực nạp file</h3>
        <p>
          Đặt component kéo thả ở đây. Mục tiêu là đọc CSV và Excel, ánh xạ cột dữ liệu, xem
          trước nội dung và chuẩn hóa sang một schema chung cho khu vực biểu đồ.
        </p>
      </div>

      <pre className="placeholder-code">{`src/features/traffic-data/
- parsers
- schema
- transformers
- validators`}</pre>
    </section>
  );
}
