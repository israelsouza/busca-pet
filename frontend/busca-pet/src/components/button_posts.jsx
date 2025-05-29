import style from "../components/styles/button_posts.module.css";

function Buttonposts({
  usuario,
  imagemPet,
  nomePet,
  caracteristicas,
  dataSumico,
  regiao,
  textoPrimeiroCategoria,
  disparaUmaNotificacao,
  text_button
}) {
  return (
    <div className={style.postcontainer}>
      <div className={style.postbody}>
        <div className={style.user}>
          <h2>user: {usuario}</h2>
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
            <li>{regiao}</li> {/* DEP. GOOGLE MAPS */}
          </ul>
        </div>
        <div className={style.buttoninteragir}>
          <button className={style.envmsg}>{text_button}</button>
          <button
            className={style.encontrarpet}
            onClick={disparaUmaNotificacao}
          >
            {textoPrimeiroCategoria}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buttonposts;
