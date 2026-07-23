"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, {
  LngLatBoundsLike,
  type LngLatLike,
  type Map,
  type MapMouseEvent,
  type GeoJSONSource,
  type StyleSpecification
} from "maplibre-gl";

import { northSouthTollStations } from "@/features/map/data/toll-stations";
import vietnamBoundaryData from "@/features/map/data/vietnam-boundary.json";
import { getStationCorridor } from "@/features/map/utils/get-station-corridor";

const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ??
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const BASEMAP_OPTIONS = [
  {
    id: "voyager",
    label: "Voyager",
    description: "Nền giao thông đậm hơn, phù hợp theo dõi tuyến."
  },
  {
    id: "positron",
    label: "Positron",
    description: "Nền sáng, ít nhiễu, hợp dashboard giám sát."
  },
  {
    id: "dark-matter",
    label: "Dark Matter",
    description: "Nền tối, hợp màn hình điều hành và ca trực đêm."
  }
] as const;

type BasemapId = (typeof BASEMAP_OPTIONS)[number]["id"];
type RouteGeometry = {
  coordinates: number[][];
  type: "LineString";
};

type GeoJsonRing = number[][];
type GeoJsonPolygonCoordinates = GeoJsonRing[];
type GeoJsonMultiPolygonCoordinates = GeoJsonPolygonCoordinates[];

type RouteSummary = {
  distanceMeters: number;
  durationSeconds: number;
  waypointCount: number;
};

const JOURNEY_OPTIONS = [
  {
    id: "journey-1",
    label: "Hành trình 1",
    startStationId: "01",
    endStationId: "12"
  },
  {
    id: "journey-2",
    label: "Hành trình 2",
    startStationId: "13",
    endStationId: "22"
  }
] as const;

type JourneyId = (typeof JOURNEY_OPTIONS)[number]["id"];

function createRasterStyle(tileUrl: string, attribution: string): StyleSpecification {
  return {
    version: 8 as const,
    sources: {
      osm: {
        type: "raster" as const,
        tiles: [tileUrl],
        tileSize: 256,
        attribution
      }
    },
    layers: [
      {
        id: "osm",
        type: "raster" as const,
        source: "osm"
      }
    ]
  };
}

function getBasemapStyle(basemapId: BasemapId) {
  switch (basemapId) {
    case "positron":
      return "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
    case "voyager":
      return "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
    case "dark-matter":
      return "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
    default:
      return createRasterStyle(TILE_URL, TILE_ATTRIBUTION);
  }
}

function getStationFeatures(startIndex: number, endIndex: number) {
  const first = Math.min(startIndex, endIndex);
  const last = Math.max(startIndex, endIndex);

  return {
    type: "FeatureCollection" as const,
    features: northSouthTollStations.map((station, index) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: station.coordinates
      },
      properties: {
        id: station.id,
        name: station.name,
        province: station.province,
        kmMarker: station.kmMarker,
        note: station.note,
        isEndpoint: index === first || index === last ? 1 : 0,
        status: station.status
      }
    }))
  };
}

function getRouteFeature(routeGeometry: RouteGeometry | null, startIndex: number, endIndex: number) {
  const corridor = northSouthTollStations.slice(
    Math.min(startIndex, endIndex),
    Math.max(startIndex, endIndex) + 1
  );
  const fallbackCoordinates = corridor.map((station) => station.coordinates);

  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: routeGeometry?.coordinates.length ? routeGeometry.coordinates : fallbackCoordinates
        },
        properties: {
          name: `${corridor[0]?.name ?? ""} -> ${corridor.at(-1)?.name ?? ""}`,
          isFallback: routeGeometry?.coordinates.length ? 0 : 1
        }
      }
    ]
  };
}

function getBounds(startIndex: number, endIndex: number): LngLatBoundsLike {
  const first = Math.min(startIndex, endIndex);
  const last = Math.max(startIndex, endIndex);
  const corridor = northSouthTollStations.slice(first, last + 1);
  const bounds = new maplibregl.LngLatBounds();

  corridor.forEach((station) => {
    bounds.extend(station.coordinates);
  });

  return bounds;
}

function getVietnamPolygons(): GeoJsonPolygonCoordinates[] {
  const feature = (vietnamBoundaryData as { features?: Array<{ geometry?: { type?: string; coordinates?: unknown } }> })
    .features?.[0];
  const geometry = feature?.geometry;

  if (!geometry || !geometry.coordinates) {
    return [];
  }

  if (geometry.type === "Polygon") {
    return [geometry.coordinates as GeoJsonPolygonCoordinates];
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates as GeoJsonMultiPolygonCoordinates;
  }

  return [];
}

function projectRingToPath(ring: GeoJsonRing, map: Map) {
  if (!ring.length) {
    return "";
  }

  return ring
    .map((coordinate, index) => {
      const point = map.project(coordinate as LngLatLike);
      return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ")
    .concat(" Z");
}

function createVietnamMaskOverlay(map: Map) {
  const width = map.getContainer().clientWidth;
  const height = map.getContainer().clientHeight;
  const rectanglePath = `M0 0 H${width} V${height} H0 Z`;
  const vietnamPaths = getVietnamPolygons()
    .flatMap((polygon) => polygon.map((ring) => projectRingToPath(ring, map)))
    .filter(Boolean)
    .join(" ");

  return {
    width,
    height,
    path: `${rectanglePath} ${vietnamPaths}`.trim()
  };
}

function ensureMapOverlays(
  map: Map,
  startIndex: number,
  endIndex: number,
  routeGeometry: RouteGeometry | null
) {
  const routeData = getRouteFeature(routeGeometry, startIndex, endIndex);
  const stationData = getStationFeatures(startIndex, endIndex);

  const routeSource = map.getSource("corridor") as GeoJSONSource | undefined;
  if (routeSource) {
    routeSource.setData(routeData);
  } else {
    map.addSource("corridor", {
      type: "geojson",
      data: routeData
    });
  }

  if (!map.getLayer("corridor-line")) {
    map.addLayer({
      id: "corridor-line",
      type: "line",
      source: "corridor",
      paint: {
        "line-color": [
          "case",
          ["==", ["get", "isFallback"], 1],
          "#bb3e03",
          "#005f73"
        ],
        "line-width": 5,
        "line-opacity": 0.85,
        "line-dasharray": [
          "case",
          ["==", ["get", "isFallback"], 1],
          ["literal", [1.2, 1.2]],
          ["literal", [1, 0]]
        ]
      }
    });
  }

  const stationSource = map.getSource("stations") as GeoJSONSource | undefined;
  if (stationSource) {
    stationSource.setData(stationData);
  } else {
    map.addSource("stations", {
      type: "geojson",
      data: stationData
    });
  }

  if (!map.getLayer("station-circles")) {
    map.addLayer({
      id: "station-circles",
      type: "circle",
      source: "stations",
      paint: {
        "circle-radius": ["case", ["==", ["get", "isEndpoint"], 1], 9, 6],
        "circle-color": ["case", ["==", ["get", "isEndpoint"], 1], "#ca6702", "#0a9396"],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff"
      }
    });
  }

  if (!map.getLayer("station-labels")) {
    map.addLayer({
      id: "station-labels",
      type: "symbol",
      source: "stations",
      layout: {
        "text-field": ["get", "name"],
        "text-size": 12,
        "text-offset": [0, 1.5],
        "text-anchor": "top"
      },
      paint: {
        "text-color": "#0f1720",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1.2
      }
    });
  }
}

export function TollStationMap() {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const activePopupStationIdRef = useRef<string | null>(null);
  const hasMountedBasemapEffectRef = useRef(false);
  const [basemapId, setBasemapId] = useState<BasemapId>("voyager");
  const [activeJourneyId, setActiveJourneyId] = useState<JourneyId>("journey-1");
  const [isMapReady, setIsMapReady] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState<RouteGeometry | null>(null);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [maskOverlay, setMaskOverlay] = useState({
    width: 0,
    height: 0,
    path: ""
  });

  const activeJourney =
    JOURNEY_OPTIONS.find((journey) => journey.id === activeJourneyId) ?? JOURNEY_OPTIONS[0];
  const startStationId = activeJourney.startStationId;
  const endStationId = activeJourney.endStationId;

  const startIndex = Math.max(
    northSouthTollStations.findIndex((station) => station.id === startStationId),
    0
  );
  const endIndex = Math.max(
    northSouthTollStations.findIndex((station) => station.id === endStationId),
    0
  );

  const corridorStations = useMemo(
    () => getStationCorridor(startStationId, endStationId),
    [endStationId, startStationId]
  );

  const selectionRef = useRef({ startIndex, endIndex });
  selectionRef.current = { startIndex, endIndex };
  const routeGeometryRef = useRef<RouteGeometry | null>(routeGeometry);
  routeGeometryRef.current = routeGeometry;

  const activeBasemap = useMemo(
    () => BASEMAP_OPTIONS.find((option) => option.id === basemapId) ?? BASEMAP_OPTIONS[0],
    [basemapId]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getBasemapStyle(basemapId),
      center: [106.1, 18.9],
      zoom: 5.6
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const updateMaskOverlay = () => {
      setMaskOverlay(createVietnamMaskOverlay(map));
    };

    const handleStyleLoad = () => {
      const nextSelection = selectionRef.current;
      const nextRouteGeometry = routeGeometryRef.current;

      ensureMapOverlays(
        map,
        nextSelection.startIndex,
        nextSelection.endIndex,
        nextRouteGeometry
      );
      map.fitBounds(getBounds(nextSelection.startIndex, nextSelection.endIndex), {
        padding: 60,
        duration: 0
      });
      updateMaskOverlay();
      setIsMapReady(true);
    };

    const handleMapClick = (event: MapMouseEvent) => {
      if (!map.getLayer("station-circles")) {
        return;
      }

      const feature = map.queryRenderedFeatures(event.point, {
        layers: ["station-circles"]
      })[0];

      if (!feature || !feature.geometry || feature.geometry.type !== "Point") {
        return;
      }

      const [lng, lat] = feature.geometry.coordinates;
      const stationId = String(feature.properties?.id ?? "");
      const name = String(feature.properties?.name ?? "");
      const province = String(feature.properties?.province ?? "");
      const kmMarker = String(feature.properties?.kmMarker ?? "");
      const note = String(feature.properties?.note ?? "");

      if (popupRef.current && activePopupStationIdRef.current === stationId) {
        popupRef.current.remove();
        popupRef.current = null;
        activePopupStationIdRef.current = null;
        return;
      }

      popupRef.current?.remove();
      activePopupStationIdRef.current = stationId;
      const popup = new maplibregl.Popup({ closeButton: false, offset: 18 });
      popup.on("close", () => {
        popupRef.current = null;
        activePopupStationIdRef.current = null;
      });
      popupRef.current = popup;
      popup
        .setLngLat([lng, lat])
        .setHTML(
          `<div class="map-popup">
            <strong class="map-popup-title">${name}</strong>
            <div class="map-popup-meta">
              <span><strong>Tỉnh:</strong> ${province}</span>
              <span><strong>Vị trí:</strong> ${kmMarker}</span>
              <span>${note}</span>
            </div>
          </div>`
        )
        .addTo(map);
    };

    const handlePointerMove = (event: MapMouseEvent) => {
      if (!map.getLayer("station-circles")) {
        map.getCanvas().style.cursor = "";
        return;
      }

      const hasStation = map.queryRenderedFeatures(event.point, {
        layers: ["station-circles"]
      }).length;
      map.getCanvas().style.cursor = hasStation ? "pointer" : "";
    };

    map.on("style.load", handleStyleLoad);
    map.on("click", handleMapClick);
    map.on("mousemove", handlePointerMove);
    map.on("move", updateMaskOverlay);
    map.on("resize", updateMaskOverlay);

    mapRef.current = map;

    return () => {
      map.off("style.load", handleStyleLoad);
      map.off("click", handleMapClick);
      map.off("mousemove", handlePointerMove);
      map.off("move", updateMaskOverlay);
      map.off("resize", updateMaskOverlay);
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!hasMountedBasemapEffectRef.current) {
      hasMountedBasemapEffectRef.current = true;
      return;
    }

    popupRef.current?.remove();
    popupRef.current = null;
    activePopupStationIdRef.current = null;
    setIsMapReady(false);
    mapRef.current.setStyle(getBasemapStyle(basemapId));
  }, [basemapId]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDrivingRoute() {
      setIsRouting(true);
      setRouteError(null);

      try {
        const searchParams = new URLSearchParams({
          startStationId,
          endStationId
        });
        const response = await fetch(`/api/route?${searchParams.toString()}`, {
          signal: controller.signal,
          cache: "no-store"
        });
        const payload = (await response.json()) as
          | {
              distanceMeters: number;
              durationSeconds: number;
              geometry: RouteGeometry;
              waypointCount: number;
            }
          | { error: string };

        if (!response.ok || "error" in payload) {
          throw new Error(
            "error" in payload ? payload.error : "Không thể tính tuyến ô tô cho cặp trạm này."
          );
        }

        setRouteGeometry(payload.geometry);
        setRouteSummary({
          distanceMeters: payload.distanceMeters,
          durationSeconds: payload.durationSeconds,
          waypointCount: payload.waypointCount
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setRouteGeometry(null);
        setRouteSummary(null);
        setRouteError(
          error instanceof Error ? error.message : "Không thể lấy dữ liệu tuyến ô tô lúc này."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsRouting(false);
        }
      }
    }

    void loadDrivingRoute();

    return () => {
      controller.abort();
    };
  }, [endStationId, startStationId]);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) {
      return;
    }

    ensureMapOverlays(mapRef.current, startIndex, endIndex, routeGeometry);

    mapRef.current.fitBounds(getBounds(startIndex, endIndex), {
      padding: 60,
      maxZoom: 9,
      duration: 800
    });
  }, [endIndex, isMapReady, routeGeometry, startIndex]);

  return (
    <section className="map-layout">
      <aside className="panel map-sidebar-left">
        <div className="map-basemap-switcher">
          <div>
            <h3 className="section-title">Chọn nền bản đồ</h3>
            <p className="section-copy">
              Đổi nhanh giữa các nền để xem lớp trạm và tuyến trong các bối cảnh hiển thị khác
              nhau.
            </p>
          </div>

          <div className="map-basemap-grid" role="list" aria-label="Danh sách nền bản đồ">
            {BASEMAP_OPTIONS.map((option) => {
              const isActive = option.id === basemapId;

              return (
                <button
                  className={`map-basemap-button${isActive ? " is-active" : ""}`}
                  key={option.id}
                  onClick={() => setBasemapId(option.id)}
                  type="button"
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              );
            })}
          </div>

          <p className="map-current-basemap">
            Nền đang dùng: <strong>{activeBasemap.label}</strong>
          </p>
        </div>
      </aside>

      <div className="panel map-stage">
        <div>
          <h3 className="section-title">Bản đồ tương tác</h3>
          <p className="section-copy">
            Bấm vào marker để xem thông tin trạm và dùng khung hai bên để đổi nền hoặc chuyển hành
            trình đang theo dõi.
          </p>
        </div>

        <div className="map-legend">
          <span className="map-legend-item">
            <span className="map-dot is-station" />
            Trạm thu phí
          </span>
          <span className="map-legend-item">
            <span className="map-dot is-endpoint" />
            Điểm đầu hoặc cuối đang chọn
          </span>
          <span className="map-legend-item">
            <span className="map-dot is-route" />
            Tuyến ô tô
          </span>
        </div>

        <div className="map-frame">
          <div className="map-canvas" ref={mapContainerRef} />
          {maskOverlay.path ? (
            <svg
              aria-hidden="true"
              className="map-mask-overlay"
              viewBox={`0 0 ${maskOverlay.width} ${maskOverlay.height}`}
            >
              <path d={maskOverlay.path} fill="var(--map-mask-fill)" fillRule="evenodd" />
            </svg>
          ) : null}
        </div>
      </div>

      <aside className="panel map-sidebar-right">
        <div className="map-journeys">
          <h3 className="section-title">Danh sách hành trình</h3>
          <p className="section-copy">
            Chọn một hành trình để mở thông tin chi tiết và cập nhật tuyến trên bản đồ.
          </p>
          {JOURNEY_OPTIONS.map((journey) => {
            const startStation = northSouthTollStations.find(
              (station) => station.id === journey.startStationId
            );
            const endStation = northSouthTollStations.find(
              (station) => station.id === journey.endStationId
            );
            const isActive = journey.id === activeJourneyId;

            return (
              <article
                className={`map-journey-card${isActive ? " is-active" : ""}`}
                key={journey.id}
              >
                <button
                  className="map-journey-trigger"
                  onClick={() => setActiveJourneyId(journey.id)}
                  type="button"
                >
                  <span className="map-journey-title">{journey.label}</span>
                  <span className="map-journey-summary">
                    {startStation?.name} - {endStation?.name}
                  </span>
                </button>

                {isActive ? (
                  <div className="map-journey-details">
                    <div className="map-journey-metrics">
                      <div className="map-journey-metric">
                        <span>Số nút giao</span>
                        <strong>{routeSummary?.waypointCount ?? corridorStations.length}</strong>
                      </div>
                      <div className="map-journey-metric">
                        <span>Tổng km</span>
                        <strong>
                          {routeSummary
                            ? `${(routeSummary.distanceMeters / 1000).toFixed(1)} km`
                            : "--"}
                        </strong>
                      </div>
                    </div>

                    <div className="map-journey-points">
                      <p>
                        <strong>Điểm đầu:</strong> {startStation?.name}
                      </p>
                      <p>
                        <strong>Điểm cuối:</strong> {endStation?.name}
                      </p>
                    </div>

                    <div className="map-status">
                      <span className={`map-status-pill${isRouting ? " is-loading" : ""}`}>
                        {isRouting ? "Đang tính tuyến ô tô..." : "Đã cập nhật hành trình"}
                      </span>
                      {routeError ? <p>{routeError}</p> : null}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
