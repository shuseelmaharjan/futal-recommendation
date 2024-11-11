import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Explore.css';
import { Results } from '../Results/Results';

// Custom marker icon
const customIcon = L.divIcon({
  className: 'custom-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});

export const Explore = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [destination, setDestination] = useState({ latitude: null, longitude: null, address: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          setDestination({ latitude, longitude, address: 'Your current location' });
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
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Locate your location</h1>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : coordinates.latitude && coordinates.longitude ? (
          <div>
            <MapContainer
                center={[coordinates.latitude, coordinates.longitude]}
                zoom={13}
                style={{ height: "400px", width: "100%", zIndex: -20 }}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[destination.latitude, destination.longitude]}
                icon={customIcon}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              >
              </Marker>
            </MapContainer>
            {destination.latitude && destination.longitude && (
              <div className="mt-4 flex justify-between">
                <p className="font-bold">Destination Latitude: {destination.latitude}</p>
                <p className="font-bold">Destination Longitude: {destination.longitude}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
      <Results latitude={destination.latitude} longitude={destination.longitude} />
    </>
  );
}
