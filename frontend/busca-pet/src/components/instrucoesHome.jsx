import style from "../components/styles/instrucoesHome.module.css";

function ComoFunciona({ text_instrucao, text_explicacao }) {
  return (
    <div>
      <section className={style.sectionexplicacao}>
        <p className={style.p_titulo}>{text_instrucao}</p>
        <p className={style.p}>{text_explicacao}</p>
      </section>
    </div>
  );
}

export default ComoFunciona;
