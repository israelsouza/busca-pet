import dog_post from "../assets/imgs/dog_post.png";
import avatar_usuario from "../assets/imgs/avatar_usuario.png";
import Buttonposts from "../components/button_posts";
import HeaderLog from "../components/HeaderLog";
import dog_footerPosts from "../assets/imgs/dog_footerPosts.png";
import style from "./styles/postsAll.module.css";

function TodosPets() {
    return (
        <div className={style.container}>
            <HeaderLog />
            <div className={style.opcaoContainer}>
                <div className={style.headopcoes}>
                    <h1 className={style.h1}>Todos os Pets</h1>
                        <div className={style.buttoncontainer}>
                            <button className={style.button}>Adicionar Pet encontrado/perdido</button>
                            <button className={style.button}>Verificar Pet que eu publiquei</button>
                        </div>
                </div>
                <div className={style.posts}>
                    <Buttonposts />
                    <Buttonposts />
                </div>
            </div>
        </div>
    );
}

export default TodosPets;
