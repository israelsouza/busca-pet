import styles from "./styles/PetPerdido.module.css";
import HeaderLog from "./../components/HeaderLog";
import "./../assets/CSS/research.css";

function PetPerdido() {
    
    function validarDados() {
        let nome = document.getElementById(nome);
        let rga = document.getElementById(rga);
        let descricao = document.getElementById(descricao);
        let data = document.getElementById(data);
    
        if (nome == "" || descricao == "" || data == "") {
            alert("Preencha os campos obrigatórios");
            return false;
        }
    
        const informacaoPetPerdido = [nome, rga, descricao, data]
    }

    return (
        <div className={styles.pet_perdido}>
    
          <HeaderLog />
    
          <div className={styles.pet_perdido__body}>
            <div className={styles.pet_perdido__box}>
                <form>
                    <div className={styles.pet_perdido__input50}>
                        <div>
                            <label htmlFor="">Nome do Pet</label>
                            <input id="nome" className={styles.pet_perdido__input} type="text" />
                        </div>

                        <div>
                            <label htmlFor="">RGA do Pet (opcional)</label>
                            <input id="rga" className={styles.pet_perdido__input} type="text" />
                        </div>
                    </div>

                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Selecione o tipo do seu Pet</label>
                        <select className={styles.pet_perdido__input} name="" id="" >
                            <option value="">Gato</option>
                        </select>
                    </div>

                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Breve descrição do Pet</label>
                        <textarea id="descricao" className={`${styles.pet_perdido__input} ${styles.pet_perdido__textarea}`} ></textarea>
                    </div>

                    Local onde o Pet foi encontrado - API Google Maps
                    
                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Data</label>
                        <input id="data" className={styles.pet_perdido__input} type="date" />
                    </div>

                    Acrescentar uma forma do input mudar quando um arquivo for selecionado

                    <p className={styles.pet_perdido__imagem_texto}>Selecione a imagem do Pet perdido</p>
                    <div className={styles.pet_perdido__imagem}>
                        <label htmlFor="imagem">Selecionar arquivo</label>
                        <input id="imagem" type="file"/>
                    </div>
                </form>

                Botão ta descentralizado

                <button className={`${styles.botao} ${styles.perdeu}`} onClick={validarDados}>Cadastrar Pet Perdido</button>
            </div>
          </div>
        </div>
      );
    };

export default PetPerdido