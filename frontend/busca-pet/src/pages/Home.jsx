import { Link, Links } from "react-router-dom";
import Logo_Cachorro from "../assets/imgs/Logo_Cachorro.png";
import style from "./styles/home.module.css";
import ButtonHome from "../components/ButtonHome";



function Home(){
    return (
            <>
            <div className={style.header}>
                <img src={Logo_Cachorro} alt="Logo de um cachorro com uma lupa" width="150px"/>
            <div className={style.container_header}>
                <nav>
                    <ul className={style.ul}>
                        <Link className={style.linkhome}>Inicio</Link>
                        <Link  className={style.linkhome}>Rencontros</Link>
                        <Link  className={style.linkhome}>Como Funciona</Link>
                        <Link  className={style.linkhome}>Colabore</Link>

                    </ul>
                </nav>
                <ButtonHome text_home="Cadastrar" path="/form/cadastro"/> 
                <ButtonHome text_home="Login" path="/form/login"/> </div>
            </div>
            </>

    )
} 

export default Home;