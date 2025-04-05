{
  /* 

// TODO: Implementar exibição de mensagens de sucesso/erro na interface
// EXEMPLO DE COMO USAR O RETORNO PARA EXIBIR NA TELA
      
  const [mensagem, setMensagem] = useState("");

  async function cadastrarUsuario(e) {
    e.preventDefault();

    try {
      const dadosAoBack = await enviarDados(dados, "http://localhost:3000/form/cadastro-usuario");
      setMensagem(dadosAoBack.message); // Atualiza a mensagem no estado
    } catch (error) {
      setMensagem("Erro ao enviar os dados. Tente novamente.");
    }
  }

  return (
    <div>
      <form onSubmit={cadastrarUsuario}>
        // Campos do formulário
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>} // * Exibe a mensagem na interface
    </div>
  )
}
      
      
*/
}

import { useRef, useState } from "react";
import style from "./styles/cadastroUsuario.module.css";
import HeaderForm from "../components/HeaderForm";
import InputTxt from "../components/InputTxt";
import Option from "../components/Option";
import ButtonForm from "../components/ButtonForm";
import { Link, useNavigate } from "react-router-dom";
import {
  verificarCampoVazio,
  verificarTamanhoMaximo,
  verificarTamanhoFixo,
  verificarTamanhoMinimo,
  verificarSeTemLetras,
  verificarSeTemNumeros,
  verificarSeEEmail,
} from "../assets/utils/formValidacoes";
import enviarDados from "../assets/utils/enviarDados";

function Cadastro() {
  const navigate = useNavigate();

  // REFERENCIAS
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const phoneRef = useRef(null);
  const ruaRef = useRef(null);
  const bairroRef = useRef(null);
  const cepRef = useRef(null);
  const cidadeRef = useRef(null);
  const estadoRef = useRef(null);

  // ESTADOS
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroPhone, setErroPhone] = useState("");
  const [erroRua, setErroRua] = useState("");
  const [erroBairro, setErroBairro] = useState("");
  const [erroCEP, setErroCEP] = useState("");
  const [erroCidade, setErroCidade] = useState("");
  const [erroEstado, setErroEstado] = useState("");

  const [mensagem, setMensagem] = useState("");

  async function cadastrarUsuario(e) {
    e.preventDefault();

    const name = nomeRef.current;
    const email = emailRef.current;
    const senha = senhaRef.current;
    const phone = phoneRef.current;
    const rua = ruaRef.current;
    const bairro = bairroRef.current;
    const cep = cepRef.current;
    const cidade = cidadeRef.current;
    const estado = estadoRef.current;

    // campos vazios
    const camposObrigatorios = [
      {
        ref: name,
        setErro: setErroNome,
        mensagem: "Por favor, insira seu nome.",
      },
      {
        ref: email,
        setErro: setErroEmail,
        mensagem: "Por favor, insira seu e-mail.",
      },
      {
        ref: senha,
        setErro: setErroSenha,
        mensagem: "Por favor, crie a sua senha.",
      },
      {
        ref: phone,
        setErro: setErroPhone,
        mensagem: "Por favor, insira seu telefone.",
      },
      {
        ref: rua,
        setErro: setErroRua,
        mensagem: "Por favor, insira o nome da sua rua.",
      },
      {
        ref: bairro,
        setErro: setErroBairro,
        mensagem: "Por favor, insira o nome do seu bairro.",
      },
      { ref: cep, setErro: setErroCEP, mensagem: "Por favor, insira seu CEP." },
      {
        ref: cidade,
        setErro: setErroCidade,
        mensagem: "Por favor, insira o nome da sua cidade.",
      },
    ];
    const select = [
      {
        ref: estado,
        setErro: setErroEstado,
        mensagem: "Por favor, selecione algum estado válido.",
      },
    ];
    if (verificarCampoVazio(camposObrigatorios, select)) return true;

    // tamanho limite
    const camposTamanhoMaximo = [
      {
        ref: name,
        limite: 70,
        setErro: setErroNome,
        mensagem:
          "O nome deve ter no máximo 70 caracteres. Por favor, insira um nome menor",
      },
      {
        ref: email,
        limite: 70,
        setErro: setErroEmail,
        mensagem:
          "O e-mail deve ter no máximo 70 caracteres. Por favor, insira um email menor",
      },
      {
        ref: senha,
        limite: 30,
        setErro: setErroSenha,
        mensagem:
          "A senha deve ter no máximo 30 caracteres. Por favor, insira uma senha menor",
      },
      {
        ref: rua,
        limite: 120,
        setErro: setErroRua,
        mensagem:
          "A rua deve ter no máximo 120 caracteres. Por favor, verifique se o nome da rua está correto.",
      },
      {
        ref: bairro,
        limite: 120,
        setErro: setErroBairro,
        mensagem:
          "O bairro deve ter no máximo 120 caracteres. Por favor, verifique se o nome do bairro está correto.",
      },
      {
        ref: cidade,
        limite: 35,
        setErro: setErroCidade,
        mensagem:
          "A cidade deve ter no máximo 35 caracteres. Por favor, verifique se o nome da cidade está correto.",
      },
    ];
    if (verificarTamanhoMaximo(camposTamanhoMaximo)) return true;

    // tamanho fixo
    const camposTamanhoFixo = [
      {
        ref: phone,
        quantidade: 11,
        setErro: setErroPhone,
        mensagem:
          "O telefone tem que ter exatamente 11 caracteres, verifique o número digitado",
      },
      {
        ref: cep,
        quantidade: 8,
        setErro: setErroCEP,
        mensagem:
          "O cep tem que ter exatamente 8 digitos, verifique se inseriu corretamente",
      },
    ];
    if (verificarTamanhoFixo(camposTamanhoFixo)) return true;

    // tamanho minimo
    if (
      verificarTamanhoMinimo(
        senha,
        6,
        setErroSenha,
        "A senha tem que conter no mínimo 6 caracteres."
      )
    )
      return true;

    // tem letras?
    const camposNaoPodemTerLetras = [
      {
        ref: phone,
        setErro: setErroPhone,
        mensagem: "O campo de telefone só pode ter números.",
      },
      {
        ref: cep,
        setErro: setErroCEP,
        mensagem: "O campo de cep só pode ter números.",
      },
    ];
    if (verificarSeTemLetras(camposNaoPodemTerLetras)) return true;

    // tem numeros?
    const camposNaoPodemTerNumeros = [
      {
        ref: name,
        setErro: setErroNome,
        mensagem: "O campo de nome não pode conter números.",
      },
      {
        ref: bairro,
        setErro: setErroBairro,
        mensagem: "O campo de bairro não pode conter números.",
      },
      {
        ref: cidade,
        setErro: setErroCidade,
        mensagem: "O campo de cidade não pode conter números.",
      },
    ];
    if (verificarSeTemNumeros(camposNaoPodemTerNumeros)) return true;

    // tem @ ?
    if (
      verificarSeEEmail(
        email,
        setErroEmail,
        "O e-mail precisa ter o @, verifique se digitou corretamente o seu e-mail"
      )
    )
      return true;

    const dados = {
      nome: nomeRef.current.value,
      email: emailRef.current.value,
      senha: senhaRef.current.value,
      telefone: phoneRef.current.value,
      rua: ruaRef.current.value,
      bairro: bairroRef.current.value,
      cep: cepRef.current.value,
      cidade: cidadeRef.current.value,
      estado: estadoRef.current.value,
    };

    try {
      const dadosAoBack = await enviarDados(
        dados,
        "http://localhost:3000/form/cadastro-usuario"
      );

      if (dadosAoBack.message) {
        setMensagem(dadosAoBack.message);

        if (dadosAoBack.message === "Cadastro realizado com sucesso") {
          setTimeout(() => navigate("/form/login"), 2000); 
        }
      } else {
        setMensagem("Erro inesperado. Tente novamente.");
      }


    } catch (error) {
      
      if (error.message) {
        setMensagem(error.message);
      } else {
        // Exibe uma mensagem genérica para outros erros
        setMensagem("Erro ao realizar o cadastro. Tente novamente.");
      }
    }
  }

  const UF = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  return (
    <div className={style.cad}>
      <div className={style["cad-header"]}>
        <div className={style["form-cad"]}>
          <div className={style["form-cad__header"]}>
            <HeaderForm />

            <div className={style.cad__body}>
              <h2 className={style.cad__title}>
                Cadastre-se e ajude a construir finais felizes para pets
                perdidos!
              </h2>

              <form>
                <InputTxt
                  refProp={nomeRef}
                  name="Nome"
                  place="Digite o seu nome"
                  type="text"
                  required={true}
                />

                {erroNome && (
                  <span id="nome-error" className={style.cad__error}>
                    {erroNome}
                  </span>
                )}

                <InputTxt
                  refProp={emailRef}
                  name="E-mail"
                  place="Digite o seu e-mail"
                  type="email"
                  required
                />

                {erroEmail && (
                  <span id="email-error" className={style.cad__error}>
                    {erroEmail}
                  </span>
                )}

                <InputTxt
                  required
                  refProp={senhaRef}
                  name="Senha"
                  place="Digite a sua senha"
                  type="password"
                />

                {erroSenha && (
                  <span id="email-error" className={style.cad__error}>
                    {erroSenha}
                  </span>
                )}

                <InputTxt
                  required
                  refProp={phoneRef}
                  name="Telefone (celular)"
                  type="tel"
                  place="Digite o seu telefone (apenas números)"
                />

                {erroPhone && (
                  <span id="email-error" className={style.cad__error}>
                    {erroPhone}
                  </span>
                )}

                <InputTxt
                  required
                  refProp={ruaRef}
                  name="Rua"
                  type="text"
                  place="Digite o nome da sua rua"
                />

                {erroRua && (
                  <span id="email-error" className={style.cad__error}>
                    {erroRua}
                  </span>
                )}

                <InputTxt
                  required
                  refProp={bairroRef}
                  name="Bairro"
                  type="text"
                  place="Digite o nome do seu bairro"
                />

                {erroBairro && (
                  <span id="email-error" className={style.cad__error}>
                    {erroBairro}
                  </span>
                )}

                <InputTxt
                  required
                  refProp={cepRef}
                  name="CEP"
                  type="tel"
                  place="Digite o seu CEP (apenas números)"
                />

                {erroCEP && (
                  <span id="email-error" className={style.cad__error}>
                    {erroCEP}
                  </span>
                )}

                <InputTxt
                  required
                  refProp={cidadeRef}
                  name="Cidade"
                  type="text"
                  place="Digite a sua cidade"
                />

                {erroCidade && (
                  <span id="email-error" className={style.cad__error}>
                    {erroCidade}
                  </span>
                )}

                <div className={style.select__box}>
                  <label className={style.imput__name}> Estado </label>
                  <select
                    name="estado"
                    id="estado"
                    className={`${style.cad__select} ${style["cad__select"]}`}
                    defaultValue="Selecione o seu estado"
                    ref={estadoRef}
                  >
                    <option value="Selecione o seu estado">
                      Selecione o seu estado
                    </option>

                    {UF.map((currValue, index) => (
                      <Option value={currValue} key={index} />
                    ))}
                  </select>

                  {erroEstado && (
                    <span className={style.cad__error}>{erroEstado}</span>
                  )}
                </div>
              </form>
              <div className={style["cad__box-submit"]}>
                {mensagem && <p className={style.cad__error}>{mensagem}</p>}
                <ButtonForm
                  placeholder="Cadastrar"
                  algumaFuncao={cadastrarUsuario}
                />

                <p className={style.cad__link}>
                  Já tem cadastro?
                  <Link
                    to={"/form/login"}
                    className={style["cad__link--login"]}
                  >
                    Faça o login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={style.cad__image}></div>
    </div>
  );
}

export default Cadastro;
