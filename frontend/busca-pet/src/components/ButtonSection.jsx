import { Link } from "react-router-dom";

import Style from "../components/styles/ButtonSection.module.css";

function BotaoSection({ nome_section, text_section, img_icone, alt, acesso }) {
  return (
    <div className={Style.container_section}>
      <div className={Style.conteudo_section}>
        <img src={img_icone} alt={alt} className={Style.img} />
        <h3 className={Style.h3}>{nome_section}</h3>
      </div>
      <p className={Style.texto_desc}>{text_section}</p>
      <Link to={acesso} className={Style.acesso}>
        Acessar 🔗
      </Link>
    </div>
  );
}

export default BotaoSection;
