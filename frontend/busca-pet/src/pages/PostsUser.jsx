import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import HeaderLog from "../components/HeaderLog";
import validateToken from "../assets/utils/validateToken";

import style from "./styles/postsAll.module.css";

import PostUser from "../components/PostUser";
import Style from "./styles/postsUser.module.css";


function PostsUser() {
  const navigate = useNavigate();
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
      const token = localStorage.getItem("authToken");

      const headerRequest = {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                }
      try {
        const response = await fetch(`http://localhost:3000/api/posts/user/${token}`, headerRequest)
      const data = await response.json();
      console.log(data)
      setUserPosts(data.myPosts);
      } catch (error) {
        console.error("Erro ao buscar posts do usuário:", error);
      }

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
                            pagina="Meus-Posts"
                        />
                    ))}
                </div>

    <div className={Style.Container}>
            <div className={Style.containerHeader}>
              <HeaderLog />
            </div>

        <h1 className={Style.h1}>Minhas Publicações</h1>
            <div className={Style.posts}>
              <div className={Style.containerPosts}>
                {userPosts.map((post) => (
                  <PostUser 
                    key={post.POS_ID}
                    usuario={post.PES_NOME}
                    imagemUsuario={post.USU_FOTO}
                    imagemPet={post.PET_FOTO}
                    nomePet={post.PET_NOME}
                    caracteristicas={post.PET_DESCRICAO}
                    dataSumico={post.POS_DATA}
                    regiao={post.PET_LOCAL}
                  />
                ))}
              </div>

            </div>
    </div>
    </div>
    </div>
  );
}

export default PostsUser;
