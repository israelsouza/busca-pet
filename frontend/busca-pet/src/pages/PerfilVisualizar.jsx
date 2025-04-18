import HeaderLog from "../components/HeaderLog";
import icon_conta from "../assets/imgs/icon_conta.png";
import icon_notificacoes from "../assets/imgs/icon_notificacoes.png";
import BotaoSection from "../components/ButtonSection";
import icon_publicacoes from "../assets/imgs/icon_publicacoes.png";
import avatar_usuario from "../assets/imgs/avatar_usuario.png";
import ButtonSection from "../components/ButtonSection";
function VisualizePerfil(){    
        return <div>
            <HeaderLog />
                <div className="FotoDivisao">

                </div>
                <section>
                    <article>
                    <img src={avatar_usuario} alt="icone de foto de usuário" />
                    <h1>User 1</h1>
                    <h2>Nome Exemplo do Usuário</h2>
                    <BotaoSection img_icone={icon_conta} nome_section="Conta" alt="Icone de perfil" text_section="Informações de contato e endereço." acesso="" />
                    </article>
                        <BotaoSection img_icone={icon_notificacoes} nome_section="Notificações" alt="Icone de notificações" text_section="Informações Veja quem interagiu com sua publicação." acesso=""/>
                  
                    <article>
                        <BotaoSection img_icone={icon_publicacoes} nome_section="Publicações" alt="Icone de imagens" text_section="Veja suas próprias publicações." acesso=""/>
                    </article>
                </section>

            </div>
}

export default VisualizePerfil;