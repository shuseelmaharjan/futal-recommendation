import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import marker from "./../../assets/map-pointer.png";
import FormulaList from "../Results/FormulaList";

const markerIcon = new L.Icon({
  iconUrl: `${marker}`,
  iconSize: [48, 48],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Explore = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [destination, setDestination] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [radius, setRadius] = useState(5);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          setDestination({
            latitude,
            longitude,
            address: "Your current location",
          });
        },
        (err) => {
          setError("Location access denied. Unable to retrieve location.");
          console.error(err);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMarkerDragEnd = async (event) => {
    const { lat, lng } = event.target.getLatLng();
    setDestination({ latitude: lat, longitude: lng });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    if (response.ok) {
      const data = await response.json();
      setDestination((prev) => ({
        ...prev,
        address: data.display_name || "Address not found",
      }));
    } else {
      console.error("Failed to fetch address");
    }
  };

  return (
    <div className="relative">
      {/* Map Section */}
      <div className="container mx-auto p-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : coordinates.latitude && coordinates.longitude ? (
          <div className="relative z-0">
            <MapContainer
              center={[coordinates.latitude, coordinates.longitude]}
              zoom={13}
              style={{
                height: "400px",
                width: "100%",
                borderRadius: "0.5rem",
                zIndex: "1",
              }}
              className="shadow-lg overflow-hidden"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[destination.latitude, destination.longitude]}
                icon={markerIcon}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              />
            </MapContainer>
          </div>
        ) : (
          <p>Loading location...</p>
        )}
      </div>

      {/* Radius Input */}
      <div className="container mx-auto mb-4 mt-4 flex justify-end items-center">
        <label htmlFor="radius" className="block font-medium text-gray-700 mx-2">
          Radius (km):
        </label>
        <input
          type="number"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="border rounded p-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
        />
      </div>

      {/* Results Section */}
      <div className="container mx-auto">
        <FormulaList
          latitude={destination.latitude}
          longitude={destination.longitude}
          radius={radius}
        />
      </div>
    </div>
  );
};

export default Explore;
