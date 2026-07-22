import { NextRequest, NextResponse } from "next/server";

import { getStationCorridor } from "@/features/map/utils/get-station-corridor";

const OSRM_BASE_URL =
  process.env.OSRM_API_BASE_URL?.replace(/\/$/, "") ?? "https://router.project-osrm.org";

type OsrmRouteResponse = {
  code: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: number[][];
      type: "LineString";
    };
    legs?: Array<{
      distance: number;
      duration: number;
    }>;
  }>;
  message?: string;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startStationId = searchParams.get("startStationId");
  const endStationId = searchParams.get("endStationId");

  if (!startStationId || !endStationId) {
    return NextResponse.json(
      { error: "Thiếu trạm bắt đầu hoặc trạm kết thúc." },
      { status: 400 }
    );
  }

  const corridor = getStationCorridor(startStationId, endStationId);

  if (corridor.length < 2) {
    return NextResponse.json(
      { error: "Cần ít nhất hai trạm để lập hành trình." },
      { status: 400 }
    );
  }

  const coordinates = corridor.map((station) => station.coordinates.join(",")).join(";");
  const routeUrl =
    `${OSRM_BASE_URL}/route/v1/driving/${coordinates}` +
    "?alternatives=false&steps=true&geometries=geojson&overview=full&continue_straight=true";

  try {
    const response = await fetch(routeUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "trafficdemo-mvp/1.0"
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Không thể lấy dữ liệu lập hành trình từ dịch vụ routing." },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as OsrmRouteResponse;

    if (payload.code !== "Ok" || !payload.routes?.[0]) {
      return NextResponse.json(
        {
          error: payload.message ?? "Dịch vụ routing không trả về tuyến phù hợp."
        },
        { status: 502 }
      );
    }

    const primaryRoute = payload.routes[0];

    return NextResponse.json({
      distanceMeters: primaryRoute.distance,
      durationSeconds: primaryRoute.duration,
      geometry: primaryRoute.geometry,
      waypointCount: corridor.length
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể kết nối tới dịch vụ routing ở thời điểm hiện tại." },
      { status: 502 }
    );
  }
}
