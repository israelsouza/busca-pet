import styles from "./styles/research.module.css"
import HeaderLog from "../components/HeaderLog"
import Search_button from "../components/Search_button"

import listagem from "./../assets/imgs/listagem.png"
import lupa_pesquisa from "./../assets/imgs/lupa_pesquisa.png"
import icon_cachorro from "./../assets/imgs/icon_cachorro.png"
import icon_location from "./../assets/imgs/icon_location.png"
import icon_excluir from "./../assets/imgs/icon_excluir.png"

function PageResearch(){
    return (
    <div className={styles.main}>

        <HeaderLog/>
            
        {/* Configurações para o input de pesquisa */}

            <div className={styles.search_container}>
                <button className={`${styles.search_button} ${styles.btn_search}`}>
                <img src={listagem} alt="Ícone de listagem" className={styles.list}/>
                <input type="text" className={styles.search_input} placeholder="Pesquise por Bairro, Espécie, Data, Usar localização atual..."/>
        
                <img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" className={styles.lupa} />
                </button>
            </div>

            <div className={styles.search_history}>

                <Search_button image_location={icon_location} image={lupa_pesquisa} image_excluir={icon_excluir} text_search="Bairro das Cobras"  />
            
            </div>
            <div className={styles.search_history}>

                <Search_button image={lupa_pesquisa} image_excluir={icon_excluir} image_location={icon_cachorro} text_search="Cachorro Laranja"/>
        
            </div>

    </div>
    )
}

export default PageResearch