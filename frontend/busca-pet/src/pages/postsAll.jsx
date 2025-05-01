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

    const getEmailFromToken = () => {
        const token = localStorage.getItem("authToken"); // Obtém o token do localStorage

        try {
            const decoded = jwtDecode(token); // Decodifica o token
            return decoded.email; // Retorna o e-mail do payload
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            return null;
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
              await validateToken();
            } catch (error) {
              console.error("Erro capturado:", error.message);
              alert(error.message); // Exibe a mensagem de erro para o usuário
              localStorage.removeItem("authToken"); // Remove o token inválido
              navigate("/form/login"); // Redireciona para o login
            }
          };
          checkAuthentication();
    }, [navigate]);

    useEffect(() => {
        async function fetchPosts() {
            const email = getEmailFromToken();
            if (category === 'all') {
                console.log('all')
                const response = await fetch('http://localhost:3000/api/posts/all');
                console.log(response) // retono do backend com array e os dados
                
                const data = await response.json();
                setPosts(data.posts); //comentar com a Sabrina para so ter um setPosts
                console.log(data.posts)
            } else if (category === 'user') {
                console.log('user')
                const response = await fetch('http://localhost:3000/api/posts/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                });
                const data = await response.json();
                setUserPosts(data.posts);
            } else if (category === 'lost') {
                console.log('lost')
                const response = await fetch('http://localhost:3000/api/posts/lost');
                console.log(response)
                const data = await response.json();
                console.log(data)
                setLostPosts(data.posts);
            } else if (category === 'found') {
                console.log('found')
                const response = await fetch('http://localhost:3000/api/posts/found');
                const data = await response.json();
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
                            <Link to={'/posts/all?category=user'} onClick={() => setCategory('user')}>
                                <button className={style.button} >Verificar Pet que eu publiquei</button>
                            </Link>
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
