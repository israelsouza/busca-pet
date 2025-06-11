import { Link } from "react-router-dom";

import logo from "../assets/imgs/Logo_Cachorro.png";

import style from "./styles/headerform.module.css";

function HeaderForm() {
  return (
    <div className={style["header-form"]}>
      <Link>
        <img src={logo} alt="Imagem de um cachorro com uma lupa" />
      </Link>

      <h1>BuscaPet</h1>
    </div>
  );
}

export default HeaderForm;
