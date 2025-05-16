import { Link } from "react-router-dom"

import Logo_Cachorro from "./../assets/imgs/Logo_Cachorro.png"

import style from './styles/HeaderEdicao.module.css';

function HeaderEdicao(){
     return( 
        <div>
            <header className={style.header_logado}>

            <Link to={'/posts/all'}>
                <img 
                    className={style.logodog} 
                    src={Logo_Cachorro} 
                    alt="Logo com um cachorro peludo usando uma lupa" 
                    width="150px"
                />
            </Link>
                <nav className={style.navegation}>
                        <Link to={'/posts/all?category=all'} className={style.links_header}>Todos</Link>
                        <Link to={'/posts/all?category=lost'} className={style.links_header}>Achados</Link>
                        <Link to={'/posts/all?category=found'} className={style.links_header}>Perdidos</Link>
                        <Link to={'/posts/pesquisa'} className={style.links_header}>Pesquisar</Link>
                </nav>
            </header>
        </div>
     )
 }
 export default HeaderEdicao
