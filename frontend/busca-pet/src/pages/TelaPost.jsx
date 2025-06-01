import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import validateToken from "../assets/utils/validateToken.js";
import HeaderLog from "./../components/HeaderLog";

import styles from "./styles/tela_post.module.css";

const TelaPost = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await validateToken();
      } catch (error) {
        console.error("Erro capturado:", error.message);
        alert(error.message);
        localStorage.removeItem("authToken");
        navigate("/form/login");
      }
    };
    checkAuthentication();
  }, [navigate]);

  return (
    <div className={styles.bg_tela_post}>
      <HeaderLog />

      <div className={styles.post__body}>
        <div className={styles.container}>
          <h1>Você...</h1>
          <Link
            to={"/posts/criar-post/pet-encontrado"}
            className={`${styles.botao} ${styles.encontrou}`}
          >
            Encontrou um Pet
          </Link>
          <Link
            to={"/posts/criar-post/pet-perdido"}
            className={`${styles.botao} ${styles.perdeu}`}
          >
            Perdeu um Pet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TelaPost;
