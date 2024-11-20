import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import marker from './../../assets/map-pointer.png';

const markerIcon = new L.Icon({
    iconUrl: `${marker}`, 
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const UpdateMap = ({ defaultCoordinates, setDestination }) => {
  const [markerDestination, setMarkerDestination] = useState({
    latitude: defaultCoordinates?.latitude || null,
    longitude: defaultCoordinates?.longitude || null,
    address: "",
  });

  useEffect(() => {
    if (defaultCoordinates?.latitude && defaultCoordinates?.longitude) {
      setMarkerDestination({
        latitude: defaultCoordinates.latitude,
        longitude: defaultCoordinates.longitude,
        address: "Default location",
      });
    }
  }, [defaultCoordinates]);

  const handleMarkerDragEnd = async (event) => {
    const { lat, lng } = event.target.getLatLng();
    setMarkerDestination({ latitude: lat, longitude: lng });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      if (response.ok) {
        const data = await response.json();
        setMarkerDestination((prev) => ({
          ...prev,
          address: data.display_name || "Address not found",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch address", error);
    }

    setDestination({
      latitude: lat,
      longitude: lng,
      address: markerDestination.address,
    });
  };

  return (
    <div>
      <MapContainer
        center={[
          markerDestination.latitude || 0,
          markerDestination.longitude || 0,
        ]}
        zoom={13}
        style={{ height: "200px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[
            markerDestination.latitude || 0,
            markerDestination.longitude || 0,
          ]}
          icon={markerIcon}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default UpdateMap;
