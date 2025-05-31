import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import HeaderLog from "../components/HeaderLog"
import listagem from "./../assets/imgs/listagem.png"
import lupa_pesquisa from "./../assets/imgs/lupa_pesquisa.png"
import validateToken from "../assets/utils/validateToken"
import { getPublicacoesPorTexto, getPetsPorArea } from '../assets/services/api/posts.js'
import { MdArrowRightAlt } from "react-icons/md";
import {geocodeAddress} from "../assets/services/googleMapsAPI.js"
import MapGoogleComponent from '../components/MapGoogleComponent'
import Buttonposts from "../components/button_posts";

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

    const [selectedPublication, setSelectedPublication] = useState(null);

    const handleShowPublication = useCallback((petData) => {
      setSelectedPublication(petData);
    }, []);

    // fechar a visualização da publicação completa (útil se 'Buttonposts' for exibido como um overlay ou em uma nova seção)
    const handleClosePublication = useCallback(() => {
      setSelectedPublication(null);
    }, []);

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
        const data = await getPublicacoesPorTexto(searchText);
        console.log(data.result)
        setSuggestions(data.result.slice(0, 3)); // Limita a 3 sugestões
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

      // 2. Buscar Pets por Proximidade no seu Backend
      const pets = await getPetsPorArea(lat, lng,);

      setMapData({ center: centerCoords, radius: pets.radius, pets: pets });

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

  function primeiraLetraMaiuscula(string) {
    if (!string || string.length === 0) {
      return string; // Retorna a string vazia ou null
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

    return (
      <div className={styles.main}>
          <HeaderLog/>


              {selectedPublication ? ( 
                <div className={styles.publicationDetailContainer}> 

                <Buttonposts 
                    key={selectedPublication.POS_ID}
                    usuario={selectedPublication.PES_NOME}                        
                    imagemPet={selectedPublication.PET_FOTO}
                    caracteristicas={selectedPublication.PET_DESCRICAO}
                    dataSumico={selectedPublication.PET_DATA}
                    onMaps={true}
                    textoPrimeiroCategoria={selectedPublication.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                    //disparaUmaNotificacao={() => { umaFuncao(post.POS_ID)}}
                />
                  
                  <button onClick={handleClosePublication} className={styles.backToMapButton}>
                    &larr; Voltar ao Mapa
                  </button>
                </div>
              ) : mapData ? (
                <div className={styles.map_view}>
                  <button onClick={handleBackToSearch} className={styles.backButton}>
                    &larr; Voltar para a Busca
                  </button>
                  
                  {mapError && <p className={styles.errorMessage}>{mapError}</p>}
                  {loadingMap && <p className={styles.loadingMessage}>Carregando mapa e pets...</p>}
                  <div className={styles.map_component}>
                    <MapGoogleComponent
                      localChamadaMapa="FEED"
                      center={mapData.center}
                      radius={mapData.radius}
                      pets={mapData.pets.consulta}
                      onShowPublication={handleShowPublication}
                    />
                    </div>
                </div>
              ) : (
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
                      
                      <ul className={styles.suggestions_list}>

                        {suggestions.map(pub => (
                          <div key={pub.POS_ID} className={styles.suggestion_item}>
                            <div className={styles.suggestion_itemFoto}>
                              <strong>
                                <img src={`data:image/jpeg;base64,${pub.USU_FOTO}`} alt="" className={styles.iconPhoto} />
                              </strong>
                            </div>
                            <div className={styles.suggestion_itemInfo}>
                              <div>
                                <strong> {pub.PES_NOME
                    ? pub.PES_NOME.charAt(0).toUpperCase() + pub.PES_NOME.slice(1).toLowerCase()
                    : "Foto user"} </strong>
                              </div>
                              <div>
                                {primeiraLetraMaiuscula(pub.PET_TIPO)} - {pub.POS_TIPO} na região {pub.PET_LOCAL_BAIRRO}. Perto da {pub.PET_LOCAL_RUA}                                                                
                              </div>
                            </div>
                          </div>
                        ))}

                        <p className={styles.suggestions__linkMap} onClick={handleGoToMap}>
                          Ver mais no mapa 
                          
                          <MdArrowRightAlt className={styles.suggestions__linkIcon} />
                          
                        </p>
                        
                      </ul>
                    </div>
                  )}
                </div>
              )}              
      </div>
    )
}

export default PageResearch