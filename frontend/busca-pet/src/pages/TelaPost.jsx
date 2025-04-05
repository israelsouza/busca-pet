import styles from "./styles/tela_post.module.css";
import HeaderLog from "./../components/HeaderLog";


const TelaPost = () => {
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

export default TelaPost;
