import dog_post from "../assets/imgs/dog_post.png";
import avatar_usuario from "../assets/imgs/avatar_usuario.png";
import Buttonposts from "../components/button_posts.module";
import HeaderLog from "../components/HeaderLog";
import dog_footerPosts from "../assets/imgs/dog_footerPosts.png";
import style from "./styles/postsAll.module.css";
import { Link } from "react-router-dom";

function PostsAll() {
    return (
        <div>
            <HeaderLog />
            <div className={style.opcaoContainer}>
                <div className={style.headopcoes}>
                    <h1 className={style.h1}>Todos os Pets</h1>
                        <div className={style.buttoncontainer}>
                            <Link to={'/posts/criar-post'} >
                                <button id="link-btn" className={style.button}>Adicionar Pet encontrado/perdido</button>
                            </Link>
                            <button className={style.button}>Verificar Pet que eu publiquei</button>
                        </div>
                </div>
                <div className={style.posts}>
                    <Buttonposts  />
                    <Buttonposts  />
                </div>
            </div>

            <div className={style.footercontainer}>
                <img src={dog_footerPosts} alt="Topo da cabeça de um cachorro apresentando seu focinho, olhos e orelhas" height="200px" />
            </div>
        </div>
    );
}

export default PostsAll;
