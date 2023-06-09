import { Map } from "maplibre-gl";
import { ComponentProps, useEffect, useRef } from "react";

type Props = ComponentProps<"div">;

export function WhiteboardMap({ ...props }: Props) {
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
      hash: true,
      maplibreLogo: true,
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
      onPointerDown={props.onPointerDown}
      onPointerUp={props.onPointerUp}
    />
  );
}
