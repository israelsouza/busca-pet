   import Logo_Cachorro from "./../imgs/Logo_Cachorro.png"
   import Icone from "./../imgs/Icone.png"

   function HeaderLog(){
        return <div>
            <header>
            <img className="logodog" src={Logo_Cachorro} alt="Logo com um cachorro peludo usando uma lupa" width="500px"/>
            <img className="icon" src={Icone} alt="Icone de usuário sem foto" width="70px" height="70px" />
            <button>Todos</button>
            <button>Achados</button>
            <button>Perdidos</button>
            <button>Pesquisar</button>
            </header>

        </div>
    }
    export default HeaderLog
