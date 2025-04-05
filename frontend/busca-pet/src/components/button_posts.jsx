import style from "../components/styles/button_posts.module.css";
import avatar_usuario from "../assets/imgs/avatar_usuario.png"
import dog_post from "../assets/imgs/dog_post.png"
function Buttonposts() {
    return (
        <div className={style.postcontainer}>
            <div className={style.postbody}>
                <div className={style.user}>
                <img src={avatar_usuario} alt="Imagem de perfil sem foto" width="50px" className={style.userAvatar} />
                <h2>User 01</h2>
                </div>

                <img src={dog_post} alt="Cachorro encontrado" width="250px" />

                <div className={style.infospost}>
                    <h3>Nome do Pet</h3>
                    <ul>
                        <li>Características</li>
                        <li>Data que Sumiu</li>
                        <li>Região</li>
                    </ul>
                </div>
            <div className={style.buttoninteragir}>
                <button  className={style.envmsg}>Enviar Mensagem</button>
                <button className={style.encontrarpet}>Encontrar seu Pet!</button>
            </div>
            </div>
        </div>
    );
}

export default Buttonposts;
