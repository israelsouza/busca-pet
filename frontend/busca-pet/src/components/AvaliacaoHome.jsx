import style from "../components/styles/AvaliacaoHome.module.css";

function AvaliacaoHome({ image_perfil, usuario_text, avaliacao_text }) {
  return (
    <div className={style.containerAvalia}>
      <section className={style.section}>
        <div className={style.boxImage}>
          <img
            src={image_perfil}
            alt="Elipse Preta de Perfil de usuário"

          />
        </div>
        
        <div className={style.containerText}>
          <p className={style.usuario_text}>{usuario_text}</p>
          <p className={style.avaliacao_text}>{avaliacao_text}</p>
        </div>
      </section>
    </div>
  );
}

export default AvaliacaoHome;
