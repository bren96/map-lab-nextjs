import { Map } from "maplibre-gl";
import { useEffect, useRef } from "react";

export function WhiteBoardMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;
    map.current = new Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 0],
      zoom: 1,
    });
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
      }}
    />
  );
}
