import HeaderLog from "../components/HeaderLog"
import listagem from "./../assets/imgs/listagem.png"
import lupa_pesquisa from "./../assets/imgs/lupa_pesquisa.png"

import styles from "./styles/research.module.css"


function PageResearch(){
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
    
    return (
    <div className={styles.main}>

        <HeaderLog/>
            <div className={styles.search_container}>
                <div className={styles.search_box}>
                    <img src={listagem} alt="Ícone de listagem" className={styles.icon_left} />
                        <input type="text" className={styles.search_input} placeholder="Pesquise por Bairro, Espécie, Data..."/>
                    <img src={lupa_pesquisa} alt="Ícone de lupa de pesquisa" className={styles.lupa} />
                </div>
            </div> {/* DEP. GOOGLE MAPS */}
    </div>
    )
}

export default PageResearch