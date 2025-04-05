import { Link } from "react-router-dom";
import styles from "./styles/login.module.css";
import HeaderForm from "../components/HeaderForm";
import {
  verificarCampoVazio,
  verificarTamanhoMaximo,
  verificarTamanhoFixo,
  verificarTamanhoMinimo,
  verificarSeTemLetras,
  verificarSeTemNumeros,
  verificarSeEEmail,
} from "../assets/utils/formValidacoes";
import { useRef, useState } from "react";

function login() {
  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  function realizarLogin(e) {
    e.preventDefault();
    const email = emailRef.current;
    const senha = senhaRef.current;

    verificarSeEEmail(
      email,
      setErroEmail,
      "O e-mail precisa ter o @, verifique se digitou corretamente o seu e-mail"
    ) 

     verificarTamanhoMinimo(senha, 6, setErroSenha, "A senha possui no mínimo 6 caracteres, verifique e tente novamente")  

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
            <button onClick={realizarLogin} className={styles.btn_login}>
              Login
            </button>
          </form>
          <div className={styles.redirect}>
            <p>
              Ainda não tem cadastro?{" "}
              <Link className={styles.links} to={"/form/cadastro"}>
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
