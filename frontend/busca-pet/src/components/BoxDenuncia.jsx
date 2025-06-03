import { IoIosCloseCircleOutline } from "react-icons/io";

import style from "./styles/BoxNotificacao.module.css";

function BoxDenuncia({ denunciado, denunciante, tipo, descricao, onClick, id }) {
  return (
    <div className={style.boxnotificacao__container}>
      <div>
        <h3>Post denunciado ({id})</h3>
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
        <div>
          <p className={style.postDenuncia__link} onClick={onClick}> Verifique o post <strong>  </strong> </p>
        </div>
      </div>
    </div>
  );
}

export default BoxDenuncia;
