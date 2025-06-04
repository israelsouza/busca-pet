import React, { useEffect, useState, useCallback } from "react";
import BoxDenuncia from "../components/BoxDenuncia.jsx";
import HeaderForm from "../components/HeaderForm";
import fetchAPI from "../assets/utils/fetchAPI.js";
import { FaTrashCan } from "react-icons/fa6";
import { IoMdRefresh, IoIosArrowRoundBack } from "react-icons/io";
import Buttonposts_ADM from "../components/button_posts_ADM";



import styles from "./styles/Notification.module.css";

function AdmDenuncias() {
  const [denuncias, setDenuncias] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentDenuncia, setCurrentDenuncia] = useState (null);
  const [etapa, setEtapa] = useState('all')
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [postError, setPostError] = useState(null);
  const [currPetFoto, setCurrPetFoto] = useState(null)

  const fetchDenuncias = useCallback( async () => {
    try {
      const res = await fetchAPI("api/adm/denuncias");
      if (!res.ok) throw new Error("Erro ao buscar usuários");
      const data = await res.json();      
      console.log(data)
      setDenuncias(data.denuncias);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }, []);

  useEffect(() => {
    fetchDenuncias();
  }, [fetchDenuncias]);

  const fetchPublicacao = useCallback ( async (id) => {
    setIsLoadingPost(true);
    setPostError(null);  
    setCurrentPost(null);
    console.log("ID recebido em fetchPublicacao antes de chamar fetchAPI:", id); 
    try {
      const res = await fetchAPI(`api/adm/denuncias/post/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar a publicação");
      const data = await res.json();
      setCurrentPost(data.publicacao)

      if (data && typeof data.PET_FOTO === 'string' && data.PET_FOTO.length > 0) {
        const photoBase64String = `data:image/jpeg;base64,${data.PET_FOTO}`;
        setCurrPetFoto(photoBase64String);
      } 

    } catch (error) {
      console.error("Erro ao carregar a publicação:", error);
      setPostError(error.message || "Falha ao carregar a publicação.");
    } finally {
      setIsLoadingPost(false); 
    }
  }, [])

  async function manterPublicacao(idPost, status, idDenuncia) {
    try {
      const res = await fetchAPI(`api/adm/denuncias/${idDenuncia}/${idPost}/${status}`, 'PUT', null, true, true)    
      const data = await res.json()  
      console.log(data);
      alert(data.message)
      

      handleBackToList()
    } catch (error) {
      console.error("Erro ao tentar alterar o status da publicação: ", error);
    }
  }

  const handleBackToList = useCallback(() => {
    setCurrentPost(null);
    setCurrentDenuncia(null);
    setPostError(null);
    setIsLoadingPost(false);
    setEtapa('all');
  }, []);

  return (
    <div className={styles.pnotification}>
      <HeaderForm />
      <div className={`${styles.pnotification__container} ${styles.denuncia__container}`}>
        

        { etapa === "all" &&
              <>
                <h1>Gerenciar denúncias</h1>
                
                {denuncias.map((denuncia, key) => {
                  return (
                    <BoxDenuncia
                      key={denuncia.DEN_ID}
                      id={denuncia.DEN_ID}
                      denunciado={denuncia.NOME_DENUNCIADO}
                      denunciante={denuncia.NOME_DENUNCIANTE}
                      tipo={denuncia.DEN_TIPO}
                      descricao={denuncia.DEN_DESCRICAO}
                      onClick={ () => {
                        console.log("POS_ID clicado:", denuncia.POS_ID); 
                        setCurrentDenuncia(denuncia.DEN_ID); 
                        fetchPublicacao(denuncia.POS_ID); 
                        setEtapa('one'); 
                    } }            
                  />
                  )
                })}
            </>                
          }

        { etapa === 'one' && (

            isLoadingPost ? (
            <p>Carregando detalhes da publicação...</p>
          ) : postError ? (
            <p style={{ color: 'red' }}>Erro ao carregar publicação: {postError}</p>
          ) : currentPost ? (
                <Buttonposts_ADM 
                  key={currentPost.POS_ID}
                  usuario={currentPost.PES_NOME}
                  imagemUsuario={currentPost.USU_FOTO}
                  imagemPet={currentPost.PET_FOTO}
                  nomePet={currentPost.PET_NOME}
                  caracteristicas={currentPost.PET_DESCRICAO}
                  dataSumico={currentPost.POS_DATA}                  
                  manter={ () => {
                    manterPublicacao(currentPost.POS_ID, "MANTER", currentDenuncia)
                    console.log("denuncia atual ",currentDenuncia)
                  }}
                  deletar={() => {
                    manterPublicacao(currentPost.POS_ID, "DELETAR", currentDenuncia)
                  }}
                />
            ) : (
              <p>Nenhum detalhe de publicação encontrado.</p>
            )

        )        
        }

      </div>
      <div className={styles.btn_container}>
        { etapa === 'one' ? (
          <button className="global-ADM__button" onClick={handleBackToList} >  
          <IoIosArrowRoundBack  className="global-ADM__icon" />   </button>
        ) : (
          <button className="global-ADM__button" onClick={fetchDenuncias} >            <IoMdRefresh className="global-ADM__icon" />   </button>
        )}       
      </div>
    </div>
  );
}

export default AdmDenuncias;
