   import Logo_Cachorro from "./../imgs/Logo_Cachorro.png"
   import Icone from "./..imgs/Icone.png"
   
   function HeaderLog(){
        return <div>
            <header>
            <img src={Logo_Cachorro} alt="Logo com um cachorro peludo usando uma lupa" width="500px"/>
            <img src={Icone} alt="Icone de usuário sem foto" />
            </header>
        </div>
    }
    export default HeaderLog