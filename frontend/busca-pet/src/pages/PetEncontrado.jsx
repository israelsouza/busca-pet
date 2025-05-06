// Importa os hooks do React e os estilos do componente
import { useRef, useState, useEffect } from "react";
import styles from "./styles/PetPerdido.module.css";
import {
  verificarCampoVazioPet,
  verificarTamanhoMaximo,
} from "../assets/utils/formValidacoes.js";

import EmailFromToken from "../assets/utils/getEmailFromToken.js";

// Importa o cabeçalho e funções de validação
import HeaderLog from "../components/HeaderLog.jsx";
import { useNavigate } from "react-router-dom";

import enviarDados from "../assets/utils/enviarDados.js";

function PetEncontrado() {
  const navigate = useNavigate();

  // useEffect(() => {
  //       const checkAuthentication = async () => {
  //         try {
  //           await validateToken();
  //         } catch (error) {
  //           console.error("Erro capturado:", error.message);
  //           alert(error.message); // Exibe a mensagem de erro para o usuário
  //           localStorage.removeItem("authToken"); // Remove o token inválido
  //           navigate("/form/login"); // Redireciona para o login
  //         }
  //       };
  //       checkAuthentication();
  // }, [navigate]);

  const tipoPetRef = useRef(null);
  const descricaoRef = useRef(null);
  const dataRef = useRef(null);
  const imagemRef = useRef(null);

  const [nomeImagem, setNomeImagem] = useState("");
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
        setErroImagem("O arquivo deve ter no máximo 10MB.");
        return;
      }
      setErroImagem("");
      setNomeImagem(arquivo.name);
      setArquivoImagem(arquivo);
    } else {
      setNomeImagem("");
    }
  }

  async function validarFormulario(e) {
    e.preventDefault();

    const tipoPet = tipoPetRef.current;
    const descricao = descricaoRef.current;
    const data = dataRef.current;
    const imagem = imagemRef.current;

    const camposObrigatorios = [
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
        ref: data,
        setErro: setErroData,
        mensagem: "Por favor, insira a data em que perdeu o seu pet.",
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
        ref: descricao,
        limite: 150,
        setErro: setErroDescricao,
        mensagem:
          "Você atingiu o limite máximo de 150 caracteres. Por favor, digite uma descrição menor",
      },
    ];

    if (verificarTamanhoMaximo(camposTamanhoMaximo)) return true;

    if (!arquivoImagem) {
        setErroImagem("Por favor, selecione uma imagem válida.");
        return;
      }

    console.log("Formulário válido!");

    const email = await EmailFromToken();

    const dados = {
      tipoPet: tipoPetRef.current.value,
      descricao: descricaoRef.current.value,
      data: dataRef.current.value,
      imagem: imagemRef.current.value,
      email: email
    };

    function criarFormData(dados, arquivoImagem) {
        const formData = new FormData();
      
        formData.append("tipoPet", dados.tipoPet);
        formData.append("descricao", dados.descricao);
        formData.append("data", dados.data);
        formData.append("email", dados.email);
      
        // Adiciona a imagem como arquivo
        if (arquivoImagem) {
          formData.append("imagem", arquivoImagem); // Adiciona o arquivo diretamente
        }
      
        return formData;
    }

    const formData = criarFormData(dados, arquivoImagem);

    console.log("Dados do formulário: ", formData);
    console.log("Arquivo da imagem: ", formData.get("imagem"));

 
    
    try {
      const resultado = await enviarDados(formData, "criar-post/pet-encontrado");
      console.log(resultado);

    //   if (resultado && resultado.message) {
    //     setRetornoBackend(resultado.message);
    //     setTimeout(() => navigate("/posts/all"), 1000);
    //   } else {
    //     setRetornoBackend("Erro inesperado ao cadastrar o pet.");
    //   }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setRetornoBackend("Erro ao cadastrar o pet. Tente novamente mais tarde.");
    }
  }

  return (
    <div className={styles.pet_perdido}>
      <HeaderLog />
      <div className={styles.pet_perdido__body}>
        <div className={styles.pet_perdido__box}>
          <form>
            

            {/* Campo Tipo do Pet */}
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

            {/* Campo Descrição */}
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

            {/* Campo Data */}
            <div className={styles.pet_perdido__input100}>
              <label htmlFor="data">Em qual dia você viu esse pet?</label>
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

            {/* Campo Imagem */}
            <p className={styles.pet_perdido__imagem_texto}>
              Selecione a imagem do Pet que viu. (Máx: 10MB)
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
                retornoBackend.includes("sucesso")
                  ? styles.sucesso
                  : styles.erro
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
              Cadastrar Pet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetEncontrado;
