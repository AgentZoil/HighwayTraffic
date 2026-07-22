export function MapPlaceholder() {
  return (
    <section className="panel placeholder">
      <div>
        <span className="eyebrow">Bản đồ</span>
        <h3>Khu vực bản đồ OSM</h3>
        <p>
          Đặt `MapLibre GL JS` vào đây. Bản đồ có thể bắt đầu với marker trạm, popup thông tin,
          lớp tuyến và bộ lọc hiển thị theo khu vực.
        </p>
      </div>

      <pre className="placeholder-code">{`src/components/maps/
- toll-station-map.tsx
- station-popup.tsx
- route-layer.tsx
- map-legend.tsx`}</pre>
    </section>
  );
}
