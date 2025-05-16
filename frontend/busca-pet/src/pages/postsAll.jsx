import {  useState, useEffect, useCallback }  from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Buttonposts from "../components/button_posts";
import HeaderLog from "../components/HeaderLog";
import useWebSocket from "../assets/utils/useWebSocket.js";
import validateToken from '../assets/utils/validateToken.js'
import enviarDados from "../assets/utils/enviarDados.js";

import style from "./styles/postsAll.module.css";

function PostsAll() {
    const navigate = useNavigate()
    const token = localStorage.getItem("authToken");
    const websocketUrl = `ws://localhost:3000?token=${token}`;
    const { socket, messages, sendMessage } = useWebSocket(websocketUrl);
    const [notificacoesRecebidas, setNotificacoesRecebidas] = useState([]);

    const exibirNotificacao = useCallback((notificacao) => {
        console.log('Notificação de pet encontrado recebida:', notificacao.message);
        alert(`Nova notificação: ${notificacao.message}`);
    }, []);

    useEffect(() => {
        const petEncontradoNotifications = messages.filter(msg => msg.type === 'pet_encontrado');

        if (petEncontradoNotifications.length > 0) {
            petEncontradoNotifications.forEach(notificacao => {
                exibirNotificacao(notificacao);
            });
            setNotificacoesRecebidas(prev => {
                // Use uma função de atualização para evitar problemas de stale closures
                const novasNotificacoes = petEncontradoNotifications.filter(
                (notificacao) => !prev.some(n => JSON.stringify(n) === JSON.stringify(notificacao))
            );
            return [...prev, ...novasNotificacoes];
        });
        }
    }, [messages, exibirNotificacao, setNotificacoesRecebidas]);

    
    
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
             const headerRequest = {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                }
            if (category === 'all') {
                const response = await fetch('http://localhost:3000/api/posts/all', headerRequest );
                const data = await response.json();                
                const post = data.posts;
                setPosts(data.posts); 
            } else if (category === 'lost') {                
                const response = await fetch('http://localhost:3000/api/posts/lost', headerRequest);                
                const data = await response.json();
                const post = data.posts;
                setLostPosts(data.posts);
            } else if (category === 'found') {                
                const response = await fetch('http://localhost:3000/api/posts/found', headerRequest);
                const data = await response.json();
                const post = data.posts;
                setFoundPosts(data.posts);
            }
        }
        fetchPosts();
    }, [category]);

    async function umaFuncao(idUsuarioB) {
        const user = {
            idPost: idUsuarioB,
        }
        const result = await enviarDados(user, `api/posts/quem-publicou`);
        console.log(result)
    }
    

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
                    </div>
                </div>
                <div className={style.posts}>
                    
                <div className={style.containerPosts}>
                {category === 'all' && posts.map((post, index) => (
                    <Buttonposts 
                        key={post.POS_ID}
                        usuario={post.PES_NOME}
                        imagemUsuario={post.USU_FOTO}
                        imagemPet={post.PET_FOTO}
                        nomePet={post.PET_NOME}
                        caracteristicas={post.PET_DESCRICAO}
                        dataSumico={post.POS_DATA}
                        regiao={post.PET_LOCAL}
                        textoPrimeiroCategoria={post.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                        disparaUmaNotificacao={() => { umaFuncao(post.POS_ID)}}
                    />
                ))}
                
                {category === 'lost' && lostPosts.map((post, index) => (
                    <Buttonposts 
                        key={post.POS_ID}
                        usuario={post.PES_NOME}
                        imagemUsuario={post.USU_FOTO}
                        imagemPet={post.PET_FOTO}
                        nomePet={post.PET_NOME}
                        caracteristicas={post.PET_DESCRICAO}
                        dataSumico={post.POS_DATA}
                        regiao={post.PET_LOCAL}
                        textoPrimeiroCategoria={post.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                        disparaUmaNotificacao={umaFuncao(post.POS_ID)}
                    />
                ))}
                {category === 'found' && foundPosts.map((post, index) => (
                    <Buttonposts 
                        key={post.POS_ID}
                        usuario={post.PES_NOME}
                        imagemUsuario={post.USU_FOTO}
                        imagemPet={post.PET_FOTO}
                        nomePet={post.PET_NOME}
                        caracteristicas={post.PET_DESCRICAO}
                        dataSumico={post.POS_DATA}
                        regiao={post.PET_LOCAL}
                        textoPrimeiroCategoria={post.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                        disparaUmaNotificacao={umaFuncao}
                    />
                ))}
                </div>
                </div>
            </div>
        </div>
    );
}


export default PostsAll;

