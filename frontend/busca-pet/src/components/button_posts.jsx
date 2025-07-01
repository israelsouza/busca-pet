import style from "../components/styles/button_posts.module.css";
import ModalDenuncia from "../components/ModalDenuncias.jsx";
import { useState } from "react";

function Buttonposts({
  idCurrentPost,
  usuario,
  imagemPet,
  imagemUsuario,
  nomePet,
  caracteristicas,
  dataSumico,
  regiao,
  textoPrimeiroCategoria,
  disparaUmaNotificacao,
  onMaps,
  pagina,
  denunciaPlaceholder,

  text_button,
  petId,
  onDenunciarClick,
  infoPost
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [currentPostIdToDenounce, setCurrentPostIdToDenounce] = useState(null);

  const abrirModal = () => {
    setMostrarModal(true);
  };

  return (
    <div className={style.postcontainer}>
      <div className={style.postbody}>
        <div className={style.user}>
          <img src={imagemUsuario} alt="" className={style.icon} />
          <h2>{usuario}</h2>
        </div>

        <div className={style.imageWrapper}>
          <img src={imagemPet} alt="Imagem do Pet" className={style.petImage} />
        </div>

        <div className={style.infospost}>
          <h3>{nomePet}</h3>
          <ul>
            <li>{caracteristicas}</li>
            <br />
            <span>Visto pela ultima vez: </span>
            <li>{dataSumico}</li>
            {!onMaps && (
              <li onClick={regiao} className={style.regiao}>
                Ver localização
              </li>
            )}
          </ul>
        </div>
        <div className={style.buttoninteragir}>
          {pagina != "Meus-Posts" && (
            <>
              <button className={`${style.denuncia} ${style.envmsg}`}  onClick={abrirModal}>
                
                Denunciar
                
              </button>
              <button
                className={style.encontrarpet}
                onClick={disparaUmaNotificacao}
              >
                {textoPrimeiroCategoria}
              </button>
            </>
          )}

          {mostrarModal && (
            <ModalDenuncia
              onClose={() => setMostrarModal(false)}
              onSubmit={ (e) => onDenunciarClick(e.target.value)}
              post={infoPost}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default Buttonposts;
