import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import Logo_Cachorro from "./../assets/imgs/Logo_Cachorro.png";
import Icone from "./../assets/imgs/Icone.png";

import style from "./styles/header_log.module.css";

function HeaderLog({ onSelectCategory }) {
  const [userInfo, setUserInfo] = useState(null);
  const [userPhotoSrc, setUserPhotoSrc] = useState(null);

  useEffect(() => {
    console.log("UserInfo ->", userInfo)
  }, [userInfo])
  

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token de autenticação não encontrado.");
          return;
        }

        const headerRequest = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 'Authorization' com 'A' maiúsculo
          },
        };

        const response = await fetch(
          `http://localhost:3000/user/photo/${token}`,
          headerRequest
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setUserInfo(data);

        if (data && data.USU_FOTO && data.USU_FOTO.type === 'Buffer' && Array.isArray(data.USU_FOTO.data)) {
            const photoBase64 = arrayBufferToBase64(data.USU_FOTO.data, 'image/jpeg');
            setUserPhotoSrc(photoBase64);
        } else {
            // Se não houver foto, não for Buffer, ou se deu erro, usa o ícone padrão
            setUserPhotoSrc(Icone);
        }


      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        setUserInfo(Icone);
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <div>
      <header className={style.header_logado}>
        <Link to={"/posts/all"} onClick={() => onSelectCategory("all")}>
          <img
            className={style.logodog}
            src={Logo_Cachorro}
            alt="Logo com um cachorro peludo usando uma lupa"
            width="150px"
          />
        </Link>
        <nav className={style.navegation}>
          <Link
            to={"/posts/all?category=all"}
            onClick={() => onSelectCategory("all")}
            className={style.links_header}
          >
            Todos
          </Link>
          <Link
            to={"/posts/all?category=found"}
            onClick={() => onSelectCategory("found")}
            className={style.links_header}
          >
            Achados
          </Link>
          <Link
            to={"/posts/all?category=lost"}
            onClick={() => onSelectCategory("lost")}
            className={style.links_header}
          >
            Perdidos
          </Link>
          <Link to={"/posts/pesquisa"} className={style.links_header}>
            Pesquisar
          </Link>
        </nav>

        <Link to={"/Perfil"}>
          {userPhotoSrc  ? ( // Se userPhotoSrc tem um valor (Base64 ou URL do Icone)
          
            <img
              className={style.icon}
              src={userPhotoSrc}
              alt="Foto do usuário"
            />
          ) : (
            // Enquanto userPhotoSrc é nulo (carregando), ou se deu erro, exibe um placeholder ou Icone
            <img
              className={style.icon}
              src={Icone}
              alt="Carregando foto ou ícone padrão"
            />
          )}
        </Link>
      </header>
    </div>
  );
}

export default HeaderLog;
