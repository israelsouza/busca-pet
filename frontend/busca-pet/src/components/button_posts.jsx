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
}) {
  return (
    <div className={style.postcontainer}>
      <div className={style.postbody}>
        <div className={style.user}>
          <h2>user: {usuario}</h2>
        </div>

        <img src={imagemPet} alt="Imagem do Pet" width="250px" />

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
          <button className={style.envmsg}>Enviar Mensagem</button>
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
