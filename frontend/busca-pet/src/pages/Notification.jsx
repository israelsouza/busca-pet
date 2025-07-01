import { useEffect, useState, useCallback } from "react";
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

  const getNotifications = useCallback(async () => {
      const token = localStorage.getItem("authToken");
      const headerRequest = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(`http://localhost:3000/api/notificacao/mensagem`, headerRequest)
          .then((response) => response.json())
          .then((data) => {
            console.log("Notificações: ", data);
            let notification = data.notificacoes;
            setNotification(notification);
          })
          .catch((error) => {
            console.error("Erro ao buscar notificações:", error);
        });
  }, [])

  useEffect(() => {
    getNotifications();
  }, [notification]);

  function deleteNotification(id) {
    console.log("ID da notificação a ser deletada:", id);
    const token = localStorage.getItem("authToken");
    const headerRequest = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`http://localhost:3000/api/notificacao/mensagem/${id}`, headerRequest)
      .then((response) => response.json())
      .then((data) => {
        console.log("Notificações deletadas: ", data);
        setNotification((prevNotifications) =>
          prevNotifications.filter((notificacao) => notificacao[4] !== id)
        );
      })
      .catch((error) => {
        console.error("Erro ao deletar notificações:", error);
      });
  }

  function deletarTodasNotificacoes() {
    const token = localStorage.getItem("authToken");
    const headerRequest = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`http://localhost:3000/api/notificacao/todas-mensagem`, headerRequest)
      .then((response) => response.json())
      .then((data) => {
        alert("Todas as notificações foram deletadas com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao deletar notificações:", error);
      });
  }

  return (
    <div className={styles.pnotification}>
      <HeaderLog />
      <div className={styles.pnotification__container}>
        <h1>Notificações</h1>

        {notification.map((notificacao, key) => (
          <BoxNotificacao
            key={key}
            nome={notificacao[0]}
            telefone={notificacao[3].telefone}
            email={notificacao[3].email}
            id={notificacao[4]}
            onClick={() => {
              deleteNotification(notificacao[4]);
            }}
          />
        ))}

        {notification.length !== 0 && (
          <button className={styles.pnotification__button} onClick={deletarTodasNotificacoes} >
            <span>Excluir</span>
            <FiTrash className={styles.pnotification__icon} />
          </button>
        )}

      </div>
    </div>
  );
}

export default Notification;
