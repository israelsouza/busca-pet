import { useRef, useState } from "react";
import styles from "./styles/PetPerdido.module.css";
import HeaderLog from "./../components/HeaderLog";
import {
    verificarCampoVazio,
    verificarTamanhoMaximo,
    verificarTamanhoFixo,
    verificarTamanhoMinimo,
    verificarSeTemLetras,
    verificarSeTemNumeros,
    verificarSeEEmail,
  } from "../assets/utils/formValidacoes";

    // fazer as condições de erro
    // montar o objeto
    // enviar requisição ao backend


        // let nome = document.getElementById(nome);
        // let rga = document.getElementById(rga);
        // let descricao = document.getElementById(descricao);
        // let data = document.getElementById(data);
    
        // if (nome == "" || descricao == "" || data == "") {
        //     alert("Preencha os campos obrigatórios");
        //     return false;
        // }
    
        // const informacaoPetPerdido = [nome, rga, descricao, data]


function PetPerdido() {

        const nomeRef = useRef(null);
        const rgaRef = useRef(null);
        const tipoPetRef = useRef(null);
        const descricaoRef = useRef(null);
        const dataRef = useRef(null);
        const imagemRef = useRef(null);

        
        const [erroNome, setErroNome] = useState("");
        const [erroRga, setErroRga] = useState("");
        const [erroTipoPet, setErroTipoPet] = useState("");
        const [erroDescricao, setErroDescricao] = useState("");
        const [erroData, setErroData] = useState("");
        const [erroImagem, setErroImagem] = useState("");

    function validarDados(e) {
        e.preventDefault();

        const nome = nomeRef.current;
        const rga = rgaRef.current;
        const tipoPet = tipoPetRef.current;
        const descricao = descricaoRef.current;
        const data = dataRef.current;
        const imagem = imagemRef.current;


        const camposObrigatorios = [
            {
                ref: nome,
                setErro: setErroNome,
                mensagem: "Por favor, insira o nome do seu pet.",
            },
            {
                ref: descricao,
                setErro: setErroDescricao,
                mensagem: "Por favor, insira a descrição do seu pet.",
            },
            {
                ref: tipoPet,
                setErro: setErroTipoPet,
                mensagem: "Por favor, insira o tipo do seu pet.",
            },
            {
                ref: data,
                setErro: setErroData,
                mensagem: "Por favor, insira a data em que perdeu o seu pet.",
            },
            {
                ref: imagem,
                setErro: setErroImagem,
                mensagem: "Por favor, insira a imagem do seu pet.",
            },
        ]

        if (verificarCampoVazio(camposObrigatorios)) return true;

        const camposTamanhoMaximo = [
            {
                ref: nome,
                limite: 70,
                setErro: setErroNome,
                mensagem: 
                    "O nome deve ter no máximo 70 caracteres. Por favor, insira um nome menor",
            },
            {
                ref: rga,
                limite: 15,
                setErro: setErroRga,
                mensagem: 
                    "O RGA pode conter no máximo 15 caracteres.",
            },
            {
                ref: descricao,
                limite: 150,
                setErro: setErroDescricao,
                mensagem: 
                    "Você atingiu o limite máximo de 150 caracteres. Por favor, digite uma descrição menor",
            },
        ]

        if (verificarTamanhoMaximo(camposTamanhoMaximo)) return true;
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
                            <input id="nome" ref={nomeRef} className={styles.pet_perdido__input} type="text" />
                        
                            {erroNome && (
                                <span id="nome-error" className={styles.error}>
                                    {erroNome}
                                </span>
                            )}
                        </div>

                        <div>
                            <label htmlFor="">RGA do Pet (opcional)</label>
                            <input id="rga" ref={rgaRef} className={styles.pet_perdido__input} type="text" />
                        
                            {erroRga && (
                                <span id="rga-error" className={styles.error}>
                                    {erroRga}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Selecione o tipo do seu Pet</label>
                        <select defaultValue="Selecione o tipo do pet" ref={tipoPetRef} className={styles.pet_perdido__input} name="" id="" >
                            <option disabled value="Selecione o tipo do pet">Selecione o tipo do pet</option>
                            <option value="gato">Gato</option>
                            <option value="cachorro">Cachorro</option>
                            <option value="coelho">Coelho</option>
                            <option value="ave">Ave</option>
                            <option value="outros">Outros</option>
                        </select>

                        {erroTipoPet && (
                            <span id="tipoPet-error" className={styles.error}>
                                {erroTipoPet}
                            </span>
                        )}
                    </div>

                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Breve descrição do Pet</label>
                        <textarea id="descricao" ref={descricaoRef} className={`${styles.pet_perdido__input} ${styles.pet_perdido__textarea}`} ></textarea>
                    
                        {erroDescricao && (
                            <span id="descricao-error" className={styles.error}>
                                {erroDescricao}
                            </span>
                        )}
                    </div>

                    Local onde o Pet foi encontrado - API Google Maps
                    
                    <div className={styles.pet_perdido__input100}>
                        <label htmlFor="">Data</label>
                        <input id="data" ref={dataRef} className={styles.pet_perdido__input} type="date" />
                    
                        {erroData && (
                            <span id="data-error" className={styles.error}>
                                {erroData}
                            </span>
                        )}    
                    </div>

                    Acrescentar uma forma do input mudar quando um arquivo for selecionado

                    <p className={styles.pet_perdido__imagem_texto}>Selecione a imagem do Pet perdido</p>
                    <div className={styles.pet_perdido__imagem}>
                        <label htmlFor="imagem">Selecionar arquivo</label>
                        <input id="imagem" ref={imagemRef} type="file"/>
                    </div>
                    {erroImagem && (
                        <span id="imagem-error" className={styles.error}>
                            {erroImagem}
                        </span>
                    )}
                </form>
                
                <div className={styles.botao_center}>
                <button className={`${styles.botao} ${styles.perdeu}`} onClick={validarDados}>Cadastrar Pet Perdido</button>
                </div>
            </div>
          </div>
        </div>
      );
    };

export default PetPerdido