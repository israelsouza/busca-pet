import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  validarCampoEmail,
  validarTamanhoMinimo,
} from "../assets/utils/regex.js";
import HeaderForm from "../components/HeaderForm";
import InputTxt from "../components/InputTxt";
import ButtonForm from "../components/ButtonForm";
import enviarDados from "../assets/utils/enviarDados";
import useAuth from "../assets/utils/globalUser";

import style from "./styles/recuperacao_senha.module.css";

const RecuperacaoSenha = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const tokenRef = useRef(null);
  const passRef = useRef(null);
  const passRef2 = useRef(null);

  const [etapa, setEtapa] = useState("solicitarEmail");
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const { userEmail, setEmail } = useAuth();

  const handleEmailChange = (event) => {
    setEmail(emailRef.current.value);
  };

  async function recuperarSenha(e) {
    e.preventDefault();

    let email = emailRef.current;

    if (
      validarCampoEmail({
        campo: email,
        setErro: setMensagemErro,
        mensagem: "Por favor, insira um e-mail válido.",
      })
    )
      return true;

    email = { email: emailRef.current.value };
    const result = await enviarDados(email, "form/recuperar-senha");

    if (result.success) {
      setEtapa("validarToken");
      setMensagemSucesso(result.message);
      setMensagemErro("");
    } else {
      setMensagemErro(
        result.message ||
          "Erro ao solicitar código, reveja o email e tente novamente."
      );
      setMensagemSucesso("");
    }
  }

  async function validarToken(e) {
    e.preventDefault();

    const data = {
      email: userEmail,
      token: tokenRef.current.value,
    };

    const result = await enviarDados(data, "validar-token-senha");

    if (result.success) {
      setEtapa("atualizarSenha");
      setMensagemSucesso(result.message);
      setMensagemErro("");
    } else {
      setMensagemErro(result.message || "Token inválido.");
      setMensagemSucesso("");
    }
  }

  async function atualizarSenha(e) {
    e.preventDefault();

    if (
      validarTamanhoMinimo({
        campo: passRef.current,
        min: 6,
        setErro: setMensagemErro,
        mensagem:
          "A senha possui no mínimo 6 caracteres, verifique e tente novamente",
      })
    )
      return true;

    if (passRef.current.value !== passRef2.current.value) {
      setMensagemErro("As senhas não coincidem. Por favor, verifique.");
      return true;
    }

    const password = { password: passRef.current.value, email: userEmail };
    const result = await enviarDados(password, "atualizar-senha");

    if (result.success) {
      setEtapa("concluido");
      setMensagemSucesso(result.message);
      setMensagemErro("");
    } else {
      setMensagemErro(result.message || "Erro ao atualizar senha.");
      setMensagemSucesso("");
    }

    setTimeout(() => navigate("/form/login"), 1200);
  }

  return (
    <div className={style["rec-senha"]}>
      <div className={style["rec-senha__form"]}>
        <div className={style["rec-senha__header"]}>
          <HeaderForm />
        </div>

        <div className={style["rec-senha__body"]}>
          <div className={style["rec-senha__box-title"]}>
            <h2 className={style["rec-senha__title"]}>
              Esqueceu a senha? Vamos Recupera-la!
            </h2>
          </div>

          {mensagemSucesso && (
            <div className="sucess_form">{mensagemSucesso}</div>
          )}
          {mensagemErro && <div className="cad__error">{mensagemErro}</div>}

          {etapa === "solicitarEmail" && (
            <div className={style["rec-senha__etapa"]}>
              <InputTxt
                name="Email"
                place="Insira o seu email aqui"
                refProp={emailRef}
                onChange={handleEmailChange}
              />
              <ButtonForm
                placeholder="Enviar Código"
                algumaFuncao={recuperarSenha}
              />
            </div>
          )}

          {etapa === "validarToken" && (
            <div className={style["rec-senha__etapa"]}>
              <InputTxt
                name="Código de validação"
                place="Digite o código de validação recebido por e-mail"
                refProp={tokenRef}
              />
              <ButtonForm
                placeholder="Validar Token"
                algumaFuncao={validarToken}
              />
            </div>
          )}

          {etapa === "atualizarSenha" && (
            <div className={style["rec-senha__etapa"]}>
              <InputTxt
                name="Nova Senha"
                place="Insira a sua nova senha"
                refProp={passRef}
                type="password"
              />
              <InputTxt
                name="Confirme a nova senha"
                place="Insira novamente a sua nova senha"
                refProp={passRef2}
                type="password"
              />
              <ButtonForm
                placeholder="Atualizar senha"
                algumaFuncao={atualizarSenha}
              />
            </div>
          )}

          {etapa === "concluido" && (
            <div className={style["rec-senha__etapa"]}></div>
          )}
        </div>
      </div>
      <div className={style["rec-senha__image"]}></div>
    </div>
  );
};

export default RecuperacaoSenha;
