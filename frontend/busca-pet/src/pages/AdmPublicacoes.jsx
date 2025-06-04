import React, {useCallback, useEffect, useState} from 'react'
import { IoMdRefresh } from "react-icons/io";

import HeaderForm from "../components/HeaderForm";
import Buttonposts_ADM from "../components/button_posts_ADM";

import fetchAPI from "../assets/utils/fetchAPI.js";

import style from "./styles/ADMpostsAll.module.css";

function AdmPublicacoes() {
    const [postData, setPostData] = useState(null)

    const fetchPublicacoes = useCallback ( async () => {
        try {
            const result = await fetchAPI("api/posts/all");
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
        const res = await fetchAPI(`api/adm/post/${idPost}`, 'DELETE')    
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
                                nomePet={post.PET_NOME}
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
                    <button className={style.btn_refresh} onClick={fetchPublicacoes} >  <IoMdRefresh  className={style.icon_refresh} /> </button>
            </div>
        </div>
    )
}

export default AdmPublicacoes;