import HeaderLog from "../components/HeaderLog";
import icon_conta from "../assets/imgs/icon_conta.png";
import icon_notificacoes from "../assets/imgs/icon_notificacoes.png";
import BotaoSection from "../components/ButtonSection";
import icon_publicacoes from "../assets/imgs/icon_publicacoes.png";
import avatar_usuario from "../assets/imgs/avatar_usuario.png";
import ButtonSection from "../components/ButtonSection";
import Style from "../pages/styles/PerfilVisualizar.module.css";
import fundo_pato from "../assets/imgs/fundo_pato.png";
function VisualizePerfil(){    
        return <div>
            <HeaderLog />
            <div className={Style.container}>
            <div className={Style.FotoDivisao}></div>
                <section className={Style.perfilSection}>   
                    <article className={Style.cabecalho}>
                    <img src={avatar_usuario} alt="icone de foto de usuário" />
                    <div className={Style.namecontainer}>
                    <h1 className={Style.h1}>User 1</h1>
                    <h2 className={Style.h2}>Nome Exemplo do Usuário</h2>
                    </div>
                    </article>
                    <BotaoSection img_icone={icon_conta} nome_section="Conta" alt="Icone de perfil" text_section="Informações de contato e endereço." acesso="" />
    
                    <BotaoSection img_icone={icon_notificacoes} nome_section="Notificações" alt="Icone de notificações" text_section="Informações Veja quem interagiu com sua publicação." acesso=""/>

                    <BotaoSection img_icone={icon_publicacoes} nome_section="Publicações" alt="Icone de imagens" text_section="Veja suas próprias publicações." acesso=""/>
                </section>
                
            </div>

            </div>
}

export default VisualizePerfil;