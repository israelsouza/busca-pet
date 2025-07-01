import Style from "../components/styles/PostUser.module.css";
function PostsUser({
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
    <div className={Style.PostContainer}>
      <div className={Style.PostBody}>
        <div className={Style.User}>
          <h2>{usuario}</h2>
        </div>
        <div className={Style.imageWrapper}>
          <img src={imagemPet} alt="Imagem do Pet" className={Style.petImage} />
        </div>
        <div className={Style.infospost}>
          <h3>{nomePet}</h3>
          <ul>
            <li>{caracteristicas}</li>
            <br />
            <span>Visto pela ultima vez: </span>
            <li>{dataSumico}</li>
            <li>{regiao}</li>
          </ul>
        </div>
        <div className={Style.Botoes}>
          <button className={Style.apagar}>Apagar</button>
          <button className={Style.editar} /* onClick={} */>Editar</button>
        </div>
      </div>
    </div>
  );
}

export default PostsUser;
