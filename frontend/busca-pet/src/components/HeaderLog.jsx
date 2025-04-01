   import Logo_Cachorro from "./../assets/imgs/Logo_Cachorro.png"
   import Icone from "./../assets/imgs/Icone.png"
   import style from './styles/header_log.module.css'
   import { Link } from "react-router-dom"

   function HeaderLog(){
        return( 
        <div>
            <header className={style.header_logado}>

            <Link to={'/posts/todos'}>
                <img className={style.logodog} src={Logo_Cachorro} alt="Logo com um cachorro peludo usando uma lupa" width="150px"/>
            </Link>
                <nav className={style.navegation}>
                    <a className={style.links_header}>Todos</a>
                    <a className={style.links_header}>Achados</a>
                    <a className={style.links_header}>Perdidos</a>
                    <a className={style.links_header}>Pesquisar</a>
                </nav>
                
                <img className={style.icon} src={Icone} alt="Icone de usuário sem foto"  />

            </header>
        </div>
        )
    }
    export default HeaderLog
