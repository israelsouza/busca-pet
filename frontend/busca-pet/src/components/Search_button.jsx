import styles from "./styles/button_location.module.css"

function Search_button({image_excluir, image_location, image, text_search}){
    return   <button className={styles.search_location}>

                   <div className={styles.group_icons}>

                        <img src={image_location} alt="Ícone de localização" height="70px" />
                        <img src={image} alt="Ícone de lupa de pesquisa" width="80px"/>

                   </div>
                    {text_search}
                    <img src={image_excluir} alt="Ícone de excluir do histórico" width="50px" />

            </button>
}

export default Search_button