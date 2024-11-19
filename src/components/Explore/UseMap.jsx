import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Explore.css';

const customIcon = L.divIcon({
  className: 'custom-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});

const UseMap = ({ setDestination }) => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [markerDestination, setMarkerDestination] = useState({ latitude: null, longitude: null, address: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          setMarkerDestination({ latitude, longitude, address: 'Your current location' });
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
    setMarkerDestination({ latitude: lat, longitude: lng });

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    if (response.ok) {
      const data = await response.json();
      setMarkerDestination((prev) => ({
        ...prev,
        address: data.display_name || 'Address not found',
      }));
    } else {
      console.error("Failed to fetch address");
    }

    // Update parent component via the prop
    setDestination({ latitude: lat, longitude: lng, address: markerDestination.address });
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : coordinates.latitude && coordinates.longitude ? (
          <div>
            <MapContainer
              center={[coordinates.latitude, coordinates.longitude]}
              zoom={13}
              style={{ height: "200px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[markerDestination.latitude, markerDestination.longitude]}
                icon={customIcon}
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
      <p>latitude={markerDestination.latitude}, longitude={markerDestination.longitude}</p>
    </>
  );
};

export default UseMap;
