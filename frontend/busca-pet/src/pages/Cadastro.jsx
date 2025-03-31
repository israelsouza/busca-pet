import { useRef, useState } from "react";
import style from "./styles/cadastroUsuario.module.css";
import HeaderForm from "../components/HeaderForm";
import InputTxt from "../components/InputTxt";
import Option from "../components/Option";
import ButtonForm from "../components/ButtonForm";
import { Link } from "react-router-dom";
import {verificarCampoVazio, verificarTamanhoMaximo, verificarTamanhoFixo} from "../assets/utils/formValidacoes";

function Cadastro() {
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

  function capturarValores(e) {
    e.preventDefault();

    let hasError = false;

    const name = nomeRef.current;
    const email = emailRef.current;
    const senha = senhaRef.current;
    const phone = phoneRef.current;
    const rua = ruaRef.current;
    const bairro = bairroRef.current;
    const cep = cepRef.current;
    const cidade = cidadeRef.current;
    const estado = estadoRef.current;

    const camposObrigatorios = [
      {  ref: name,  setErro: setErroNome,  mensagem: "Por favor, insira seu nome." },
      {  ref: email,  setErro: setErroEmail,  mensagem: "Por favor, insira seu e-mail." },
      {  ref: senha,  setErro: setErroSenha,  mensagem: "Por favor, insira sua senha." },
      {  ref: phone,  setErro: setErroPhone,  mensagem: "Por favor, insira seu telefone." },
      {  ref: rua,  setErro: setErroRua,  mensagem: "Por favor, insira o nome da sua rua." },
      {  ref: bairro,  setErro: setErroBairro,  mensagem: "Por favor, insira o nome do seu bairro." },
      {  ref: cep,  setErro: setErroCEP,  mensagem: "Por favor, insira seu CEP." },
      {  ref: cidade,  setErro: setErroCidade,  mensagem: "Por favor, insira o nome da sua cidade." }
    ]

    verificarCampoVazio(camposObrigatorios, hasError)

    if (estado.value.length > 2) {
      setErroEstado("Por favor, selecione algum estado válido.");
      estado.focus();
      hasError = true;
    } else {
      setErroEstado("");
    }

    if (hasError == false) {

      const camposTamanhoMaximo = [
        {ref: name,  limite: 70, setErro: setErroNome, mensagem: "O nome deve ter no máximo 70 caracteres. Por favor, insira um nome menor"},
        { ref: email,  limite: 70, setErro: setErroEmail, mensagem: "O e-mail deve ter no máximo 70 caracteres. Por favor, insira um email menor"},
        { ref: senha,  limite: 30, setErro: setErroSenha, mensagem: "A senha deve ter no máximo 30 caracteres. Por favor, insira uma senha menor"},
        { ref: rua,  limite: 120, setErro: setErroRua, mensagem: "A rua deve ter no máximo 120 caracteres. Por favor, verifique se o nome da rua está correto."},
        { ref: bairro,  limite: 120, setErro: setErroBairro, mensagem: "O bairro deve ter no máximo 120 caracteres. Por favor, verifique se o nome do bairro está correto."},
        { ref: cidade,  limite: 35, setErro: setErroCidade, mensagem: "A cidade deve ter no máximo 35 caracteres. Por favor, verifique se o nome da cidade está correto."},
      ]

      verificarTamanhoMaximo(camposTamanhoMaximo, hasError)

      if (hasError == false) {

        const camposTamanhoFixo = [
          {
            ref:phone,
            quantidade: 11,
            setErro: setErroPhone,
            mensagem: "O telefone tem que ter exatamente 11 caracteres, verifique o número digitado"
          },
          {
            ref: cep,
            quantidade: 8,
            setErro: setErroCEP,
            mensagem: "O cep tem que ter exatamente 8 digitos, verifique se inseriu corretamente"
          }
        ]
  
        verificarTamanhoFixo(camposTamanhoFixo, hasError)

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
                <ButtonForm
                  placeholder="Cadastrar"
                  algumaFuncao={capturarValores}
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
