import Buttonposts from "../components/button_posts";
import HeaderLog from "../components/HeaderLog";
import React, {  useState, useEffect } from "react";
import style from "./styles/postsAll.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import validateToken from '../assets/utils/validateToken.js'

function PostsAll() {
    const navigate = useNavigate()
    
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [lostPosts, setLostPosts] = useState([]);
    const [foundPosts, setFoundPosts] = useState([]);
    const [category, setCategory] = useState('all');

      
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
              await validateToken();
            } catch (error) {
              console.error("Erro capturado:", error.message);
              alert(error.message); 
              localStorage.removeItem("authToken");
              navigate("/form/login");
            }
          };
          checkAuthentication();
    }, [navigate]);

    useEffect(() => {
        async function fetchPosts() {
            const token = localStorage.getItem("authToken");
            if (category === 'all') {
                const response = await fetch('http://localhost:3000/api/posts/all');
                const data = await response.json();
                const post = data.posts;
                setPosts(data.posts); 
            } else if (category === 'user') {
                // console.log('user')
                // const response = await fetch(`http://localhost:3000/api/posts/user/${token}`);
                // console.log(response)
                // const data = await response.json();
                // console.log(data)
                // setUserPosts(data.posts);
            } else if (category === 'lost') {                
                const response = await fetch('http://localhost:3000/api/posts/lost');                
                const data = await response.json();
                const post = data.posts;
                setLostPosts(data.posts);
            } else if (category === 'found') {                
                const response = await fetch('http://localhost:3000/api/posts/found');
                const data = await response.json();
                const post = data.posts;
                setFoundPosts(data.posts);
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
                            {/* <Link to={'/posts/all?category=user'} onClick={() => setCategory('user')}>
                                <button className={style.button} >Verificar Pet que eu publiquei</button>
                            </Link> */}
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
                        textoPrimeiroCategoria={post.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
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
                        textoPrimeiroCategoria={post.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                    />
                ))}
                {category === 'found' && foundPosts.map((post, index) => (
                    <Buttonposts 
                        key={index}
                        usuario={post.PES_NOME}
                        imagemUsuario={post.USU_FOTO}
                        imagemPet={post.PET_FOTO}
                        nomePet={post.PET_NOME}
                        caracteristicas={post.PET_DESCRICAO}
                        dataSumico={post.POS_DATA}
                        regiao={post.PET_LOCAL}
                        textoPrimeiroCategoria={post.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                    />
                ))}
                </div>
            </div>
        </div>
    );
}


export default PostsAll;

