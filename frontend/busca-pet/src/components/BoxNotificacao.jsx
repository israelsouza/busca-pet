import style from "./styles/BoxNotificacao.module.css";
import { IoIosCloseCircleOutline } from "react-icons/io";

function BoxNotificacao({ nome, telefone, email }) {
  return (
    <div className={style.boxnotificacao__container}>
      <div>
        <h3>Alguém viu o seu pet</h3>
        <p>Parece que o @user encontrou o seu pet, entre em contato com ele.</p>
        <div className={style.boxnotificacao__contact}>
          <p>
            <strong>Telefone: </strong> (11) 99999-9999
          </p>
          <p>
            <strong>E-mail: </strong> user@gmail.com
          </p>
        </div>
      </div>
      <div>
        <IoIosCloseCircleOutline className={style.boxnotificacao__icon} />
      </div>
    </div>
  );
}

export default BoxNotificacao;
