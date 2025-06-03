import React, { useEffect, useState, useCallback } from "react";
import BoxDenuncia from "../components/BoxDenuncia.jsx";
import HeaderForm from "../components/HeaderForm";
import fetchAPI from "../assets/utils/fetchAPI.js";
import { FaTrashCan } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";

import styles from "./styles/Notification.module.css";

function AdmDenuncias() {
  const [denuncias, setDenuncias] = useState([]);

  const fetchDenuncias = useCallback(async () => {
    try {
      const res = await fetchAPI("api/adm/denuncias");
      if (!res.ok) throw new Error("Erro ao buscar usuários");
      const data = await res.json();
      setDenuncias(data.denuncias);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }, []);

  useEffect(() => {
    fetchDenuncias();
  }, [fetchDenuncias]);

  return (
    <div className={styles.pnotification}>
      <HeaderForm />
      <div className={styles.pnotification__container}>
        <h1>Gerenciar denúncias</h1>

        {denuncias.map((denuncia, key) => (
          <BoxDenuncia
            key={denuncia.DEN_ID}
            denunciado={denuncia.NOME_DENUNCIADO}
            denunciante={denuncia.NOME_DENUNCIANTE}
            tipo={denuncia.DEN_TIPO}
            descricao={denuncia.DEN_DESCRICAO}
            info={denuncia}            
          />
        ))}

      </div>
      <div className={styles.btn_container}>
          <button className={styles.btn_refresh}>  <IoMdRefresh className={styles.icon_refresh} />   </button>
          <button className={styles.btn_trash}>  <FaTrashCan className={styles.icon_trash} />   </button>              
      </div>
    </div>
  );
}

export default AdmDenuncias;
