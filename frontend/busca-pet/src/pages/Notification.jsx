import BoxNotificacao from "../components/BoxNotificacao.jsx";
import HeaderLog from "../components/HeaderLog.jsx";
import styles from "./styles/Notification.module.css";
import { FiTrash } from "react-icons/fi";

function Notification() {
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
