
import { useRef, useState, useEffect } from "react";
import validateToken from '../assets/utils/validateToken.js'
import styles from "./styles/PetPerdido.module.css";
import {
  verificarCampoVazioPet,
  verificarTamanhoMaximo
} from "../assets/utils/formValidacoes";
import { validarDataLimite } from "../assets/utils/regex.js";
import criarFormData from "../assets/utils/criarFormData.js";

import HeaderLog from "./../components/HeaderLog";
import { useNavigate } from "react-router-dom";

import enviarDados from "../assets/utils/enviarDados";

function PetPerdido() {
    const navigate = useNavigate();

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


    const nomeRef = useRef(null);
    const rgaRef = useRef(null);
    const tipoPetRef = useRef(null);
    const descricaoRef = useRef(null);
    const dataRef = useRef(null);
    const imagemRef = useRef(null);
    const dataMinimaPermitida = '2000-01-01'


    const [nomeImagem, setNomeImagem] = useState("");
    const [erroNome, setErroNome] = useState("");
    const [erroRga, setErroRga] = useState("");
    const [erroTipoPet, setErroTipoPet] = useState("");
    const [erroDescricao, setErroDescricao] = useState("");
    const [erroData, setErroData] = useState("");
    const [erroImagem, setErroImagem] = useState("");
    const [arquivoImagem, setArquivoImagem] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [retornoBackend, setRetornoBackend] = useState("");


    function handleImagemSelecionada(e) {
        const arquivo = e.target.files[0];
        if (arquivo) {
            if (arquivo.size > 10 * 1024 * 1024) {
                setErroImagem("O arquivo deve ter no máximo 2MB.");
                return;
            }
            setErroImagem("");
            setNomeImagem(arquivo.name);
            setArquivoImagem(arquivo); 
        } else {
            setNomeImagem("");
        }
    }



    function handleNomeAlterado(e) {
        const valor = e.target.value;
        if (/^[a-zA-ZÀ-ÿ\s]*$/.test(valor)) {
            nomeRef.current.value = valor;
            setErroNome("");
        } else {
            setErroNome("O nome deve conter apenas letras.");
        }
    }


    async function validarFormulario(e) {
        e.preventDefault();

    
        const nome = nomeRef.current;
        const rga = rgaRef.current;
        const tipoPet = tipoPetRef.current;
        const descricao = descricaoRef.current;
        const data = dataRef.current;
        const imagem = imagemRef.current;

        if (validarDataLimite({
            campo: data,
            setErro: setErroData,
            mensagemObrigatoria: "Por favor, insira a data em que viu o pet pela última vez.",
            mensagemErroMinima: `A data não pode ser anterior a ${dataMinimaPermitida}.`,
            mensagemErroLimite: "A data não pode ser futura.",
            dataMinima: dataMinimaPermitida,
        })) return true;

    
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
                mensagem: "Por favor, selecione o tipo do seu pet.",
            },
            {
                ref: imagem,
                setErro: setErroImagem,
                mensagem: "Por favor, insira a imagem do seu pet.",
            },
        ];

    
        if (verificarCampoVazioPet(camposObrigatorios)) return true;

    
        if (tipoPet.value === "Selecione o tipo do pet") {
            setErroTipoPet("Por favor, selecione o tipo do seu pet.");
            return true;
        } else {
            setErroTipoPet("");
        }

    
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
                mensagem: "O RGA pode conter no máximo 15 caracteres.",
            },
            {
                ref: descricao,
                limite: 150,
                setErro: setErroDescricao,
                mensagem:
                    "Você atingiu o limite máximo de 150 caracteres. Por favor, digite uma descrição menor",
            },
        ];

        if (verificarTamanhoMaximo(camposTamanhoMaximo)) return true;

    
        
       
        
        console.log("Formulário válido!");

        

        const dados = {
            nome: nomeRef.current.value,
            rga: rgaRef.current.value,
            tipoPet: tipoPetRef.current.value,
            descricao: descricaoRef.current.value,
            data: dataRef.current.value,
            imagem: imagemRef.current.value
        }

         if (!arquivoImagem) {
            setErroImagem("Por favor, selecione uma imagem válida.");
            return;
        }

        const formData = criarFormData(dados, arquivoImagem);
        
    
        
        try {
            const resultado = await enviarDados(formData, "criar-post/pet-perdido");
            console.log(resultado);

            if (resultado && resultado.message) {
                setRetornoBackend(resultado.message);
                setTimeout(() => navigate("/posts/all"), 1000); 
            } else {
                setRetornoBackend("Erro inesperado ao cadastrar o pet.");
        }} catch (error) {
            console.error("Erro ao enviar os dados:", error);
            setRetornoBackend("Erro ao cadastrar o pet. Tente novamente mais tarde.");
        }

    }

    return (
        <div className={styles.pet_perdido}>
            <HeaderLog /> { /* DEP. GOOGLE MAPS */ }

            <div className={styles.pet_perdido__body}>
                <div className={styles.pet_perdido__box}>
                    <form>
                        { /* DEP. GOOGLE MAPS */ }
                        <div className={styles.pet_perdido__input50}>
                            <div>
                                <label htmlFor="nome">Nome do Pet</label>
                                <input
                                    id="nome"
                                    ref={nomeRef}
                                    className={styles.pet_perdido__input}
                                    type="text"
                                    onChange={handleNomeAlterado}
                                />
                                {erroNome && (
                                    <span id="nome-error" className={styles.error}>
                                        {erroNome}
                                    </span>
                                )}
                            </div>

                            { /* DEP. GOOGLE MAPS */ }
                            <div>
                                <label htmlFor="rga">RGA do Pet (opcional)</label>
                                <input
                                    id="rga"
                                    ref={rgaRef}
                                    className={styles.pet_perdido__input}
                                    type="text"
                                />
                                {erroRga && (
                                    <span id="rga-error" className={styles.error}>
                                        {erroRga}
                                    </span>
                                )}
                            </div>
                        </div>

                        { /* DEP. GOOGLE MAPS */ }
                        <div className={styles.pet_perdido__input100}>
                            <label htmlFor="tipoPet">Selecione o tipo do seu Pet</label>
                            <select
                                defaultValue="Selecione o tipo do pet"
                                ref={tipoPetRef}
                                className={styles.pet_perdido__input}
                                id="tipoPet"
                            >
                                <option disabled value="Selecione o tipo do pet">
                                    Selecione o tipo do pet
                                </option>
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

                        { /* DEP. GOOGLE MAPS */ }
                        <div className={styles.pet_perdido__input100}>
                            <label htmlFor="descricao">Breve descrição do Pet</label>
                            <textarea
                                id="descricao"
                                ref={descricaoRef}
                                className={`${styles.pet_perdido__input} ${styles.pet_perdido__textarea}`}
                            ></textarea>
                            {erroDescricao && (
                                <span id="descricao-error" className={styles.error}>
                                    {erroDescricao}
                                </span>
                            )}
                        </div>

                        { /* DEP. GOOGLE MAPS */ }
                        <div className={styles.pet_perdido__input100}>
                            <label htmlFor="data">Data</label>
                            <input
                                id="data"
                                ref={dataRef}
                                className={styles.pet_perdido__input}
                                type="date"
                            />
                            {erroData && (
                                <span id="data-error" className={styles.error}>
                                    {erroData}
                                </span>
                            )}
                        </div>

                        { /* DEP. GOOGLE MAPS */ }
                        <p className={styles.pet_perdido__imagem_texto}>
                            Selecione a imagem do Pet perdido
                        </p>
                        <div className={styles.pet_perdido__imagem}>
                            <label htmlFor="imagem">Selecionar arquivo</label>
                            <input
                                id="imagem"
                                ref={imagemRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImagemSelecionada}
                            />
                        </div>
                        {nomeImagem && (
                            <p className={styles.pet_perdido__imagem_nome}>
                                Arquivo selecionado: {nomeImagem}
                            </p>
                        )}
                        {erroImagem && (
                            <span id="imagem-error" className={styles.error}>
                                {erroImagem}
                            </span>
                        )}
                    </form> {/* DEP. GOOGLE MAPS */}
          {mensagem && (
            <span id="imagem-error" className={styles.error}>
              {mensagem}
            </span>
          )}

          {retornoBackend && (
           <span
                className={`${styles.retornoBackend} ${
                    retornoBackend.includes("sucesso") ? styles.sucesso : styles.erro
                }`}
            >
                {retornoBackend}
            </span>
            )}
                    <div className={styles.botao_center}>
                        <button
                            className={`${styles.botao} ${styles.perdeu}`}
                            onClick={validarFormulario}
                        >
                            Cadastrar Pet Perdido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetPerdido;