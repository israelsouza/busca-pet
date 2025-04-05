import { Link, useNavigate } from "react-router-dom";
import Logo_Cachorro from "../assets/imgs/Logo_Cachorro.png";
import style from "./styles/home.module.css";
import ButtonHome from "../components/ButtonHome";
import home from "../assets/imgs/home.png";
import Ellipse_home from "../assets/imgs/Ellipse_home.png";
import AvaliacaoHome from "../components/AvaliacaoHome.jsx";
import ComoFunciona from "../components/instrucoesHome.jsx";
import abraco_dogHome from "../assets/imgs/abraco_dogHome.png";
import footer_home from "../assets/imgs/footer_home.png";
import { useEffect, useRef } from "react";



    



function Home(){
        const navigate = useNavigate();
        const sessaoColaborar = useRef(null);
        
        // bloco 01
        const sessaoReencontros = useRef(null);
        useEffect(() => {
            if (window.location.hash === "#reencontros") {
                sessaoReencontros.current?.scrollIntoView({ behavior: "smooth" });
            }
        }, [window.location.hash]);
        const irParaReencontros = () => {
            navigate("#reencontros", { replace: true });
            sessaoReencontros.current?.scrollIntoView({ behavior: "smooth" });
          };


        // bloco 02
        const sessaoFuncionamento = useRef(null);
        useEffect(() => {
            console.log('entrei aqui')
           if(window.location.hash === "#funcionamento"){
              sessaoFuncionamento.current?.scrollIntoView({ behavior: "smooth" })
          }
          }, [window.location.hash]);
       
        const irParaFuncionamento = () => {
            navigate("#funcionamento", { replace: true });
            sessaoFuncionamento.current?.scrollIntoView({ behavior: "smooth" });
          };



          const irParaColabore = () => {
            navigate("#colabore", { replace: true });
            sessaoColaborar.current?.scrollIntoView({ behavior: "smooth" });
          };
      
    return (
            <>
            <div className={style.header}>
                <img src={Logo_Cachorro} alt="Logo de um cachorro com uma lupa" width="150px"/>
            <div className={style.container_header}>
                <nav>
                    <ul className={style.ul}>
    
                        <Link  className={style.linkhome} onClick={irParaReencontros}>Reencontros</Link>
                        <Link  className={style.linkhome} onClick={irParaFuncionamento}>Como Funciona</Link>
                        <Link  className={style.linkhome} onClick={irParaColabore}>Colabore</Link>
                    </ul>
                </nav>
                <ButtonHome text_home="Cadastrar" path="/form/cadastro-usuario"/> 
                <ButtonHome text_home="Login" path="/form/login"/> </div>
            </div>

        <div>
            <img src={home} alt="Mulher segurando cachorro no alto" className={style.home_principal}/>
            <div className={style.text_img}>
            <h1 className={style.h1}>Juntos por eles!</h1>
            <p className={style.p}>Encontre seu pet perdido ou ajude a reunir famílias.</p>
            <p className={style.p}>Cadastre, busque e traga esperança para quem precisa!</p>
        </div>

        <div id="reencontros" ref={sessaoReencontros}>
            <h2 className={style.h2}>Reencontros de sucesso</h2>
            <div className={style.containerAvaliacoes} >
            <AvaliacaoHome image_perfil={Ellipse_home} usuario_text="Ana Paula, SP" avaliacao_text="Graças ao site, reencontrei meu cachorro em apenas dois dias! A comunidade é incrível e ajudou a espalhar a mensagem."/>
            <AvaliacaoHome image_perfil={Ellipse_home} usuario_text="Ana Paula, SP" avaliacao_text="Graças ao site, reencontrei meu cachorro em apenas dois dias! A comunidade é incrível e ajudou a espalhar a mensagem."/>
            <AvaliacaoHome image_perfil={Ellipse_home} usuario_text="Ana Paula, SP" avaliacao_text="Graças ao site, reencontrei meu cachorro em apenas dois dias! A comunidade é incrível e ajudou a espalhar a mensagem."/>
            </div>
        </div>

        <div id="funcionamento" ref={sessaoFuncionamento}>
            <h3 className={style.h3}>Como Funciona</h3>
            <div>
            <ComoFunciona  text_instrucao="1 - Cadastre-se" text_explicacao="Crie uma conta em poucos passos e tenha acesso à nossa plataforma. Com seu cadastro, você poderá registrar pets perdidos ou encontrados e se conectar com outras pessoas que possam ajudar."/>
            <ComoFunciona  text_instrucao="2 - Faça uma publicação" text_explicacao="Insira as informações do pet, como nome, raça, cor e local onde foi perdido ou encontrado. Adicione fotos para facilitar a identificação e aumente as chances de um reencontro rápido."/>
            <ComoFunciona  text_instrucao="3 - Fique de olho em seu e-mail" text_explicacao="Quando alguém encontrar um pet semelhante ao que você cadastrou ou quiser entrar em contato sobre um animal encontrado, você receberá uma notificação por e-mail. Fique atento para não perder nenhuma atualização!"/>
            </div>
        </div>

        <div id="colabore" ref={sessaoColaborar}>
            <article className={style.article}>
                <h4 className={style.h4}>Ajude Mais Pets!</h4>
                <div className={style.article_text}>
                    <p className={style.p1}>Seu engajamento faz a diferença! Compartilhe nosso site com amigos, vizinhos e grupos locais. Quanto mais pessoas participarem, maior a chance de reencontros felizes.</p>
                    <img src={abraco_dogHome} alt="Mulher agachada abraçando carinhosamente um cachorro" className={style.abraco_dogHome}/>
                </div>
            </article>
            <div className={style.container_footer}>
                <div className={style.overlay}></div>
                <p className={style.p_footer}>Todos os Direitos Reservados</p>
                <img src={footer_home} alt="Imagem de Rodapé com patas de animais" className={style.footer_home}/>
            </div>
        </div>
    </div>            
            </>

    )
} 

export default Home;