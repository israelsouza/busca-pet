import { Link } from "react-router-dom"

import Logo_Cachorro from "./../assets/imgs/Logo_Cachorro.png"
import Icone from "./../assets/imgs/Icone.png"

import style from './styles/header_log.module.css'

function HeaderLog({onSelectCategory}){
    return( 
    <div>
        <header className={style.header_logado}>

        <Link to={'/posts/all'} onClick={() => onSelectCategory('all')}>
            <img className={style.logodog} src={Logo_Cachorro} alt="Logo com um cachorro peludo usando uma lupa" width="150px"/>
        </Link>
            <nav className={style.navegation}>
                <Link to={'/posts/all?category=all'} onClick={() => onSelectCategory('all')}  className={style.links_header}>Todos</Link>
                <Link to={'/posts/all?category=found'} onClick={() => onSelectCategory('found')} className={style.links_header}>Achados</Link>
                <Link to={'/posts/all?category=lost'} onClick={() => onSelectCategory('lost')} className={style.links_header}>Perdidos</Link>
                <Link to={'/posts/pesquisa'} className={style.links_header}>Pesquisar</Link>
            </nav>
            
            <Link to={'/Perfil'} ><img className={style.icon} src={Icone} alt="Icone de usuário sem foto"  /></Link>

        </header>
    </div>
    )
}

export default HeaderLog;
