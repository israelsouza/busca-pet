import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import HeaderLog from "../components/HeaderLog"
import listagem from "./../assets/imgs/listagem.png"
import lupa_pesquisa from "./../assets/imgs/lupa_pesquisa.png"
import validateToken from "../assets/utils/validateToken"
import { buscarPublicacoesPorTexto } from '../assets/services/api/posts.js'

import styles from "./styles/research.module.css"


function PageResearch(){
  const navigate = useNavigate()
        useEffect(() => {
        const checkAuthentication = async () => {
            try {
              await validateToken();
            } catch (error) {
              console.error("Erro capturado:", error.message);
              alert(error.message); 
              localStorage.removeItem("authToken");
              navigate("/form/login");
            }
          };
          checkAuthentication();
    }, [navigate]);

    const [searchText, setSearchText] = useState("")
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [errorSuggestions, setErrorSuggestions] = useState(null);

    // Estados para o mapa (mantidos aqui conforme a lógica original)
    const [mapData, setMapData] = useState(null); // null = mostra busca, obj = mostra mapa
    const [loadingMap, setLoadingMap] = useState(false);
    const [mapError, setMapError] = useState(null);

    useEffect(() => {
    if (searchText.length <= 2) {
      setSuggestions([]);
      setErrorSuggestions(null);
      return;
    }

    setLoadingSuggestions(true);
    setErrorSuggestions(null);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await buscarPublicacoesPorTexto(searchText);
        setSuggestions(data.slice(0, 3)); // Limita a 3 sugestões
      } catch (err) {
        console.error("Erro ao buscar sugestões:", err);
        setErrorSuggestions("Erro ao carregar sugestões.");
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 2000)

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleGoToMap = useCallback(async () => {
    if (searchText.trim() === "") {
      alert('Por favor, digite um local para pesquisar no mapa.');
      return;
    }

    setLoadingMap(true);
    setMapError(null);
    try {
      const { lat, lng } = await geocodeAddress(searchText);
      const centerCoords = { lat, lng };
      const radius = 5;

      // 2. Buscar Pets por Proximidade no seu Backend
      const pets = await buscarPetsPorProximidade(lat, lng, radius);

      setMapData({ center: centerCoords, radius: radius, pets: pets });

    } catch (error) {
      console.error("Erro ao preparar o mapa:", error);
      setMapError("Não foi possível carregar o mapa para esta região. Tente novamente. Verifique se o termo de busca é um endereço válido.");
      setMapData(null); // Garante que o mapa não será exibido com erro
    } finally {
      setLoadingMap(false);
    }
  }, [searchText])

  const handleBackToSearch = () => {
    setMapData(null); 
  };

    return (
      <div className={styles.main}>
          <HeaderLog/>

              {mapData ? ( // Se mapData existe, mostra o mapa
                <div className={styles.map_view}>
                  <button onClick={handleBackToSearch} className={styles.backButton}>
                    &larr; Voltar para a Busca
                  </button>
                  {mapError && <p className={styles.errorMessage}>{mapError}</p>}
                  {loadingMap && <p className={styles.loadingMessage}>Carregando mapa e pets...</p>}
                  <PetMapComponent
                    center={mapData.center}
                    radius={mapData.radius}
                    pets={mapData.pets}
                  />
                </div>
              ) : ( // Senão, mostra a tela de pesquisa
                <div className={styles.search_container}>
                  <div className={styles.search_box}>
                    <img src={listagem} alt="Ícone de listagem" className={styles.icon_left} />
                    <input
                      type="text"
                      className={styles.search_input}
                      placeholder="Pesquise por Bairro, Espécie, Data..."
                      value={searchText} // O input deve ter um value controlado
                      onChange={(e) => setSearchText(e.target.value)} // Atualiza searchText
                    />
                    <img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" className={styles.lupa} />
                  </div>                  

                  {loadingSuggestions && <p className={styles.loadingMessage}>Carregando sugestões...</p>}
                  {errorSuggestions && <p className={styles.errorMessage}>{errorSuggestions}</p>}

                  {suggestions.length > 0 && (
                    <div className={styles.suggestions_box}>
                      <h3>Resultados de Publicações:</h3>
                      <ul className={styles.suggestions_list}>
                        {suggestions.map(pub => (
                          <li key={pub.POS_ID} className={styles.suggestion_item}>
                            <strong>{pub.PET_TIPO}:</strong> {pub.PET_NOME || 'Pet sem nome'} - {pub.PET_DESCRICAO} (Publicado em: {pub.POS_DATA})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}              
      </div>
    )
}

export default PageResearch