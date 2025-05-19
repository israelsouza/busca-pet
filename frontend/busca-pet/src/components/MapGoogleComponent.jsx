import { useState, useCallback } from "react";
import {  GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import API_KEY from "../config/maps-api.js";

const containerStyle = {
    width: "900px",
    height: "500px",
}

const center = {
    lat: -23.5505,
    lng: -46.6333,
}

function MapGoogleComponent(){
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    })

    const [map, setMap] = useState(null)
    const onLoad = useCallback(map => {
        setMap(map);
    })

    const onUnmount = useCallback(map => {
        setMap(null);
    }, []);

    if (loadError) return <div>Error LOADING MAPS</div>;
    if (!isLoaded) return <div>Loading Maps</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <Marker
                position={center}
                onClick={() => {
                    console.log("Marker clicked");
                }}
            />
            
        </GoogleMap>
    );

}

export default MapGoogleComponent;