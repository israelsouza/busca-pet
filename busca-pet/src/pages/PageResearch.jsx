import "./../assets/CSS/research.css"
import listagem from "./../assets/imgs/listagem.png"
import lupa_pesquisa from "./../assets/imgs/lupa_pesquisa.png"
import icon_cachorro from "./../assets/imgs/icon_cachorro.png"
import HeaderLog from "../components/HeaderLog"
import icon_location from "./../assets/imgs/icon_location.png"
import icon_excluir from "./../assets/imgs/icon_excluir.png"
import Search_button from "../components/Search_button"

function PageResearch(){
    return <div className="main">

<HeaderLog/>
            
        {/* Configurações para o input de pesquisa */}

            <div className="search_container">
                <button className="search_button">
                <img src={listagem} alt="Ícone de listagem" className="list"/>
                <input type="text" className=" search_input" placeholder="Pesquise por Bairro, Espécie, Data, Usar localização atual..."/>
        
                <img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" className="lupa" />
                </button>
            </div>

            <div className="search_history">

          <Search_button image_location={icon_location} image={lupa_pesquisa} image_excluir={icon_excluir} text_search="Bairro das Cobras"  />
            
            </div>
            <div className="search_history">

        <Search_button image={lupa_pesquisa} image_excluir={icon_excluir} image_location={icon_cachorro} text_search="Cachorro Laranja"/>
        

            </div>

        </div>
}

export default PageResearch