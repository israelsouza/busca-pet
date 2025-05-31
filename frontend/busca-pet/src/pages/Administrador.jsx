import ButtonAdm from '../components/ButtonAdm';
import HeaderForm from '../components/HeaderForm';
import Style from '../pages/styles/tela_adm.module.css';
import React from 'react'; 
import icon_publicacoes from '../assets/imgs/icon_publicacoes.png';
import icon_denuncias from '../assets/imgs/icon_denuncia.png';
import icone from '../assets/imgs/icone.png';
function TelaAdm(){
    return(
        <div className={Style.ContainerMain}>
            <div className={Style.ContainerHead}>
                <HeaderForm/>
            </div>
            <div className={Style.ContainerBody}>
                <h1 className={Style.H1}>Gerenciamento</h1>
            </div>
            <div className={Style.ContainerFuncoes}>
                <ButtonAdm image={icon_publicacoes} alt='Publicações' funcao="Publicações"/>
                <ButtonAdm image={icon_denuncias} alt='Denúncias' funcao="Denúncias" />
                <ButtonAdm image={icone} alt='Usuários' funcao="Usuários" link='/adm/usuarios'/>
            </div>

            <div className={Style.footer}>
                <button className={Style.botaoSair}>
                    Sair
                </button>
            </div>
        </div>
    )
}

export default TelaAdm;