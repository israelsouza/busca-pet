import { Link, Links } from "react-router-dom";
import Logo_Cachorro from "../assets/imgs/Logo_Cachorro.png";
import style from "./styles/home.module.css";
import ButtonHome from "../components/ButtonHome";
import home from "../assets/imgs/home.png";
import Ellipse_home from "../assets/imgs/Ellipse_home";
import AvaliacaoHome from "../components/AvaliacaoHome";

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

            <div>
                <img src={home} alt="Mulher segurando cachorro no alto" className={style.home_principal}/>
                <div className={style.text_img}>
                    <h1 className={style.h1}>Juntos por eles!</h1>
                    <p className={style.p}>Encontre seu pet perdido ou ajude a reunir famílias.</p>
                    <p className={style.p}>Cadastre, busque e traga esperança para quem precisa!</p>
                </div>
                <div>
                    <h2>Reencontros de sucesso</h2>
 {/*               <AvaliacaoHome> </AvaliacaoHome>  */}
                </div>
            </div>            
            </>

    )
} 

export default Home;