import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import marker from './../../assets/marker.gif';

const ShowMap = ({ latitude, longitude }) => {
  if (!latitude || !longitude) {
    return <p>Coordinates not available.</p>;
  }

  // Create a custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: `${marker}`, 
    iconSize: [125, 125],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="mt-2">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ width: '100%', height: '400px' }}
        scrollWheelZoom={true}  
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          
        />
        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup>
            Futsal Location: {latitude}, {longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ShowMap;
