import Style from "../styles/tela_adm.module.css";
import ButtonAdm from "../../components/ButtonAdm";
import React, { useEffect } from "react";
import HeaderForm from "../../components/HeaderForm";
import icon_publicacoes from "../../assets/imgs/icon_publicacoes.png";
import icon_denuncias from "../../assets/imgs/icon_denuncia.png";
import icone from "../../assets/imgs/icone.png";
import { useNavigate } from "react-router-dom";
import validateAdmin from "../../assets/utils/validateAdmin.js";
function TelaAdm() {

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const res = validateAdmin();
      if (!res) {
        alert("Usuário não é admin, redirecionando para login.");
        localStorage.removeItem("authToken");
        navigate("/form/login");
      }
    };
    checkAuthentication();
  }, [navigate]);

  return (
    <div className={Style.ContainerMain}>
      <div className={Style.ContainerHead}>
        <HeaderForm />
      </div>
      <div className={Style.ContainerBody}>
        <h1 className={Style.H1}>Gerenciamento</h1>
      </div>
      <div className={Style.ContainerFuncoes}>
        <ButtonAdm
          image={icon_publicacoes}
          alt="Publicações"
          funcao="Publicações"
          link="/adm/publicacoes"
        />

        <ButtonAdm
          image={icon_denuncias}
          alt="Denúncias"
          funcao="Denúncias"
          link="/adm/denuncias"
        />

        <ButtonAdm
          image={icone}
          alt="Usuários"
          funcao="Usuários"
          link="/adm/usuarios"
        />
      </div>
    </div>
  );
}

export default TelaAdm;
