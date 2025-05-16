import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash } from "react-icons/fi";

import BoxNotificacao from "../components/BoxNotificacao.jsx";
import HeaderLog from "../components/HeaderLog.jsx";
import validateToken from "../assets/utils/validateToken.js";

import styles from "./styles/Notification.module.css";

function Notification() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);

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
    function getNotifications() {
      const token = localStorage.getItem("authToken");
      const headerRequest = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(`http://localhost:3000/user/notification/${token}`, headerRequest)
        .then((response) => response.json())
        .then((data) => {
          console.log("Notificações: ", data);
          let notification = data.result;
          setNotification(notification);
        })
        .catch((error) => {
          console.error("Erro ao buscar notificações:", error);
        });
    }

    getNotifications();
  }, [])

  return (
    <div className={styles.pnotification}>
      <HeaderLog />
      <div className={styles.pnotification__container}>
        <h1>Notificações</h1>
        
        {
          notification.map((notificacao, key) => (
            <BoxNotificacao
              key={key}
              nome={notificacao[0]}
              telefone={notificacao[3].telefone}
              email={notificacao[3].email}
            />
          ))
        }

        <button className={styles.pnotification__button}>
          <span>Excluir notificações</span>
          <FiTrash className={styles.pnotification__icon} />
        </button>
      </div>
    </div>
  );
}

export default Notification;
