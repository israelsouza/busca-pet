import { Link, Links } from "react-router-dom";
import Logo_Cachorro from "../assets/imgs/Logo_Cachorro.png";
import style from "./styles/home.module.css";
import ButtonHome from "../components/ButtonHome";



function Home(){
    return (
            <>
            <div className={style.header}>
                <img src={Logo_Cachorro} alt="Logo de um cachorro com uma lupa" />
                <nav>
                    <ul>
                        <Link>Inicio</Link>
                        <Link>Rencontros</Link>
                        <Link>Como Funciona</Link>
                        <Link>Colabore</Link>

                    </ul>
                </nav>
                <ButtonHome text_home="Cadastrar" path="/form/cadastro"/> 
                <ButtonHome text_home="Login" path="/form/login"/> 
            </div>
            </>

    )
} 

export default Home;