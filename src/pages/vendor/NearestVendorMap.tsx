import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

type Place = {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
};

type Props = {
  radius?: number; 
  maxResults?: number;
};

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Recenter({ position }: { position: LatLngExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 16);
  }, [position, map]);
  return null;
}

export default function NearestVendorMap({ radius = 1000, maxResults = 50 }: Props) {
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // 🔥 RETRY count
  const [retryCount, setRetryCount] = useState(0);

  // -----------------------------
  // 1. BROWSER GEOLOCATION
  // -----------------------------
  const requestGeolocation = () => {
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
        setShowPermissionModal(false);
      },
      async (err) => {
        setLoading(false);

        // Permission denied or blocked
        if (err.code === err.PERMISSION_DENIED) {
          setShowPermissionModal(true);
          setError("Location permission denied.");
          return;
        }

        // Other errors → fallback to IP
        await fetchIPLocation();
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // -----------------------------
  // 2. FALLBACK IP-BASED LOCATION
  // -----------------------------
  const fetchIPLocation = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ipapi.co/json");
      const data = await res.json();

      if (data?.latitude && data?.longitude) {
        setUserPos({ lat: data.latitude, lon: data.longitude });
        setError("Using approximate IP-based location.");
      } else {
        setError("Unable to detect location.");
      }
    } catch {
      setError("Location detection failed.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 3. PERMISSION CHECK + RETRY
  // -----------------------------
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported.");
      fetchIPLocation();
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") {
          requestGeolocation();
        } else if (result.state === "prompt") {
          requestGeolocation();
        } else if (result.state === "denied") {
          setShowPermissionModal(true);
          fetchIPLocation();
        }

        // Auto-retry when permission changes
        result.onchange = () => {
          if (result.state === "granted") {
            requestGeolocation();
          }
        };
      })
      .catch(() => fetchIPLocation());
  }, [retryCount]); // retry trigger

  // -----------------------------
  // 4. FETCH NEARBY PLACES
  // -----------------------------
  useEffect(() => {
    if (!userPos) return;

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      const query = `
        [out:json][timeout:25];
        (
          node(around:${radius},${userPos.lat},${userPos.lon})[shop];
          node(around:${radius},${userPos.lat},${userPos.lon})[amenity=marketplace];
          node(around:${radius},${userPos.lat},${userPos.lon})[amenity=market];
          node(around:${radius},${userPos.lat},${userPos.lon})[amenity=restaurant];
          node(around:${radius},${userPos.lat},${userPos.lon})[amenity=fast_food];
        );
        out body ${maxResults};
      `;

      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(query)}`,
        });

        const data = await res.json();

        const nodes: Place[] = (data.elements || [])
          .filter((el: any) => el.type === "node")
          .map((el: any) => ({ id: el.id, lat: el.lat, lon: el.lon, tags: el.tags || {} }));

        setPlaces(nodes.slice(0, maxResults));
      } catch {
        setError("Failed to fetch nearby places.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [userPos, radius, maxResults]);

  const center: LatLngExpression = useMemo(() => {
    if (userPos) return [userPos.lat, userPos.lon];
    return [6.5244, 3.3792];
  }, [userPos]);

  return (
    <>
      {/* PERMISSION MODAL */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded shadow-md w-80 text-center">
            <h3 className="font-semibold text-lg mb-2">Enable Location</h3>
            <p className="text-sm mb-4">
              To detect your current location, please enable location permission for this site.
            </p>

            <button
              onClick={() => {
                setShowPermissionModal(false);
                setRetryCount((c) => c + 1);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <div className="w-full h-[600px] flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-h-[300px] rounded-md overflow-hidden shadow-md">
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userPos && <Recenter position={[userPos.lat, userPos.lon]} />}

            {userPos && (
              <>
                <Marker position={[userPos.lat, userPos.lon]}>
                  <Popup>Your Location</Popup>
                </Marker>
                <Circle center={[userPos.lat, userPos.lon]} radius={radius} />
              </>
            )}

            {places.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lon]}>
                <Popup>
                  <strong>{p.tags.name || "Unnamed"}</strong>
                  {p.tags.shop && <div>Type: {p.tags.shop}</div>}
                  {p.tags.amenity && <div>Amenity: {p.tags.amenity}</div>}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* SIDEBAR */}
        <aside className="w-full md:w-80 p-3 bg-white rounded-md shadow-md overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Nearby Vendors</h3>
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="text-sm px-2 py-1 rounded bg-gray-100"
            >
              Retry Location
            </button>
          </div>

          {loading && <div className="text-gray-500 text-sm">Loading…</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <ul className="space-y-2 mt-3">
            {places.map((p) => (
              <li key={p.id} className="p-2 border rounded">
                <div className="font-medium">{p.tags.name || "Unnamed"}</div>
                <div className="text-xs">{p.tags.shop || p.tags.amenity || "shop"}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
