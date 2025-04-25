import Buttonposts from "../components/button_posts"; 
import HeaderLog from "../components/HeaderLog";
import React, { useState, useEffect } from "react";
import style from "./styles/postsAll.module.css"; // você pode usar o mesmo estilo
import { validateToken } from "../assets/utils/validateToken";

function PostsUser() {
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        async function fetchUserPosts() {
            const response = await fetch('/api/posts/user/1'); // <-- substitua 1 pelo ID do usuário, se for dinâmico
            const data = await response.json();
            setUserPosts(data);
        }

        fetchUserPosts();
    }, []);

    return (
        <div className={style.container}>
            <HeaderLog />
            <div className={style.opcaoContainer}>
                <div className={style.headopcoes}>
                    <h1 className={style.h1}>Minhas Publicações</h1>
                </div>
                <div className={style.posts}>
                    {userPosts.map((post, index) => (
                        <Buttonposts 
                            key={index}
                            usuario={post.PES_NOME}
                            imagemUsuario={post.USU_FOTO}
                            imagemPet={post.PET_FOTO}
                            nomePet={post.PET_NOME}
                            caracteristicas={post.PET_DESCRICAO}
                            dataSumico={post.POS_DATA}
                            regiao={post.PET_LOCAL}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostsUser;
