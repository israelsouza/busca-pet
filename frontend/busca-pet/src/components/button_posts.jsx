import style from "../components/styles/button_posts.module.css";
import ModalDenuncia from "../components/ModalDenuncias.jsx";
import { useState } from "react";

function Buttonposts({
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
}) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => {
    setMostrarModal(true);
  };

  const enviarDenuncia = async ({ tipo, descricao, petId }) => {
    const token = localStorage.getItem("authToken");

    await fetch("http://localhost:3000/api/denunciar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tipo, descricao, petId }),
    });

    setMostrarModal(false);
    alert("Denúncia enviada com sucesso!");
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
              <button className={`${style.denuncia} ${style.envmsg}`}  onClick={abrirModal}>{denunciaPlaceholder}</button>
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
              petId={petId}
              onClose={() => setMostrarModal(false)}
              onSubmit={onDenunciarClick}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default Buttonposts;
