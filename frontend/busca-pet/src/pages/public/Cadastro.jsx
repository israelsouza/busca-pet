import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import HeaderForm from "../../components/HeaderForm.jsx";
import InputTxt from "../../components/InputTxt.jsx";
import Option from "../../components/Option.jsx";
import ButtonForm from "../../components/ButtonForm.jsx";
import {
  verificarTamanhoFixo,
  verificarTamanhoMaximo,
} from "../../assets/utils/formValidacoes.js";
import {
  validarCampoEmail,
  validarTamanhoMinimo,
  validarCampoVazio,
  validarCampoApenasLetras,
  validarCampoApenasNumeros,
} from "../../assets/utils/regex.js";
import enviarDados from "../../assets/utils/enviarDados.js";

import style from "../styles/cadastroUsuario.module.css";

function Cadastro() {
  const navigate = useNavigate();

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const senhaRef2 = useRef(null);
  const phoneRef = useRef(null);
  const ruaRef = useRef(null);
  const bairroRef = useRef(null);
  const cepRef = useRef(null);
  const cidadeRef = useRef(null);
  const estadoRef = useRef(null);

  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroSenha2, setErroSenha2] = useState("");
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
    const senha2 = senhaRef2.current;
    const phone = phoneRef.current;
    const rua = ruaRef.current;
    const bairro = bairroRef.current;
    const cep = cepRef.current;
    const cidade = cidadeRef.current;
    const estado = estadoRef.current;

    const camposObrigatorios = [
      {
        ref: name,
        setErro: setErroNome,
        mensagem: "O campo nome é obrigatório.",
      },
      {
        ref: email,
        setErro: setErroEmail,
        mensagem: "O campo e-mail é obrigatório.",
      },
      {
        ref: senha,
        setErro: setErroSenha,
        mensagem: "O campo senha é obrigatório.",
      },
      {
        ref: phone,
        setErro: setErroPhone,
        mensagem: "O campo telefone é obrigatório.",
      },
      {
        ref: rua,
        setErro: setErroRua,
        mensagem: "O campo rua é obrigatório.",
      },
      {
        ref: bairro,
        setErro: setErroBairro,
        mensagem: "O campo bairro é obrigatório.",
      },
      { ref: cep, setErro: setErroCEP, mensagem: "O campo CEP é obrigatório." },
      {
        ref: cidade,
        setErro: setErroCidade,
        mensagem: "O campo cidade é obrigatório.",
      },
    ];

    if (validarCampoVazio({ campos: camposObrigatorios })) return true;

    if (estado.value.length > 2) {
      setErroEstado("Por favor, selecione algum estado válido.");
    } else {
      setErroEstado("");
    }

    if (
      validarCampoApenasLetras({
        campos: [
          {
            ref: name,
            setErro: setErroNome,
            mensagem: "O campo nome não pode conter números.",
          },
          {
            ref: rua,
            setErro: setErroRua,
            mensagem: "O campo rua não pode conter números.",
          },
          {
            ref: bairro,
            setErro: setErroBairro,
            mensagem: "O campo bairro não pode conter números.",
          },
          {
            ref: cidade,
            setErro: setErroCidade,
            mensagem: "O campo cidade não pode conter números.",
          },
        ],
      })
    )
      return true;

    if (
      validarCampoEmail({
        campo: email,
        setErro: setErroEmail,
        mensagem: "Por favor, insira um e-mail válido.",
      })
    )
      return true;

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

    if (
      validarCampoApenasNumeros({
        campos: [
          {
            ref: phone,
            setErro: setErroPhone,
            mensagem: "O campo telefone só pode ter números.",
          },
          {
            ref: cep,
            setErro: setErroCEP,
            mensagem: "O campo cep só pode ter números.",
          },
        ],
      })
    )
      return true;

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

    if (
      validarTamanhoMinimo({
        campo: senha,
        min: 6,
        setErro: setErroSenha,
        mensagem:
          "A senha possui no mínimo 6 caracteres, verifique e tente novamente",
      })
    )
      return true;

    if (senha.value !== senha2.value) {
      setErroSenha("As senhas não coincidem. Por favor, verifique.");
      return true;
    }

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
      const dadosAoBack = await enviarDados(dados, "api/usuario/cadastro");
      setMensagem(dadosAoBack.message);
      if (dadosAoBack.message) {
        setMensagem(dadosAoBack.message);

        if (dadosAoBack.message === "Usuario cadastrado com sucesso") {
          setTimeout(() => navigate("/form/login"), 1200);
        }
      } else {
        setMensagem(dadosAoBack.error);
      }
    } catch (error) {
      if (error.message) {
        alert("ERRO");
        setMensagem(error.message);
      } else {
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
                  <span id="email-error" className={style.cad__error}>
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
                  refProp={senhaRef2}
                  name="Confirme sua senha"
                  place="Confirme sua senha"
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
                    <span id="email-error" className={style.cad__error}>
                      {erroEstado}
                    </span>
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
