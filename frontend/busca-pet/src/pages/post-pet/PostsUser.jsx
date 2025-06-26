import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import MapGoogleComponent from "../../components/MapGoogleComponent";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Buttonposts from "../../components/button_posts";
import HeaderLog from "../../components/HeaderLog";
import validateToken from "../../assets/utils/validateToken";


import style from "../styles/postsAll.module.css";

function PostsUser() {
  const navigate = useNavigate()
  const [userPosts, setUserPosts] = useState([]);
  const [modalMap, setModalMap] = useState("close");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

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

      console.log(headerRequest)

      const response = await fetch(`http://localhost:3000/api/posts/meus`, headerRequest)
      const data = await response.json();
      console.log(data.meusPosts)
      setUserPosts(data.meusPosts);
    }

    fetchUserPosts();
  }, []);

    function exibirModalMapa(X, Y) {
    setLat(X);
    setLng(Y);
    setModalMap("open");
  }
    function fecharModalMapa() {
    setModalMap("close");
  }

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
                            nomePet={ post.PET_NOME === 'undefined' ? "" : post.PET_NOME }
                            caracteristicas={post.PET_DESCRICAO}
                            dataSumico={post.POS_DATA}
                            regiao={() => {
                              exibirModalMapa(post.PET_LOCAL.lat, post.PET_LOCAL.lng);
                            }}
                            pagina="Meus-Posts"
                        />
                    ))}
                </div>

                {modalMap === "open" && (
              <>
                  <div className={style.popupMap}>
                    <IoIosCloseCircleOutline
                      className={style.icon}
                      onClick={fecharModalMapa}
                    />

                    <MapGoogleComponent                    
                      width="1200px"
                      height="90%"
                      localChamadaMapa="FEED_SINGLE_POST"
                      longitudeOut={lng}
                      latitudeOut={lat}
                      centerOutside={true} 
                    />
                  </div>
                </>
              )}

            </div>
        </div>
  );
}

export default PostsUser;