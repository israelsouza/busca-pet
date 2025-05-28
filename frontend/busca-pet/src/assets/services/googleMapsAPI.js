// Certifique-se de que a API do Google Maps esteja carregada globalmente.
// O @react-google-maps/api LoadScript se encarrega disso.
// Esta função só deve ser chamada DEPOIS que o LoadScript garantir que window.google.maps existe.

export async function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      return reject(new Error("Google Maps Geocoder não está carregado."));
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          // Pode incluir mais detalhes se precisar, como address_components
          fullAddress: results[0].formatted_address
        });
      } else {
        reject(new Error(`Geocoding falhou: ${status}`));
      }
    });
  });
}