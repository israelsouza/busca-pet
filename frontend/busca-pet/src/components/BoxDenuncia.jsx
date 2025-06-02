import { IoIosCloseCircleOutline } from "react-icons/io";

import style from "./styles/BoxNotificacao.module.css";

function BoxDenuncia({ denunciado, denunciante, tipo, descricao }) {
  return (
    <div className={style.boxnotificacao__container}>
      <div>
        <h3>Post denunciado</h3>
        <p>
          Parece que o post do <strong> {denunciado} </strong> foi denunciado, checa la para ver se o <strong> {denunciante} </strong> tem razão ao fazer essa denuncia.
        </p>
        <div className={style.boxnotificacao__contact}>
          <p>
            <strong>Tipo: </strong> {tipo}
          </p>
          <p>
            <strong>Motivo: </strong> {descricao}
          </p>
        </div>
      </div>
      <div>
        <IoIosCloseCircleOutline
          //onClick={onClick}
          className={style.boxnotificacao__icon}
        />
      </div>
    </div>
  );
}

export default BoxDenuncia;
