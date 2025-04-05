import { Link } from "react-router-dom";
import styles from "./styles/login.module.css";
import HeaderForm from "../components/HeaderForm";

function login() {
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
                  <label className={styles.login__label} htmlFor="email">Email</label>
                  <input type="text" placeholder="Digite o seu e-mail"></input>
                </div>
                <div className={styles.campos}>
                  <label className={styles.login__label} htmlFor="senha">Senha</label>
                  <input type="text" placeholder="Digite a sua senha"></input>
                </div>
                <button className={styles.btn_login}>Login</button>

                
              </form>
              <div className={styles.redirect}>
                <p>
                  Ainda não tem cadastro? <Link className={styles.links} to={'/form/cadastro'}>Cadastre-se!</Link>
                </p>
                <p>
                  Esqueceu a senha? <Link className={styles.links} to={'/form/recuperacao-senha'}>Recupere-a!</Link>
                </p>
              </div>
              
            </div>
         

        <div className={styles.lado_img}></div>

      </div>

    </>
  );
}

export default login;
