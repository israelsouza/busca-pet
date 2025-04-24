import Buttonposts from "../components/button_posts";
import HeaderLog from "../components/HeaderLog";
import React, { useEffect } from "react";
import style from "./styles/postsAll.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import validateToken from '../assets/utils/validateToken.js'

function PostsAll() {
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          await validateToken();
        } catch (error) {
          console.error("Erro capturado:", error.message);
          alert(error.message); // Exibe a mensagem de erro para o usuário
          localStorage.removeItem("authToken"); // Remove o token inválido
          navigate("/form/login"); // Redireciona para o login
        }
      };
      checkAuthentication();
    }, [navigate]);

    return (
        <div className={style.container}>
            <HeaderLog />
            <div className={style.opcaoContainer}>
                <div className={style.headopcoes}>
                    <h1 className={style.h1}>Todos os Pets</h1>
                        <div className={style.buttoncontainer}>
                            <Link to={'/posts/criar-post'} >
                                <button id="link-btn" className={style.button}>Adicionar Pet encontrado/perdido</button>
                            </Link>
                            <button className={style.button}>Verificar Pet que eu publiquei</button>
                        </div>
                </div>
                <div className={style.posts}>
                    <Buttonposts  />
                    <Buttonposts  />
                </div>
            </div>
        </div>
    );
}

export default PostsAll;
