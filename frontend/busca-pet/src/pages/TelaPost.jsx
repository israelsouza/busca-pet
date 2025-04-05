import styles from "./styles/tela_post.module.css";
import HeaderLog from "./../components/HeaderLog";
import { Link } from "react-router-dom";


const TelaPost = () => {
  return (
    <div className={styles.bg_tela_post}>

      <HeaderLog />

      <div className={styles.post__body}>
        <div className={styles.container}>
          <h1>Você...</h1>
          <Link to={''} className={`${styles.botao} ${styles.encontrou}`}>
            Encontrou um Pet
          </Link>
          <Link to={''} className={`${styles.botao} ${styles.perdeu}`}>Perdeu um Pet</Link>
        </div>
      </div>
    </div>
  );
};

export default TelaPost;
