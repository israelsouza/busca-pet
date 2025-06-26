// pages/PostsAll.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";

import Buttonposts from "../../components/button_posts.jsx";
import HeaderLog from "../../components/HeaderLog.jsx";
import useWebSocket from "../../assets/utils/useWebSocket.js";
import validateToken from "../../assets/utils/validateToken.js";
import enviarDados from "../../assets/utils/enviarDados.js"; // Importe a sua função enviarDados
import MapGoogleComponent from "../../components/MapGoogleComponent.jsx";


import style from "../styles/postsAll.module.css";

function PostsAll() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const websocketUrl = `ws://localhost:3000?token=${token}`;
  const { socket, messages, sendMessage } = useWebSocket(websocketUrl);
  const [notificacoesRecebidas, setNotificacoesRecebidas] = useState([]);

  const [currentPosts, setCurrentPosts] = useState([]);
  const [category, setCategory] = useState("todos");
  const [modalMap, setModalMap] = useState("close");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const exibirNotificacao = useCallback((notificacao) => {
    alert("Nova notificação recebida:", notificacao.message);

    if (notificacao.type === "novaDenuncia") {
      alert(`Nova denúncia: ${notificacao.message}`);
    } else if (notificacao.type === "petEncontrado") {
      alert(`Nova notificação de pet encontrado: ${notificacao.message}`);
    }
  }, []);

  useEffect(() => {
    messages.forEach((message) => {
      if (
        message.type === "novaDenuncia" ||
        message.type === "petEncontrado" ||
        message.type === "notification"
      ) {
        exibirNotificacao(message);
        setNotificacoesRecebidas((prev) => {
          const isNew = !prev.some(
            (n) => JSON.stringify(n) === JSON.stringify(message)
          );
          return isNew ? [...prev, message] : prev;
        });
      }
    });
  }, [messages, exibirNotificacao, setNotificacoesRecebidas]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await validateToken();
      } catch (error) {
        console.error("Erro de autenticação:", error.message);
        alert(error.message);
        localStorage.removeItem("authToken");
        navigate("/form/login");
      }
    };
    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    async function fetchPosts() {
      const token = localStorage.getItem("authToken");
      if (!category) return;

      const headerRequest = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {

        const response = await fetch(
          `http://localhost:3000/api/posts/${category}`,
          headerRequest
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCurrentPosts(data.posts || []); 
        
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        setCurrentPosts([]);
      }
    }
    fetchPosts();
  }, [category]);

  async function umaFuncao(idPet) {
    const user = {
      idPost: idPet,
    };
    const result = await enviarDados(
      user,
      `api/notificacao/criar/mensagem`,
      "POST",
      token
    );
    alert(result.message);
  }

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
      <HeaderLog onSelectCategory={setCategory} />
      <div className={style.opcaoContainer}>
        <div className={style.headopcoes}>
          <h1 className={style.h1}>Todos os Pets</h1>
          <div className={style.buttoncontainer}>
            <Link to={"/posts/criar-post"}>
              <button id="link-btn" className={style.button}>
                Adicionar Pet encontrado/perdido
              </button>
            </Link>
          </div>
        </div>
        <div className={style.posts}>
          <div className={style.containerPosts}>
            {currentPosts.map((post) => (
                <Buttonposts
                  key={post.POS_ID}
                  idCurrentPost={post.POS_ID}
                  usuario={post.PES_NOME}
                  imagemUsuario={post.USU_FOTO}
                  imagemPet={post.PET_FOTO}
                  nomePet={post.PET_NOME}
                  caracteristicas={post.PET_DESCRICAO}
                  dataSumico={post.POS_DATA}                  
                  infoPost={ post } 
                  regiao={() => {
                    exibirModalMapa(post.PET_LOCAL.lat, post.PET_LOCAL.lng);
                  }}
                  textoPrimeiroCategoria={
                    post.POS_TIPO == "Perdido"
                      ? "Eu encontrei esse pet!"
                      : "Eu perdi esse pet!"
                  }
                  disparaUmaNotificacao={() => {
                    umaFuncao(post.POS_ID);
                  }}
                />
              ))}

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
      </div>
    </div>
  );
}

export default PostsAll;
