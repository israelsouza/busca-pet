import styles from "../components/styles/AvaliacaoHome.module.css";

function AvaliacaoHome({image_perfil, usuario_text, avaliacao_text }){
    return <div>
        <section>
            <img src={image_perfil} alt="Elipse Preta de Perfil de usuário"/>
        </section>
    </div>
}

export default AvaliacaoHome;