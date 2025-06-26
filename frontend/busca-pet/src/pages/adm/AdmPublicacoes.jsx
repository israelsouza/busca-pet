import React, {useCallback, useEffect, useState} from 'react'
import { IoMdRefresh } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import style from "../styles/ADMpostsAll.module.css";
import HeaderForm from "../../components/HeaderForm.jsx";
import Buttonposts_ADM from "../../components/button_posts_ADM.jsx";
import fetchAPI from "../../assets/utils/fetchAPI.js";
import validateAdmin from "../../assets/utils/validateAdmin.js";
function AdmPublicacoes() {

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const res = validateAdmin();
      if (!res) {
        alert("Usuário não é admin, redirecionando para login.");
        localStorage.removeItem("authToken");
        navigate("/form/login");
      }
    };
    checkAuthentication();
  }, [navigate]);

    const [postData, setPostData] = useState(null)

    const fetchPublicacoes = useCallback ( async () => {
        try {
            const result = await fetchAPI("api/posts/todos");
            const data = await result.json();
            console.log(data);
            setPostData(data.posts)            
        } catch (error) {
            console.error("Erro ao carregar as publicações: ", error);
        }
    }, [] )
    
    useEffect(() => {
        fetchPublicacoes();
    }, [fetchPublicacoes])

    async function deletarPublicacao(idPost) {
        
        const confirmDelete = window.confirm(`Tem certeza que deseja deletar a publicação com ID ${idPost}?`);
        if (!confirmDelete) {
            return; 
        }

        try {
        const res = await fetchAPI(`api/posts/post/${idPost}`, 'DELETE')    
        const data = await res.json()  
        console.log(data);
        alert(data.message)
        
        fetchPublicacoes()
        } catch (error) {
        console.error("Erro ao tentar alterar o status da publicação: ", error);
        }
    }

    return (
        <div className={style.container}>
            <HeaderForm/>
                <h1 className={style.publicacao}>Gerenciar Publicações</h1>
            <div className={style.containerPosts}>

                { postData &&
                    postData.map( (post) => {
                        return (
                            <Buttonposts_ADM 
                                local="sodeletar"
                                key={post.POS_ID}
                                usuario={post.PES_NOME}
                                imagemUsuario={post.USU_FOTO}
                                imagemPet={post.PET_FOTO}
                                nomePet={ post.PET_NOME === 'undefined' ? "" : post.PET_NOME }
                                caracteristicas={post.PET_DESCRICAO}
                                dataSumico={post.POS_DATA}                                  
                                deletar={() => {
                                    deletarPublicacao(post.POS_ID)
                                }}                          
                            />
                        )
                    })
                }

            </div>
            <div className={style.btn_container}>
                    <button className="global-ADM__button" onClick={fetchPublicacoes}> 
                        <IoMdRefresh className="global-ADM__icon" /> 
                    </button>
            </div>
        </div>
    )
}

export default AdmPublicacoes;