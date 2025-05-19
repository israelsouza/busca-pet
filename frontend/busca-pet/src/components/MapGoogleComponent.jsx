import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import API_KEY from "../config/maps-api.js";

const containerStyle = {
  width: "900px",
  height: "500px",
};

const spCenter = {
  lat: -23.5505,
  lng: -46.6333,
};

function MapGoogleComponent() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  const [mapCenter, setMapCenter] = useState(spCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMarkerPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Geolocalização falhou, usando posição default");
        }
      );
    } else {
      console.log("Geolocalização não suportada pelo navegador.");
    }
  }, []);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

    const handleMapClick = useCallback((event) => {
        setMarkerPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        })
        console.log("Map clicked at:", { lat: event.latLng.lat(), lng: event.latLng.lng() });
    }, [])

  if (loadError) return <div>Error LOADING MAPS</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
}

export default MapGoogleComponent;
