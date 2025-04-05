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
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

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
            // Se o status não for 200, lança um erro com a mensagem apropriada
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
      // Login bem-sucedido
      console.log("Login realizado com sucesso:", resultado);
      // Redirecionar ou realizar outra ação
      setTimeout(() => navigate("/posts/all"), 2000); 
    })
    .catch((error) => {
      // Exibe a mensagem de erro na tela
      setErroEmail("");
      setErroSenha("");
      setErroLogin(error.message); // Exibe o erro 
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
