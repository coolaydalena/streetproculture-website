"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker } from "leaflet";
import { SITE } from "@/lib/site";

export type LatLng = { lat: number; lng: number };

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * Optional delivery map pin. Leaflet + OpenStreetMap tiles (no API key). The map
 * library is imported inside the effect so it never runs during SSR.
 */
export function LocationPicker({
  value,
  onChange,
}: {
  value: LatLng | null;
  onChange: (v: LatLng) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);

  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mod = await import("leaflet");
      const L: typeof import("leaflet") =
        (mod as { default?: typeof import("leaflet") }).default ?? mod;
      if (cancelled || !elRef.current || mapRef.current) return;

      const start = value ?? SITE.location.geo;
      const map = L.map(elRef.current, { scrollWheelZoom: false }).setView(
        [start.lat, start.lng],
        value ? 16 : 14,
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="#6B1420"/><circle cx="14" cy="14" r="5.5" fill="#F5F1E8"/></svg>`,
        iconSize: [28, 40],
        iconAnchor: [14, 40],
      });

      const marker = L.marker([start.lat, start.lng], {
        draggable: true,
        icon,
        keyboard: false,
      });
      markerRef.current = marker;
      if (value) marker.addTo(map);

      const emit = (lat: number, lng: number) =>
        onChangeRef.current({ lat: round(lat), lng: round(lng) });

      marker.on("dragend", () => {
        const p = marker.getLatLng();
        emit(p.lat, p.lng);
      });
      map.on("click", (e) => {
        marker.setLatLng(e.latlng).addTo(map);
        emit(e.latlng.lat, e.latlng.lng);
      });

      setTimeout(() => map.invalidateSize(), 0);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Intentionally run once — `value` only seeds the initial view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoError("Location isn't available on this device.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = round(pos.coords.latitude);
        const lng = round(pos.coords.longitude);
        const map = mapRef.current;
        const marker = markerRef.current;
        if (map && marker) {
          marker.setLatLng([lat, lng]).addTo(map);
          map.setView([lat, lng], 16);
        }
        onChange({ lat, lng });
      },
      () => {
        setLocating(false);
        setGeoError("Couldn't get your location. Drop the pin manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="u-label text-ink-soft">Pin your location (optional)</span>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="u-label text-oxblood hover:underline disabled:opacity-50"
        >
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>
      <div
        ref={elRef}
        className="mt-2 h-60 w-full border border-line bg-line"
        aria-label="Delivery location map"
      />
      <p className="mt-1.5 text-xs text-ink-soft">
        {value
          ? `Pinned at ${value.lat}, ${value.lng}`
          : "Tap the map to drop a pin so the courier finds you faster."}
      </p>
      {geoError && <p className="mt-1 text-xs text-oxblood">{geoError}</p>}
    </div>
  );
}
