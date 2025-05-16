import { Link } from "react-router-dom";

import style from "./styles/buttonhome.module.css";

function ButtonHome({ text_home, path }) {
  return (
    <Link className={style.linkhome} to={path}>
      <button className={style.buttonhome}>{text_home}</button>
    </Link>
  );
}

export default ButtonHome;
