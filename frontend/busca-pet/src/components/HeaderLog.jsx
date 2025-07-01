import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import Logo_Cachorro from "./../assets/imgs/Logo_Cachorro.png";
import Icone from "./../assets/imgs/Icone.png";

import style from "./styles/header_log.module.css";

function HeaderLog({ onSelectCategory }) {
  const [userPhotoSrc, setUserPhotoSrc] = useState(null);

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
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          `http://localhost:3000/api/usuario/foto`,
          headerRequest
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.foto.USU_FOTO !== null || data.foto.USU_FOTO !== 'null' ) {
          setUserPhotoSrc(data.foto.USU_FOTO);
        } else {
          setUserPhotoSrc(Icone);
        }

      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        setUserPhotoSrc(Icone);
      }
    }
    fetchUserInfo();
  }, []);

  const handleRefresh = useCallback((e) => {
    e.preventDefault();
    window.location.href = e.currentTarget.href;
  }, []);

  return (
    <div>
      <header className={style.header_logado}>
        <Link to={"/posts/all?category=todos"} onClick={handleRefresh} >
          <img
            className={style.logodog}
            src={Logo_Cachorro}
            alt="Logo com um cachorro peludo usando uma lupa"
            width="150px"
          />
        </Link>
        <nav className={style.navegation}>
          <Link
            to={"/posts/all?category=todos"}
            onClick={() => onSelectCategory("todos")}
            className={style.links_header}
          >
            Todos
          </Link>
          <Link
            to={"/posts/all?category=encontrado"}
            onClick={() => onSelectCategory("Encontrado")}
            className={style.links_header}
          >
            Achados
          </Link>
          <Link
            to={"/posts/all?category=perdido"}
            onClick={() => onSelectCategory("Perdido")}
            className={style.links_header}
          >
            Perdidos
          </Link>
          <Link to={"/posts/pesquisa"} className={style.links_header}>
            Pesquisar
          </Link>
        </nav>

        <Link to={"/Perfil"}>
          {userPhotoSrc  ? (
            <img
              className={style.icon}
              src={userPhotoSrc}
              alt="Foto do usuário"
            />
          ) : (
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
