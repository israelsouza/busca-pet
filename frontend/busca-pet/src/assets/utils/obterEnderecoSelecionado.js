async function obterEnderecoSelecionado(infoMapa, API_KEY) {
  let enderecoTexto = "";
  let enderecoRua = "";
  let enderecoBairro = "";

  if (API_KEY) {
    try {
      const lat = infoMapa.lat;
      const lng = infoMapa.lng;

      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status === "OK" && geocodeData.results.length > 0) {
        const result = geocodeData.results[0];
        enderecoTexto = result.formatted_address;

        result.address_components.forEach((component) => {
          const types = component.types;
          const long_name = component.long_name;

          if (types.includes("route")) {
            enderecoRua = long_name;
          } else if (
            types.includes("sublocality") ||
            types.includes("sublocality_level_1")
          ) {
            // 'sublocality' ou 'sublocality_level_1' é o bairro
            enderecoBairro = long_name;
          }
        });
      } else {
        console.warn(
          "Geocodificação Reversa falhou na submissão:",
          geocodeData.status,
          geocodeData.error_message || ""
        );
        enderecoTexto = "Endereço não encontrado para o ponto selecionado.";
      }

      console.log(enderecoRua);
      console.log(enderecoBairro);

      return {
        lat: infoMapa.lat,
        lng: infoMapa.lng,
        rua: enderecoRua,
        bairro: enderecoBairro,
        enderecoTexto,
      };
    } catch (error) {
      return {
        success: false,
        message: "Endereço não encontrado para o ponto selecionado.",
      };
    }
  } else {
    console.warn(
      "Chave de API de Geocodificação não configurada. O endereço textual pode estar faltando."
    );
    return false;
  }
}

export default obterEnderecoSelecionado;
