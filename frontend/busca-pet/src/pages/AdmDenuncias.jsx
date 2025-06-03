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

  async function fetchPublicacao(id) {
    setIsLoadingPost(true);
    setPostError(null);  
    setCurrentPost(null);
    console.log("ID recebido em fetchPublicacao antes de chamar fetchAPI:", id); 
    try {
      const res = await fetchAPI(`api/adm/denuncias/post/${id}`);
      console.log('fetchAPI - endpoint:', endpoint);
      console.log('fetchAPI - URL final:', url);
      if (!res.ok) throw new Error("Erro ao buscar a publicação");
      const data = await res.json();
      setCurrentPost(data.publicacao)

      if (data && typeof data.PET_FOTO === 'string' && data.PET_FOTO.length > 0) {
        const photoBase64String = `data:image/jpeg;base64,${data.PET_FOTO}`;
        setCurrPetFoto(photoBase64String);
      } 

    } catch (error) {
      console.error("Erro ao carregar a publicação:", error);
      setPostError(error.message || "Falha ao carregar a publicação."); // Armazena o erro
    } finally {
      // <<<<<< ATENÇÃO AQUI! Adicione o bloco finally
      setIsLoadingPost(false); // Indica que o carregamento terminou (sucesso ou falha)
      // <<<<<< FIM - ATENÇÃO AQUI!
    }
  }

  async function manterPublicacao(idPost, status, idDenuncia) {
    try {
      const res = await fetchAPI(`api/adm/denuncias/${idDenuncia}/${idPost}/${status}`, 'PUT', null, true, true)      


      // setEtapa('all');
      // fetchDenuncias(); // Recarrega a lista para remover a denúncia resolvida
      // setCurrentPost(null); // Garante que o post anterior não será mostrado novamente
      // setCurrentDenuncia(null); // Limpa o ID da denúncia
      // setPostError(null); // Limpa qualquer erro
      // setIsLoadingPost(false); // Desliga o loading
    } catch (error) {
      console.error("Erro ao tentar alterar o status da publicação: ", error);
    }
  }



  const handleBackToList = useCallback(() => {
    setEtapa('all');
    setCurrentPost(null);
    setCurrentDenuncia(null);
    setPostError(null);
    setIsLoadingPost(false);
  }, []);

  return (
    <div className={styles.pnotification}>
      <HeaderForm />
      <div className={`${styles.pnotification__container} ${styles.denuncia__container}`}>
        <h1>Gerenciar denúncias</h1>

        { etapa === "all" &&
        
        denuncias.map((denuncia, key) => (
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
        ))}

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
                  imagemPet={currPetFoto}
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
          <button className={styles.btn_refresh} onClick={handleBackToList} >  <IoIosArrowRoundBack  className={styles.icon_refresh} />   </button>
        ) : (
          <button className={styles.btn_refresh} onClick={fetchDenuncias} >  <IoMdRefresh className={styles.icon_refresh} />   </button>
        )}       
      </div>
    </div>
  );
}

export default AdmDenuncias;
