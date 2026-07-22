export function ChartPlaceholder() {
  return (
    <section className="panel placeholder">
      <div>
        <span className="eyebrow">Biểu đồ</span>
        <h3>Khu vực biểu đồ</h3>
        <p>
          Đặt `Apache ECharts` vào đây. Nên chia nhỏ thành các widget: lưu lượng theo giờ, theo
          trạm, cơ cấu loại xe, nhóm trạm nổi bật và biểu đồ so sánh theo kỳ.
        </p>
      </div>

      <pre className="placeholder-code">{`src/components/charts/
- traffic-volume-line-chart.tsx
- station-comparison-bar-chart.tsx
- vehicle-type-pie-chart.tsx
- kpi-summary-cards.tsx`}</pre>
    </section>
  );
}
