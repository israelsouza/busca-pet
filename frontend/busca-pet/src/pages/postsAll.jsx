// pages/PostsAll.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";

import Buttonposts from "../components/button_posts";
import HeaderLog from "../components/HeaderLog";
import useWebSocket from "../assets/utils/useWebSocket.js";
import validateToken from '../assets/utils/validateToken.js';
import enviarDados from "../assets/utils/enviarDados.js"; // Importe a sua função enviarDados
import MapGoogleComponent from '../components/MapGoogleComponent'
import ModalDenuncia from "../components/ModalDenuncias.jsx"; // Importe o modal com o nome correto

import style from "./styles/postsAll.module.css";

function PostsAll() {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const websocketUrl = `ws://localhost:3000?token=${token}`;
    const { socket, messages, sendMessage } = useWebSocket(websocketUrl);
    const [notificacoesRecebidas, setNotificacoesRecebidas] = useState([]);


    const [mostrarModal, setMostrarModal] = useState(false);
    const [currentPetIdToDenounce, setCurrentPetIdToDenounce] = useState(null);

    const exibirNotificacao = useCallback((notificacao) => {
        console.log('Nova notificação recebida:', notificacao.message);

        if (notificacao.type === 'novaDenuncia') {
            alert(`Nova denúncia: ${notificacao.message}`);
        } else if (notificacao.type === 'petEncontrado') {
            alert(`Nova notificação de pet encontrado: ${notificacao.message}`);
        }
     
    }, []);

    useEffect(() => {
        messages.forEach(message => {
       
            if (message.type === 'novaDenuncia' || message.type === 'petEncontrado' || message.type === 'notification') {
                exibirNotificacao(message);
                setNotificacoesRecebidas(prev => {
                    const isNew = !prev.some(n => JSON.stringify(n) === JSON.stringify(message));
                    return isNew ? [...prev, message] : prev;
                });
            }
        });

        }, [messages, exibirNotificacao, setNotificacoesRecebidas]);

    
    // }, [messages, exibirNotificacao]);
    
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [lostPosts, setLostPosts] = useState([]);
    const [foundPosts, setFoundPosts] = useState([]);
    const [category, setCategory] = useState('all');
    const [modalMap, setModalMap] = useState('close');
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
      
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await validateToken();
            } catch (error) {
                console.error("Erro de autenticação:", error.message);
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
            };
            try {
                let response;
                if (category === 'all') {
                    response = await fetch('http://localhost:3000/api/posts/all', headerRequest);
                } else if (category === 'lost') {
                    response = await fetch('http://localhost:3000/api/posts/lost', headerRequest);
                } else if (category === 'found') {
                    response = await fetch('http://localhost:3000/api/posts/found', headerRequest);
                } else {
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
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
                
                if (category === 'all') setPosts(data.posts);
                else if (category === 'lost') setLostPosts(data.posts);
                else if (category === 'found') setFoundPosts(data.posts);

            } 
        }
            catch (error) {
                console.error('Erro ao buscar posts:', error);
            }
        }
        fetchPosts();
    }, [category]);

    const handleDenunciarClick = (petId) => {
        setCurrentPetIdToDenounce(petId);
        setMostrarModal(true);
    };


    const handleSubmitDenuncia = async ({ tipo, descricao, petId }) => {
        try {
            const token = localStorage.getItem("authToken");
            const denunciaData = {
                tipo: tipo,
                descricao: descricao,
                petId: petId
            };
            
            const url = 'http://localhost:3000/api/denunciar';
            const res = await enviarDados(denunciaData, url, 'POST', token); 
            
            if (res.success) { 
                alert('Denúncia enviada com sucesso!');
                
            } else {
                alert(`Erro ao enviar denúncia: ${res.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao enviar denúncia:', error);
            alert('Ocorreu um erro ao enviar a denúncia. Tente novamente mais tarde.');
        } finally {
            setMostrarModal(false); 
            setCurrentPetIdToDenounce(null);
        }
    };

   
    async function umaFuncao(idPet) {
        const user = {
            idPost: idPet, 
        }
        const result = await enviarDados(user, `api/posts/quem-publicou`, 'POST', token);
        console.log(result)
    }


    function exibirModalMapa(X,Y) {
        setLat(X)
        setLng(Y)
        setModalMap('open')
    }
    
    function fecharModalMapa() {
        setModalMap('close')
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
                        denunciaPlaceholder="Denunciar"
                        dataSumico={post.POS_DATA}
                        regiao={ () => {
                            exibirModalMapa(post.PET_LOCAL.lat, post.PET_LOCAL.lng)
                        }  }
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
                        denunciaPlaceholder="Denunciar"
                        dataSumico={post.POS_DATA}
                        regiao={ () => {
                            exibirModalMapa(post.PET_LOCAL.lat, post.PET_LOCAL.lng)
                        }  }
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
                        denunciaPlaceholder="Denunciar"
                        dataSumico={post.POS_DATA}
                        regiao={ () => {
                            exibirModalMapa(post.PET_LOCAL.lat, post.PET_LOCAL.lng)
                        }  }
                        textoPrimeiroCategoria={post.POS_TIPO == 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                        disparaUmaNotificacao={umaFuncao(post.POS_ID)}
                    />
                ))}

                {   modalMap === 'open' &&
                    <>
                        <div className={style.popupMap}>                        
                            <IoIosCloseCircleOutline 
                                className={style.icon} 
                                onClick={fecharModalMapa}
                            />
                            
                            <MapGoogleComponent 
                                width="1200px" 
                                height="90%" 
                                localChamadaMapa="FEED" 
                                longitudeOut={lng} 
                                latitudeOut={lat} 
                                centerOutside="0"
                            />
                        </div>
                    </>
                }
                </div>

                    <div className={style.containerPosts}>
                        {category === 'all' && posts.map((post) => (
                            <Buttonposts 
                                key={post.POS_ID}
                                usuario={post.PES_NOME}
                                imagemUsuario={post.USU_FOTO} 
                                imagemPet={post.PET_FOTO}
                                nomePet={post.PET_NOME}
                                caracteristicas={post.PET_DESCRICAO}
                                dataSumico={post.POS_DATA}
                                regiao={post.PET_LOCAL}
                                text_button="Denunciar"
                                textoPrimeiroCategoria={post.POS_TIPO === 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                                petId={post.POS_ID} 
                                onDenunciarClick={handleSubmitDenuncia} 
                                disparaUmaNotificacao={() => { umaFuncao(post.POS_ID)}}
                            />
                        ))}
                        {category === 'lost' && lostPosts.map((post) => (
                            <Buttonposts 
                                key={post.POS_ID}
                                usuario={post.PES_NOME}
                                imagemUsuario={post.USU_FOTO}
                                imagemPet={post.PET_FOTO}
                                nomePet={post.PET_NOME}
                                caracteristicas={post.PET_DESCRICAO}
                                dataSumico={post.POS_DATA}
                                regiao={post.PET_LOCAL}
                                text_button="Denunciar"
                                textoPrimeiroCategoria={post.POS_TIPO === 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                                petId={post.POS_ID}
                                onDenunciarClick={handleSubmitDenuncia}
                                disparaUmaNotificacao={() => { umaFuncao(post.POS_ID)}}
                            />
                        ))}
                        {category === 'found' && foundPosts.map((post) => (
                            <Buttonposts 
                                key={post.POS_ID}
                                usuario={post.PES_NOME}
                                imagemUsuario={post.USU_FOTO}
                                imagemPet={post.PET_FOTO}
                                nomePet={post.PET_NOME}
                                caracteristicas={post.PET_DESCRICAO}
                                dataSumico={post.POS_DATA}
                                regiao={post.PET_LOCAL}
                                text_button="Denunciar"
                                textoPrimeiroCategoria={post.POS_TIPO === 'Perdido' ? 'Eu encontrei esse pet!' : 'Eu perdi esse pet!'}
                                petId={post.POS_ID}
                                onDenunciarClick={handleSubmitDenuncia}
                                disparaUmaNotificacao={() => { umaFuncao(post.POS_ID)}}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {mostrarModal && (
                <ModalDenuncia 
                    petId={currentPetIdToDenounce} 
                    onClose={() => setMostrarModal(false)} 
                    onSubmit={handleSubmitDenuncia} 
                />
            )}
        </div>
    );
}

export default PostsAll;