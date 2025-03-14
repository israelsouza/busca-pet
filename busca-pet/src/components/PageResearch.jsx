import listagem from "./../imgs/listagem.png"
import lupa_pesquisa from "./../imgs/lupa_pesquisa.png"
import icon_cachorro from "./../imgs/icon_cachorro.png"
import icon_location from "./../imgs/icon_location.png"
import icon_excluir from "./../imgs/icon_excluir.png"
function PageResearch(){
    return <div className="main">
            
        {/* Configurações para o input de pesquisa */}

            <div className="search_container">
                <button className="search_button">
                <img src={listagem} alt="Ícone de listagem" className="list"/>
                <input type="text" className=" search_input" placeholder="Pesquise por Bairro, Espécie, Data, Usar localização atual..."/>
        
                <img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" className="lupa" />
                </button>
            </div>

            <div className="search_history">

            <button className="search_location">
                <img src={icon_location} alt="Ícone de localização" height="70px" />
                <img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" className="lupa" width="80px"/>
                Bairro das Cobras
                <img src={icon_excluir} alt="Ícone de excluir do histórico" width="50px" />
            </button>
            
            </div>

            <div className="search_history">
            <button className="search_dog">
                <img src={icon_cachorro} alt="Ícone de cachorro"/>
                <img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" className="lupa" width="80px" />
                Cachorro Laranja
                <img src={icon_excluir} alt="Ícone de excluir do histórico" width="50px"/>
            </button>


            </div>

        </div>
}

export default PageResearch