import style from "../components/styles/button_posts.module.css";

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
  pagina
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
            {!onMaps &&
              <li onClick={regiao} className={style.regiao}>Ver localização</li>
            }
          </ul>
        </div>
        <div className={style.buttoninteragir}>
          {pagina != "Meus-Posts" &&
          <>
            <button className={style.envmsg}>Enviar Mensagem</button>
          <button className={style.encontrarpet} onClick={disparaUmaNotificacao} >{textoPrimeiroCategoria} </button>
          </>
          }
        </div>
      </div>
    </div>
  );
}

export default Buttonposts;
