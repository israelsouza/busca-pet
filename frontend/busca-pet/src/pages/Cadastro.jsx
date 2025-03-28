import { useRef, useState } from "react";
import style from "./styles/cadastroUsuario.module.css";
import HeaderForm from "../components/HeaderForm";
import InputTxt from "../components/InputTxt";
import Option from "../components/Option";
import ButtonForm from "../components/ButtonForm";
import { Link } from "react-router-dom";

function verificarCamposVazios() {
  let hasError = false;

  if (!nomeRef.current.value.trim()) {
    setErroNome("Por favor, insira seu nome."); // para inserir alert, por aqui dentro
    nomeRef.current.focus();
    hasError = true;
  } else {
    setErroNome("");
  }

  if (!emailRef.current.value.trim()) {
    setErroEmail("Por favor, insira seu e-mail."); // para inserir alert, por aqui dentro
    emailRef.current.focus();
    hasError = true;
  } else {
    setErroEmail("");
  }
}

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

  // ESTADOS
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroPhone, setErroPhone] = useState("");
  const [erroRua, setErroRua] = useState("");
  const [erroBairro, setErroBairro] = useState("");
  const [erroCEP, setErroCEP] = useState("");
  const [erroCidade, setErroCidade] = useState("");

  function capturarValores(e) {
    e.preventDefault();

    verificarCamposVazios();
  }

  const UF = [
    "Selecione o seu estado",
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
                  name="nome"
                  place="Digite o seu nome"
                  required={true}
                />

                {erroNome && (
                  <span id="nome-error" className={style.cad__error}>
                    {erroNome}
                  </span>
                )}

                <InputTxt
                  refProp={emailRef}
                  name="email"
                  place="Digite o seu e-mail"
                  required
                />

                {erroNome && (
                  <span id="email-error" className={style.cad__error}>
                    {erroNome}
                  </span>
                )}

                <InputTxt
                  required
                  refProp={senhaRef}
                  name="senha"
                  place="Digite a sua senha"
                />
                <InputTxt
                  required
                  refProp={phoneRef}
                  name="phone"
                  place="Digite o seu telefone"
                />
                <InputTxt
                  required
                  refProp={ruaRef}
                  name="rua"
                  place="Digite o nome da sua rua"
                />
                <InputTxt
                  required
                  refProp={bairroRef}
                  name="Bairro"
                  place="Digite o nome do seu bairro"
                />
                <InputTxt
                  required
                  refProp={cepRef}
                  name="cep"
                  place="Digite o seu CEP"
                />
                <InputTxt
                  required
                  refProp={cidadeRef}
                  name="cidade"
                  place="Digite a sua cidade"
                />

                <div className={style.select__box}>
                  <label className={style.imput__name}> Estado </label>
                  <select
                    name="estado"
                    id="estado"
                    className={`${style.cad__select} ${style["cad__select"]}`}
                  >
                    {UF.map((currValue, index) => (
                      <Option value={currValue} disable="disable" key={index} />
                    ))}
                  </select>
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
