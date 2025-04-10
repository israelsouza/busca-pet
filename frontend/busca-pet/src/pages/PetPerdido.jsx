// Importa os hooks do React e os estilos do componente
import { useRef, useState } from "react";
import styles from "./styles/PetPerdido.module.css";

// Importa o cabeçalho
import HeaderLog from "./../components/HeaderLog";

function PetPerdido() {
    // Referências para os campos do formulário
    const nomeRef = useRef(null);
    const rgaRef = useRef(null);
    const tipoPetRef = useRef(null);
    const descricaoRef = useRef(null);
    const dataRef = useRef(null);
    const imagemRef = useRef(null);
    const cepRef = useRef(null);

    // Estados para armazenar mensagens de erro e informações do formulário
    const [nomeImagem, setNomeImagem] = useState(""); // Nome do arquivo de imagem selecionado
    const [erroNome, setErroNome] = useState(""); // Mensagem de erro para o campo "Nome"
    const [erroRga, setErroRga] = useState(""); // Mensagem de erro para o campo "RGA"
    const [erroTipoPet, setErroTipoPet] = useState(""); // Mensagem de erro para o campo "Tipo do Pet"
    const [erroDescricao, setErroDescricao] = useState(""); // Mensagem de erro para o campo "Descrição"
    const [erroData, setErroData] = useState(""); // Mensagem de erro para o campo "Data"
    const [erroImagem, setErroImagem] = useState(""); // Mensagem de erro para o campo "Imagem"
    const [erroCep, setErroCep] = useState(""); // Mensagem de erro para o campo "CEP"

    // Função para tratar a seleção de uma imagem
    function handleImagemSelecionada(e) {
        const arquivo = e.target.files[0]; // Obtém o arquivo selecionado

        if (arquivo) {
            const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"]; // Tipos de imagem permitidos

            if (tiposPermitidos.includes(arquivo.type)) {
                setNomeImagem(arquivo.name); // Atualiza o estado com o nome do arquivo
                setErroImagem(""); // Remove a mensagem de erro
            } else {
                setNomeImagem(""); // Reseta o estado do nome da imagem
                setErroImagem("Por favor, selecione um arquivo de imagem válido (JPEG ou PNG)."); // Define a mensagem de erro
            }
        } else {
            setNomeImagem(""); // Reseta o estado caso nenhum arquivo seja selecionado
            setErroImagem("Por favor, selecione uma imagem."); // Define a mensagem de erro
        }
    }

    // Função para validar o campo "RGA" (aceita apenas números e tem limite de caracteres)
    function handleRgaAlterado(e) {
        const valor = e.target.value;
        if (/^\d*$/.test(valor)) {
            if (valor.length > 15) {
                setErroRga("O RGA pode conter no máximo 15 caracteres."); // Define a mensagem de erro
            } else {
                rgaRef.current.value = valor; // Atualiza o valor do campo
                setErroRga(""); // Remove a mensagem de erro
            }
        } else {
            setErroRga("O RGA deve conter apenas números."); // Define a mensagem de erro
        }
    }

    // Função para validar o campo "CEP"
    function handleCepAlterado(e) {
        const valor = e.target.value;
        if (/^\d{5}-?\d{3}$/.test(valor)) { // Valida o formato do CEP (ex: 12345-678 ou 12345678)
            cepRef.current.value = valor; // Atualiza o valor do campo
            setErroCep(""); // Remove a mensagem de erro
        } else {
            setErroCep("O CEP deve estar no formato 12345-678."); // Define a mensagem de erro
        }
    }

    // Função para validar o campo "Nome" (aceita apenas letras e espaços e tem limite de caracteres)
    function handleNomeAlterado(e) {
        const valor = e.target.value;
        if (/^[a-zA-ZÀ-ÿ\s]*$/.test(valor)) {
            if (valor.length > 70) {
                setErroNome("O nome pode conter no máximo 70 caracteres."); // Define a mensagem de erro
            } else {
                nomeRef.current.value = valor; // Atualiza o valor do campo
                setErroNome(""); // Remove a mensagem de erro
            }
        } else {
            setErroNome("O nome deve conter apenas letras."); // Define a mensagem de erro
        }
    }

    // Função para verificar se os campos obrigatórios estão vazios
    function verificarCampoVazio(campos) {
        let algumCampoVazio = false;

        campos.forEach(({ ref, setErro, mensagem, tipo }) => {
            if (!ref.current.value.trim()) {
                setErro(mensagem); // Define a mensagem de erro
                algumCampoVazio = true;
            } else if (tipo === "imagem") {
                // Validação específica para o campo de imagem
                const arquivo = ref.current.files[0];
                const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];
                if (!arquivo || !tiposPermitidos.includes(arquivo.type)) {
                    setErro("Por favor, selecione um arquivo de imagem válido (JPEG ou PNG).");
                    algumCampoVazio = true;
                } else {
                    setErro(""); // Remove a mensagem de erro
                }
            } else {
                setErro(""); // Remove a mensagem de erro
            }
        });

        return algumCampoVazio;
    }

    // Função para validar os dados do formulário ao clicar no botão
    function validarFormulario(e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário (recarregar a página)

        // Lista de campos obrigatórios e suas mensagens de erro
        const camposObrigatorios = [
            {
                ref: nomeRef,
                setErro: setErroNome,
                mensagem: "Por favor, insira o nome do seu pet.",
            },
            {
                ref: descricaoRef,
                setErro: setErroDescricao,
                mensagem: "Por favor, insira a descrição do seu pet.",
            },
            {
                ref: tipoPetRef,
                setErro: setErroTipoPet,
                mensagem: "Por favor, selecione o tipo do seu pet.",
            },
            {
                ref: dataRef,
                setErro: setErroData,
                mensagem: "Por favor, insira a data em que perdeu o seu pet.",
            },
            {
                ref: imagemRef,
                setErro: setErroImagem,
                mensagem: "Por favor, insira a imagem do seu pet.",
                tipo: "imagem", // Indica que este campo é do tipo imagem
            },
            {
                ref: cepRef,
                setErro: setErroCep,
                mensagem: "Por favor, insira o CEP onde encontrou o pet.",
            },
        ];

        // Verifica se algum campo obrigatório está vazio ou inválido
        if (verificarCampoVazio(camposObrigatorios)) return;

        // Validação específica para o campo "Tipo do Pet"
        if (tipoPetRef.current.value === "Selecione o tipo do pet") {
            setErroTipoPet("Por favor, selecione o tipo do seu pet.");
            return;
        } else {
            setErroTipoPet(""); // Remove a mensagem de erro se o valor for válido
        }

        // Se todas as validações passarem, o formulário é considerado válido
        console.log("Formulário válido!");
    }

    return (
        <div className={styles.pet_perdido}>
            <HeaderLog /> {/* Componente de cabeçalho */}

            <div className={styles.pet_perdido__body}>
                <div className={styles.pet_perdido__box}>
                    <form>
                        {/* Campo Nome */}
                        <div className={styles.pet_perdido__input50}>
                            <div>
                                <label htmlFor="nome">Nome do Pet</label>
                                <input
                                    id="nome"
                                    ref={nomeRef}
                                    className={styles.pet_perdido__input}
                                    type="text"
                                    onChange={handleNomeAlterado} // Validação do Nome
                                />
                                {erroNome && (
                                    <span id="nome-error" className={styles.error}>
                                        {erroNome}
                                    </span>
                                )}
                            </div>

                            {/* Campo RGA */}
                            <div>
                                <label htmlFor="rga">RGA do Pet (opcional)</label>
                                <input
                                    id="rga"
                                    ref={rgaRef}
                                    className={styles.pet_perdido__input}
                                    type="text"
                                    onChange={handleRgaAlterado} // Validação do RGA
                                />
                                {erroRga && (
                                    <span id="rga-error" className={styles.error}>
                                        {erroRga}
                                    </span>
                                )}
                            </div>
                        </div>

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

                        {/* Campo CEP */}
                        <div className={styles.pet_perdido__input100}>
                            <label htmlFor="cep">Informe o CEP que achou o Pet (temporário)</label>
                            <input
                                id="cep"
                                ref={cepRef}
                                className={`${styles.pet_perdido__input} ${styles.pet_perdido__cep}`}
                                onChange={handleCepAlterado} // Validação do CEP
                            />
                            {erroCep && (
                                <span id="cep-error" className={styles.error}>
                                    {erroCep}
                                </span>
                            )}
                        </div>

                        {/* Campo Data */}
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

                        {/* Campo Imagem */}
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
                                onChange={handleImagemSelecionada} // Validação da Imagem
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
                    </form>

                    {/* Botão de Enviar */}
                    <div className={styles.botao_center}>
                        <button
                            className={`${styles.botao} ${styles.perdeu}`}
                            onClick={validarFormulario} // Validação do formulário
                        >
                            Avançar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetPerdido;