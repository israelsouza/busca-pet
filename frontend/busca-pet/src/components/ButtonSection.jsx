import Style from "../components/styles/ButtonSection.module.css";

function BotaoSection({ nome_section, text_section, img_icone, alt, acesso}) {
    return (
      <div className={Style.container_section}>
        <div className={Style.conteudo_section}>
          <img src={img_icone} alt={alt} className={Style.img} />
          <h3 className={Style.h3}>{nome_section}</h3>
        </div>
        <p className={Style.texto_desc}>{text_section}</p>
        <a href={acesso} className={Style.acesso}> Acessar 🔗</a>
      </div>
    );
  }
  
export default BotaoSection;