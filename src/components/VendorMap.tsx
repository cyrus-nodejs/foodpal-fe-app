import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Vendor } from "../pages/vendor/vendorMarketPlace"

// Fix for default marker icons
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

interface VendorMapProps {
  vendors: Vendor[];
  userLocation: { lat: number; lng: number } | null;
  onVendorClick?: (vendor: Vendor) => void;
}

const VendorMap: React.FC<VendorMapProps> = ({
  vendors,
  userLocation,
  onVendorClick,
}) => {
  const center = userLocation || { lat: 9.082, lng: 8.6753 }; // Default to center of Nigeria

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={userLocation ? 12 : 6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={
              new L.Icon({
                iconUrl:
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })
            }
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Vendor markers */}
        {vendors.map((vendor) => {
          if (!vendor.coordinates) return null;

          return (
            <Marker
              key={vendor.id}
              position={[vendor.coordinates.lat, vendor.coordinates.lng]}
              icon={
                new L.Icon({
                  iconUrl:
                    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                })
              }
              eventHandlers={{
                click: () => onVendorClick?.(vendor),
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <p className="text-sm text-gray-600">{vendor.description}</p>
                  {vendor.distance !== undefined && (
                    <p className="text-sm text-gray-600 mt-1">
                      {vendor.distance.toFixed(1)} km away
                    </p>
                  )}
                  <div className="mt-2">
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {vendor.category}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default VendorMap;
