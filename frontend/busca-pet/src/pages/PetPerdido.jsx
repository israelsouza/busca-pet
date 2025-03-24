import styles from "./styles/PetPerdido.module.css";
import HeaderLog from "./../components/HeaderLog";
import "./../assets/CSS/research.css";
// import { useRef } from "react";

function PetPerdido() {
    // function FileUpload() {
    //     const fileInputRef = useRef(null);
    //     const fileNameDisplayRef = useRef(null);
      
    //     const handleFileChange = () => {
    //       const fileInputNode = fileInputRef.current;
    //       const fileNameDisplayNode = fileNameDisplayRef.current;
      
    //       if (fileInputNode && fileInputNode.files.length > 0) {
    //         fileNameDisplayNode.textContent = fileInputNode.files[0].name;
    //       } else if (fileNameDisplayNode) {
    //         fileNameDisplayNode.textContent = 'Nenhum arquivo escolhido';
    //       }
    //     };
      
    //     const handleClickButton = () => {
    //       if (fileInputRef.current) {
    //         fileInputRef.current.click();
    //       }
    //     };
    
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
                        <input id="descricao" className={styles.pet_perdido__input} type="text" />
                    </div>

                    Local onde o Pet foi encontrado - API Google Maps
                    
                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Data</label>
                        <input id="data" className={styles.pet_perdido__input} type="date" />
                    </div>

                    Botão para enviar arquivo de imagem, mó rolê

                    {/* <div className={styles.pet_perdido__input100}>
                        <button className="file-upload-button" onClick={handleClickButton}>
                            Selecionar Arquivo
                        </button>
                        <input
                            type="file"
                            className="file-upload-input"
                            id="fileInput"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <span className="file-upload-text" id="fileName" ref={fileNameDisplayRef}>
                            Nenhum arquivo escolhido
                        </span>
                    </div> */}
                </form>

              <a className={`${styles.botao} ${styles.perdeu}`} onClick={validarDados}>Cadastrar Pet Perdido</a>
            </div>
          </div>
        </div>
      );
    };

export default PetPerdido