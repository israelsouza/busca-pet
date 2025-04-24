import Buttonposts from "../components/button_posts";
import HeaderLog from "../components/HeaderLog";
import React, {  useState, useEffect } from "react";
import style from "./styles/postsAll.module.css";
import { Link } from "react-router-dom";
import { validateToken } from "../assets/utils/validateToken";
import { useNavigate } from "react-router-dom";

function PostsAll() {
    
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [lostPosts, setLostPosts] = useState([]);
    const [foundPosts, setFoundPosts] = useState([]);
    const [category, setCategory] = useState('all');

    useEffect(() => {
        async function fetchPosts() {
            if (category === 'all') {
                const response = await fetch('/api/posts/all');
                const data = await response.json();
                setPosts(data);
            } else if (category === 'user') {
                const response = await fetch('/api/posts/user/1');
                const data = await response.json();
                setUserPosts(data);
            } else if (category === 'lost') {
                const response = await fetch('/api/posts/lost');
                const data = await response.json();
                setLostPosts(data);
            } else if (category === 'found') {
                const response = await fetch('/api/posts/found');
                const data = await response.json();
                setFoundPosts(data);
            }
        }
        fetchPosts();
    }, [category]);

    return (
        <div className={style.container}>
            <HeaderLog onSelectCategory={setCategory} />
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
                    
                {category === 'all' && posts.map((post, index) => (
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
                {category === 'lost' && lostPosts.map((post, index) => (
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
                {category === 'found' && foundPosts.map((post, index) => (
                    <Buttonposts 
                        key={index}
                        usuario={post.PES_NOME}
                        imagemUsuario={`data:image/jpeg;base64,${post.USU_FOTO}`}
                        imagemPet={`data:image/jpeg;base64,${post.PET_FOTO}`}
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

export default PostsAll;
