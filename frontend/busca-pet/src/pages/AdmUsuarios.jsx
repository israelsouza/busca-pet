import HeaderForm from "../components/HeaderForm";
import Style from "../pages/styles/admUsuarios.module.css";
import React, { useEffect, useState } from "react";
import fetchAPI from "../assets/utils/fetchAPI.js";

function AdmUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const res = await fetchAPI('api/adm/usuarios')        
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        console.log(data)
        console.log(data.usuarios)
        setUsuarios(data.usuarios);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    }

    carregarUsuarios();
  }, []);

  return (
    <div className={Style.ContainerMain}>
      <div className={Style.ContainerHead}>
        <HeaderForm />
      </div>
      <div className={Style.ContainerBody}>
        <h1 className={Style.H1}>Gerenciar Usuários</h1>
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
                <tr key={usuario.id}>
                  <td>{usuario.PES_NOME}</td>
                  <td>{usuario.USU_EMAIL}</td>
                  <td>{usuario.DENUNCIAS_COUNT}</td>
                  <td>
                    <div className={Style.btn_container}>
                      <button className={Style.Button}>Banir</button>
                      <button className={Style.Button}>Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={Style.ContainerFooter}>
          <button className={Style.Atualiza}>Atualizar</button>
        </div>
      </div>
    </div>
  );
}

export default AdmUsuarios;
