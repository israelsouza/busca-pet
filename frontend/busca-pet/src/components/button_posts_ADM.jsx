import style from "../components/styles/button_posts.module.css";
import { useState } from "react";

function Buttonposts_ADM({
  usuario,
  imagemPet,
  imagemUsuario,
  nomePet,
  caracteristicas,
  dataSumico,
  manter,
  deletar
}) {

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
          </ul>
        </div>
        <div className={style.buttoninteragir}>

              <button className={`${style.denuncia} ${style.envmsg}`}  onClick={manter}>
                
                Manter Post
                
              </button>
              <button
                className={style.encontrarpet}
                onClick={deletar}
              >
                Deletar Post
              </button>


        </div>
      </div>
    </div>
  );
}

export default Buttonposts_ADM;
