import Logo from "../assets/imgs/Logo_Cachorro.png";

import styles from "./styles/login.module.css";

function login() {
  return (
    <>
      <div className={styles.main}>
        <header>
          <img src={Logo} alt="cachorro olhando por tras de uma lupa" />
          <h1>BuscaPet</h1>
        </header>
        <div className={styles.conjuntoEsquerdo}>
          <h2>
            Bem-vindo de volta!<br></br>Vamos encontrar mais pets juntos?
          </h2>

          <form action="">

            <div className={styles.campos}>
              <label htmlFor="email">Email</label>
              <input type="text" placeholder="Digite a sua senha"></input>
            </div>
            <div className={styles.campos}>
              <label htmlFor="senha">Senha</label>
              <input type="text" placeholder="Digite a sua senha"></input>
            </div>
            <button>Login</button>
          </form>

          <div className={styles.redirect}>
            <p>
              Ainda não tem cadastro? <a href="">Cadastre-se!</a>
            </p>
            <p>
              Esqueceu a senha? <a href="">Recupere-a!</a>
            </p>
          </div>
        </div>
      </div>


    </>
  );
}

export default login;
