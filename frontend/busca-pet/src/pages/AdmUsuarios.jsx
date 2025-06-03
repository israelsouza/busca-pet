import HeaderForm from "../components/HeaderForm";
import Style from "../pages/styles/admUsuarios.module.css";
import React, { useEffect, useState, useCallback } from "react";
import fetchAPI from "../assets/utils/fetchAPI.js";
import { IoMdRefresh } from "react-icons/io";
import { LuUserRoundPen, LuUserRoundMinus } from "react-icons/lu";


function AdmUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [currentUser, setCurrentUser] = useState({})
  const [fase, setFase] = useState("listaUsuarios")

  const fetchUsers = useCallback( async () => {
      try {
        const res = await fetchAPI('api/adm/usuarios')        
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        // console.log(data)
         console.log(data.usuarios)
        setUsuarios(data.usuarios);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
  }, [] )

  useEffect( () => {
    fetchUsers()
  }, [fetchUsers] )

  return (
    <div className={Style.ContainerMain}>
      <div className={Style.ContainerHead}>
        <HeaderForm />
      </div>
      <div className={Style.ContainerBody}>
        <h1 className={Style.H1}>Gerenciar Usuários</h1>
        { fase == 'listaUsuarios' &&
           <>
             <div className={Style.ContainerTable}>
              <table className={Style.Table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Denúncias</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios && 
                  usuarios.map((usuario) => (
                    <tr key={usuario.ID}>
                      <td>{usuario.PES_NOME}</td>
                      <td>{usuario.USU_EMAIL}</td>
                      <td>{usuario.DENUNCIAS_RECEBIDAS_COUNT}</td>
                      <td>
                        <div className={Style.btn_container}>
                          <button className={Style.Button_ban}> <LuUserRoundMinus className={Style.icon_user} /> Banir</button>
                          <button onClick={ () => {
                            setCurrentUser(usuario);
                            setFase('usuarioUnico')
                          } } className={Style.Button_edit}> <LuUserRoundPen className={Style.icon_user} /> Editar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={Style.ContainerFooter}>
          <button className={Style.Atualiza} onClick={fetchUsers}> <IoMdRefresh className={Style.icon_refresh} /> </button>
        </div>
           </>

            
        }
        {  fase === 'usuarioUnico' &&
          <>

            <div className={Style.unicoUser__container}>
              
                  <div className={Style.unicoUser__row}>
                    <span>Email: </span>    <input disabled value={currentUser.USU_EMAIL} type="email" name="" id="" />
                  </div>

                  <div className={Style.unicoUser__row}>
                    <span>Nome: </span>    <input value={currentUser.PES_NOME} type="email" name="" id="" />
                  </div>
                
                  
                  <div className={Style.unicoUser__row}>
                    <span>Novo email: </span>    <input type="email" name="" id="" />
                  </div>

                  <div className={Style.unicoUser__row}>
                    <span>Nova senha: </span>    <input type="password" name="" id="" />
                  </div>

                  <div className={Style.unicoUser__row}>
                    <span>Confirme a ssenha: </span>    <input type="password" name="" id="" />
                  </div>
            </div>

            <div className={Style.unicoUser__btnContainer}>
              <button>Atualizar</button>
              <button onClick={ () => setFase('listaUsuarios')}>Cancelar</button>
            </div>

          </>

        }

        
      </div>
    </div>
  );
}

export default AdmUsuarios;
