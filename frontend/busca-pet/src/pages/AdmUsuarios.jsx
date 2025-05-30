import HeaderForm from "../components/HeaderForm";
import Style from '../pages/styles/admUsuarios.module.css';
import React, { useEffect, useState } from 'react';
function AdmUsuarios() {
     const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const res = await fetch('http://localhost:3000/api/usuarios');
                if (!res.ok) throw new Error('Erro ao buscar usuários');
                const data = await res.json();
                setUsuarios(data);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
            }
        }

        carregarUsuarios();
    }, []);

  return (
    <div className={Style.ContainerMain}>
        <div className={Style.ContainerHead}>
        <HeaderForm/>
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
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.PES_NOME}</td>
                            <td>{usuario.USU_EMAIL}</td>
                            <td>{usuario.DEN_ID}</td>
                            <td>
                                <button className={Style.Button}>Banir</button>
                                <button className={Style.Button}>Editar</button>
                            </td>
                        </tr>
                    ))}
                       </tbody>
                </table>
                </div>
            </div>
    </div>
  );
}

export default AdmUsuarios;