import BoxNotificacao from "../components/BoxNotificacao.jsx";
import HeaderLog from "../components/HeaderLog.jsx";
import styles from "./styles/Notification.module.css";
import { FiTrash } from "react-icons/fi";
import validateToken from "../assets/utils/validateToken.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Notification() {
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

  useEffect(() => {
    function getNotifications() {
      const token = localStorage.getItem("authToken");
      const headerRequest = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
        },
      };

      fetch(`http://localhost:3000/user/notification/${token}`, headerRequest)
        .then((response) => response.json())
        .then((data) => {
          console.log("Notificações: ", data);
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
        <BoxNotificacao nome="" telefone="" email="" />
        <BoxNotificacao />
        <button className={styles.pnotification__button}>
          <span>Excluir notificações</span>
          <FiTrash className={styles.pnotification__icon} />
        </button>
      </div>
    </div>
  );
}

export default Notification;
