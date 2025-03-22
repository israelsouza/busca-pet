import styles from "./styles.module.css";
import HeaderLog from "./../components/HeaderLog";
import "./../assets/CSS/research.css";

const Home = () => {
  return (
    <div className={styles.bg_tela_post}>

      
      <HeaderLog />

      <div className={styles.post__body}>
        <div className={styles.container}>
          <h1>Você...</h1>
          <a className={`${styles.botao} ${styles.encontrou}`}>
            Encontrou um Pet
          </a>
          <a className={`${styles.botao} ${styles.perdeu}`}>Perdeu um Pet</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
