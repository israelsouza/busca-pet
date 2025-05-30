import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow   } from "@react-google-maps/api";

import API_KEY from "../config/maps-api.js";

const spCenter = {
  lat: -23.5505,
  lng: -46.6333,
};

function MapGoogleComponent({
  onSelectLocalMap, 
  width='900px', 
  height='500px', 
  localChamadaMapa, 
  latitudeOut, 
  longitudeOut, 
  centerOutside,
  center, radius, pets,
  onShowPublication 
  }) {

  const containerStyle = {
    width, height
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  const [mapCenter, setMapCenter] = useState(spCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);

  // InfoView
  const [activeInfoWindow, setActiveInfoWindow] = useState(null); // Armazena o ID do pet ativo
  const [infoWindowContent, setInfoWindowContent] = useState(null); // Armazena os dados do pet para exibir
  const [infoWindowPosition, setInfoWindowPosition] = useState(null); // Posição do InfoWindow

  useEffect(()=>{
    if (center) {
      setMapCenter(center);
      //setMarkerPosition(null)
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geoCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (centerOutside && latitudeOut && longitudeOut) {
            setMapCenter({ lat: latitudeOut, lng: longitudeOut });            
          } else {
            setMapCenter(geoCoords);            
          }
        }, 
        () => { // Caso a geolocalização falhe
          console.log("Geolocalização falhou, usando posição default");
          if (centerOutside && latitudeOut && longitudeOut) {
            setMapCenter({ lat: latitudeOut, lng: longitudeOut });
          } else {
            setMapCenter(spCenter);
          }
        }
      );
    } else { // Caso o navegador não suporte geolocalização
      console.log("Geolocalização não suportada pelo navegador.");
      if (centerOutside && latitudeOut && longitudeOut) {
        setMapCenter({ lat: latitudeOut, lng: longitudeOut });
        // REMOVA ESTA LINHA: setMarkerPosition({ lat: latitudeOut, lng: longitudeOut });
      } else {
        setMapCenter(spCenter);
        // REMOVA ESTA LINHA: setMarkerPosition(spCenter);
      }
    }
    }, [center, centerOutside, latitudeOut, longitudeOut])


    // COMENTAR ESSE USE PARA TESTAR SE QUEBRA NAS DEMAIS
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {

  //         { centerOutside ? setMapCenter({
  //           lat: latitudeOut,
  //           lng: longitudeOut
  //         }) : 
          
  //         setMapCenter({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         })
  //         }

  //         // { latitudeOut && longitudeOut ? setMarkerPosition({            
  //         //   lat: latitudeOut,
  //         //   lng: longitudeOut
  //         // })
  //         // : 
  //         // setMarkerPosition({
  //         //   lat: position.coords.latitude,
  //         //   lng: position.coords.longitude,
  //         // }) }

  //       },
  //       () => {
  //         console.log("Geolocalização falhou, usando posição default");
  //       }
  //     );
  //   } else {
  //     console.log("Geolocalização não suportada pelo navegador.");
  //   }
  // }, []);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((event) => {
      if(localChamadaMapa!=="FEED") {
        setMarkerPosition({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        })
        console.log("Map clicked at:", { lat: event.latLng.lat(), lng: event.latLng.lng() });
        const local = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        }
        onSelectLocalMap(local)

        // Ao clicar no mapa fora de um marcador, feche o InfoWindow do pet
        setActiveInfoWindow(null);
        setInfoWindowContent(null);
        setInfoWindowPosition(null);
      }
  }, [localChamadaMapa, onSelectLocalMap])

    const handlePetMarkerClick = useCallback((pet) => {
      // Abre o InfoWindow para este pet
      setActiveInfoWindow(pet.POS_ID);
      setInfoWindowContent(pet);
      setInfoWindowPosition({ lat: pet.PET_LOCAL.lat, lng: pet.PET_LOCAL.lng });
    }, []);

    // Handler para fechar o InfoWindow
    const handleInfoWindowClose = useCallback(() => {
      setActiveInfoWindow(null);
      setInfoWindowContent(null);
      setInfoWindowPosition(null);
    }, []);

    const handleShowPublicationClick = useCallback(() => {
      if (onShowPublication && infoWindowContent) {
        onShowPublication(infoWindowContent); // Passa o objeto pet completo para o pai
        // Opcional: Se você quiser fechar o InfoWindow automaticamente ao clicar em "Exibir Publicação"
        // handleInfoWindowClose();
      }
    }, [onShowPublication, infoWindowContent]);

  if (loadError) return <div>Error LOADING MAPS</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const radiusInMeters = radius ? radius * 1000 : 0;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={center ? 12 : 15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      {markerPosition && <Marker position={markerPosition} />}

      {center && radiusInMeters > 0 && (
        <Circle
          center={center}
          radius={radiusInMeters}
          options={{
            strokeColor: 'none',
            strokeOpacity: 0, // opaci borda
            strokeWeight: 0,
            fillColor: 'green', // cor dentro
            fillOpacity: 0.15,
          }}
        />
      )}

      {Array.isArray(pets) && pets.map((pet) => (
        <Marker
          key={pet.POS_ID}
          position={{ lat: pet.PET_LOCAL.lat, lng: pet.PET_LOCAL.lng }}
          onClick={() => handlePetMarkerClick(pet)}
        />
      ))}


      {activeInfoWindow && infoWindowContent && infoWindowPosition && (
        <InfoWindow
          position={infoWindowPosition}
          onCloseClick={handleInfoWindowClose}
        >
          {/* CONTEÚDO SIMPLES DO INFOWINDOW */}
          <div>
            <h3>{infoWindowContent.PES_NOME || 'Nome do Pet Indisponível'}</h3>
            <p>Tipo: {infoWindowContent.PET_TIPO || 'Indefinido'}</p>
            <p>Status: {infoWindowContent.POS_TIPO || 'Indefinido'}</p>
            {infoWindowContent.PET_DESCRICAO && (
              <p>Descrição: {infoWindowContent.PET_DESCRICAO}</p>
            )}
            {/* Você pode adicionar mais informações aqui, como PET_DATA, etc. */}
            {infoWindowContent.PET_LOCAL && infoWindowContent.PET_LOCAL.enderecoTexto && (
              <p>{infoWindowContent.PET_LOCAL.enderecoTexto}</p>
            )}
            <p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${infoWindowPosition.lat},${infoWindowPosition.lng}`} target="_blank" rel="noopener noreferrer">
                Ver no Google Maps
              </a>
            </p>
            <p style={{ marginTop: '10px' }}>
              <a href="#" onClick={handleShowPublicationClick} style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer' }}>
                Exibir Publicação
              </a>
            </p>
          </div>
        </InfoWindow>
      )}

      

    </GoogleMap>
  );
}

export default MapGoogleComponent;
