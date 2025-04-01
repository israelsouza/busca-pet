import { useRef, useState } from "react";
import styles from "./styles/PetPerdido.module.css";
import HeaderLog from "./../components/HeaderLog";


function PetPerdido() {

    // declarar useState
    // fazer as condições de erro
    // montar o objeto
    // enviar requisição ao backend
    

    // function validarDados() {}

        // let nome = document.getElementById(nome);
        // let rga = document.getElementById(rga);
        // let descricao = document.getElementById(descricao);
        // let data = document.getElementById(data);
    
        // if (nome == "" || descricao == "" || data == "") {
        //     alert("Preencha os campos obrigatórios");
        //     return false;
        // }
    
        // const informacaoPetPerdido = [nome, rga, descricao, data]

        const nomeRef = useRef(null);
        const rgaRef = useRef(null);
        const tipoPetRef = useRef(null);
        const descricaoRef = useRef(null);
        const dataRef = useRef(null);
        const imagemRef = useRef(null);

    return (
        <div className={styles.pet_perdido}>
    
          <HeaderLog />
    
          <div className={styles.pet_perdido__body}>
            <div className={styles.pet_perdido__box}>
                <form>
                    <div className={styles.pet_perdido__input50}>
                        <div>
                            <label htmlFor="">Nome do Pet</label>
                            <input id="nome" refProp={nomeRef} className={styles.pet_perdido__input} type="text" />
                        </div>

                        <div>
                            <label htmlFor="">RGA do Pet (opcional)</label>
                            <input id="rga" refProp={rgaRef} className={styles.pet_perdido__input} type="text" />
                        </div>
                    </div>

                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Selecione o tipo do seu Pet</label>
                        <select refProp={tipoPetRef} className={styles.pet_perdido__input} name="" id="" >
                            <option value="" disabled>Selecione o tipo do pet</option>
                            <option value="gato">Gato</option>
                            <option value="cachorro">Cachorro</option>
                            <option value="coelho">Coelho</option>
                            <option value="ave">Ave</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>

                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Breve descrição do Pet</label>
                        <textarea id="descricao" refProp={descricaoRef} className={`${styles.pet_perdido__input} ${styles.pet_perdido__textarea}`} ></textarea>
                    </div>

                    Local onde o Pet foi encontrado - API Google Maps
                    
                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Data</label>
                        <input id="data" refProp={dataRef} className={styles.pet_perdido__input} type="date" />
                    </div>

                    Acrescentar uma forma do input mudar quando um arquivo for selecionado

                    <p className={styles.pet_perdido__imagem_texto}>Selecione a imagem do Pet perdido</p>
                    <div className={styles.pet_perdido__imagem}>
                        <label htmlFor="imagem">Selecionar arquivo</label>
                        <input id="imagem" refProp={imagemRef} type="file"/>
                    </div>
                </form>

                <button className={`${styles.botao} ${styles.perdeu}`} onClick={validarDados}>Cadastrar Pet Perdido</button>
            </div>
          </div>
        </div>
      );
    };

export default PetPerdido