import { useState, useEffect } from "react";

import Buttonposts from "../components/button_posts";
import HeaderLog from "../components/HeaderLog";
import validateToken from "../assets/utils/validateToken";

import style from "./styles/postsAll.module.css";

function PostsUser() {
  const [userPosts, setUserPosts] = useState([]);

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

  useEffect(() => {
    async function fetchUserPosts() {
      const response = await fetch("/api/posts/user/1");
      const data = await response.json();
      setUserPosts(data);
    }

    fetchUserPosts();
  }, []);

  return (
        <div className={style.container}>
            <HeaderLog />
            <div className={style.opcaoContainer}>
                <div className={style.headopcoes}>
                    <h1 className={style.h1}>Minhas Publicações</h1>
                </div>
                <div className={style.posts}>
                    {userPosts.map((post, index) => (
                        <Buttonposts 
                            key={index}
                            usuario={post.PES_NOME}
                            imagemUsuario={post.USU_FOTO}
                            imagemPet={post.PET_FOTO}
                            nomePet={post.PET_NOME}
                            caracteristicas={post.PET_DESCRICAO}
                            dataSumico={post.POS_DATA}
                            regiao={post.PET_LOCAL}
                        />
                    ))} {/* DEP. GOOGLE MAPS */}
                </div>
            </div>
        </div>
  );
}

export default PostsUser;
