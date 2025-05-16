import HeaderEdicao from "../components/HeaderEdicao";
import validateToken from '../assets/utils/validateToken.js'
import icon_conta from "../assets/imgs/icon_conta.png";
import icon_notificacoes from "../assets/imgs/icon_notificacoes.png";
import BotaoSection from "../components/ButtonSection";
import icon_publicacoes from "../assets/imgs/icon_publicacoes.png";
import Style from "../pages/styles/PerfilVisualizar.module.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VisualizePerfil({userId}){ 
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

    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        async function fetchUserInfo() {
          const token = localStorage.getItem("authToken");
                const headerRequest = {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                },
                }
            const response = await fetch(`http://localhost:3000/user/photo/${token}`, headerRequest);
            const data = await response.json();
            console.log("userInfo: ", data );
            setUserInfo(data);
        }
        fetchUserInfo();
    }, [userId]);
       
        return <div>
            <HeaderEdicao />
            <div className={Style.container}>
            <div className={Style.FotoDivisao}></div>
                <section className={Style.perfilSection}>   
                    <article className={Style.cabecalho}>

                    <img src={`data:image/jpeg;base64,${userInfo.USU_FOTO}`} width={200} alt="icone de foto de usuário" />

                    <div className={Style.namecontainer}>
                    <h2 className={Style.h2}>{userInfo.PES_NOME || "Exemplo de nome de Usuário"}</h2>
                    </div>
                    </article>

                    <BotaoSection img_icone={icon_conta} nome_section="Conta" alt="Icone de perfil" text_section="Informações de contato e endereço." acesso='/EditarPerfil' />
                       
                    <BotaoSection img_icone={icon_notificacoes} nome_section="Notificações" alt="Icone de notificações" text_section="Veja quem interagiu com sua publicação." acesso="/user/notificacao"/>
                    
                    <BotaoSection img_icone={icon_publicacoes} nome_section="Publicações" alt="Icone de imagens" text_section="Veja suas próprias publicações." acesso='/Posts/user'/>
                
                </section>
                
            </div>

            </div>
}

export default VisualizePerfil;