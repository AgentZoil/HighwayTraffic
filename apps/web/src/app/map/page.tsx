import { TollStationMap } from "@/components/maps/toll-station-map";

export default function MapPage() {
  return (
    <div className="map-page-shell section-space">
      <section className="page-intro">
        {/* <span className="eyebrow">Bản đồ</span> */}
        {/* <h1>Bản đồ trạm và tuyến giám sát</h1> */}
        {/* <p>
          Phiên bản hiện tại ưu tiên phần bản đồ trước: hiển thị trạm thu phí mẫu, hành lang giữa
          các trạm, thông tin popup và khung sẵn sàng cho tính năng lập hành trình sau này.
        </p> */}
      </section>

      <TollStationMap />
    </div>
  );
}
