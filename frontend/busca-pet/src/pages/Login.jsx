import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import HeaderForm from "../components/HeaderForm";
import { validarTamanhoMinimo, validarCampoEmail } from "../assets/utils/regex.js";

import styles from "./styles/login.module.css";

function login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  function realizarLogin(e) {
    e.preventDefault();
    const email = emailRef.current;
    const senha = senhaRef.current;

    if ( validarCampoEmail({
      campo:email,
      setErro: setErroEmail,
      mensagem: "Por favor, insira um e-mail válido."
    }) ) return true;

    if ( 
      validarTamanhoMinimo({      
        campo:senha,
        min: 6,
        setErro: setErroSenha,
        mensagem: "A senha possui no mínimo 6 caracteres, verifique e tente novamente"
    })
      ) return true;

    const emailLowerCase = email.value.toLowerCase();

     const data = {
      email: emailLowerCase,
      password: senhaRef.current.value
     }

      async function validarDadosDeLogin(dados) {
        try {
          const response = await fetch(
            "http://localhost:3000/form/login"
            , {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao realizar login.");
          }
      
          const resultado = await response.json();
      
          return resultado
        } catch (error) {
          throw error
        }
     }

    validarDadosDeLogin(data)
    .then((resultado) => {
      
      setErroLogin("")
      setMensagemSucesso("Login realizado com sucesso!");

      localStorage.setItem("authToken", resultado.token);

      setTimeout(() => navigate("/posts/all"), 1000); 
    })
    .catch((error) => {
      setErroEmail("");
      setErroSenha("");
      setErroLogin(error.message); 
    });


  }

  return (
    <>
      <div className={styles.fundo_login}>

        <div className={styles.conjuntoEsquerdo}>
          <HeaderForm />

          <h2 className={styles.sub_title_login}>
            Bem-vindo de volta!<br></br>Vamos encontrar mais pets juntos?
          </h2>

          <form className={styles.form_login}>
            <div className={styles.campos}>
              <label className={styles.login__label} htmlFor="email">
                Email
              </label>
              <input
                ref={emailRef}
                type="text"
                placeholder="Digite o seu e-mail"
               / >

              {erroEmail && (
                <span id="email-error" className='cad__eror'>
                  {erroEmail}
                </span>
              )}

            </div>
            <div className={styles.campos}>
              <label className={styles.login__label} htmlFor="senha">
                Senha
              </label>
              <input
                ref={senhaRef}
                type="password"
                placeholder="Digite a sua senha"
               / >

              {erroSenha && (
                <span id="email-error" className='cad__eror'>
                  {erroSenha}
                </span>
              )}
            </div>
            {erroLogin && (
                <span id="email-error" className='cad__eror'>
                  {erroLogin}
                </span>
              )}
              {mensagemSucesso && (
                <span className='sucess_form'>
                  {mensagemSucesso}
                </span>
              )}
            <button onClick={realizarLogin} className={styles.btn_login}> 
              Login
            </button>
          </form>
          <div className={styles.redirect}>
            <p>
              Ainda não tem cadastro?{" "}
              <Link className={styles.links} to={"/form/cadastro-usuario"}>
                Cadastre-se!
              </Link>
            </p>
            <p>
              Esqueceu a senha?{" "}
              <Link className={styles.links} to={"/form/recuperacao-senha"}>
                Recupere-a!
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.lado_img}></div>
      </div>
    </>
  );
}

export default login;
