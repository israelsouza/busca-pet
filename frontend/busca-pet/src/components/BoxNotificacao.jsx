import { IoIosCloseCircleOutline } from "react-icons/io";

import style from "./styles/BoxNotificacao.module.css";

function BoxNotificacao({ nome, telefone, email, onClick }) {
  return (
    <div className={style.boxnotificacao__container}>
      <div>
        <h3>Alguém viu o seu pet</h3>
        <p>Parece que o  <strong> {nome} </strong> encontrou o seu pet, entre em contato com ele.</p>
        <div className={style.boxnotificacao__contact}>
          <p>
            <strong>Telefone: </strong> {telefone}
          </p>
          <p>
            <strong>E-mail: </strong> {email}
          </p>
        </div>
      </div>
      <div>
        <IoIosCloseCircleOutline onClick={onClick} className={style.boxnotificacao__icon} />
      </div>
    </div>
  );
}

export default BoxNotificacao;
