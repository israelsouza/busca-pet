   import Logo_Cachorro from "./../assets/imgs/Logo_Cachorro.png"
   import Icone from "./../assets/imgs/Icone.png"

   function HeaderLog(){
        return <div>

            <header>

           <img className="logodog" src={Logo_Cachorro} alt="Logo com um cachorro peludo usando uma lupa" width="100px"/>
        <nav>
                <a href="">Todos</a>
                <a href="">Achados</a>
                <a href="">Perdidos</a>
                <a href="">Pesquisar</a>
        </nav>
           <img className="icon" src={Icone} alt="Icone de usuário sem foto" width="55px" height="55px" />

            </header>

        </div>
    }
    export default HeaderLog
