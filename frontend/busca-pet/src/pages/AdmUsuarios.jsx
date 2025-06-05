import HeaderForm from "../components/HeaderForm";
import Style from "../pages/styles/admUsuarios.module.css";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fetchAPI from "../assets/utils/fetchAPI.js";
import { IoMdRefresh } from "react-icons/io";
import { LuUserRoundPen, LuUserRoundMinus } from "react-icons/lu";
import {
  validarCampoEmail,
  validarCampoApenasLetras
} from "../assets/utils/regex.js";


function AdmUsuarios() {
  const navigate = useNavigate();
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senha01Ref = useRef(null);
  const senha02Ref = useRef(null);

  const [usuarios, setUsuarios] = useState([]);
  const [currentUser, setCurrentUser] = useState({})
  const [fase, setFase] = useState("listaUsuarios")

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  })

  const [errorValues, setErrorValues] = useState({
    nome: '',
    email: '',
    senha: ''
  })
  
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

  function handleNewUserData(e) {
    const {id, value} = e.target;
    setFormData( prevData => ({
      ...prevData,
      [id]: value
    }) )
  }

  function validateData() {
    const nome= nomeRef.current;
    const email= emailRef.current;

    let hasFormError  = false;

    if(formData.email.trim() != '') {

      const configEmail = {
        campo: {
          value: formData.email,
          focus: () => email.focus()
        },
        setErro: (msg) =>  setErrorValues(prevErrors => ({ ...prevErrors, email: msg })),
        mensagem: "Formato do e-mail inválido"
      }

      if(validarCampoEmail(configEmail)) {
        hasFormError = true;
        email.focus()
        alert("erro: o email não possui o padrao de um email comum")
      }

      if (formData.email.length > 70) {
        hasFormError = true;
        email.focus()
        alert('Quantidade de caracteres do EMAIL excedida, tente novamente')
      }

    } else {
      setErrorValues(prevErrors => ({ ...prevErrors, email: "" }));
    }

    if(formData.nome.trim() != '') {

      const configNome = {
        campo: {
          value: formData.nome,
          focus: () => nome.focus()
        },
        setErro: (msg) =>  setErrorValues(prevErrors => ({ ...prevErrors, nome: msg })),
        mensagem: "Formato do nome inválido, só pode conter letras!"
      }

      if(validarCampoApenasLetras(configNome)) {
        hasFormError = true;
        nome.focus()
        alert("erro: o nome só pode conter letras")
      }

      if (formData.nome.length > 70) {
        hasFormError = true;
        nome.focus()
        alert('Quantidade de caracteres do NOME excedida, tente novamente')
      }

    } else {
      setErrorValues(prevErrors => ({ ...prevErrors, nome: "" }));
    }

    if(formData.senha || formData.confirmacaoSenha) {
      if((formData.senha.length || formData.confirmacaoSenha.length) < 6 ) {
        hasFormError = true;
        alert('Preencha ao menos os 6 caracteres obrigatórios')
      } else if(formData.senha.length != formData.confirmacaoSenha.length) {
        hasFormError = true;
        alert('O tamanho das senhas são diferentes, tente novamente')
      } 
      
      if(formData.senha != formData.confirmacaoSenha) {
        hasFormError = true;
        alert('O valor das senhas são diferentes, tente novamente')
      }else if (formData.senha.length > 30) {
        hasFormError = true;
        alert('Quantidade de caracteres da SENHA excedida, tente novamente')
      }
    }

    return hasFormError;
  }

  function makeDataToSend() {
    const dataToSend = {};
    if (formData.nome.trim() !== '') {
      dataToSend.nome = formData.nome;
    }
    if (formData.email.trim() !== '') {
      dataToSend.email = formData.email;
    }
    
    if (formData.senha.length >0 ) {
      dataToSend.senha = formData.senha;
    }

    if (Object.keys(dataToSend).length === 0) {
      alert("Nenhum campo foi alterado ou preenchido para atualizar.");
      return null;
    }
    return dataToSend
  }

  async function submitNewData(e) {
    e.preventDefault();

    const resultValidation = validateData();

    if (resultValidation)  return;

    const data = makeDataToSend();

    if (data == null)  return;
      
    console.log(data);
    
    try {
      const id = currentUser.ID
      if (!id) {
        throw new Error("ID do usuário para atualização não encontrado.");
      }
      
      const res = await fetchAPI(
        `api/adm/usuario/${id}`,
        'PATCH',
        data,
        true
      );
      console.log(id)

      console.log(res)

      if (!res.ok) throw new Error("Erro ao buscar a publicação");

      const resultadoBackend = await res.json();
      alert(resultadoBackend.message)

      setTimeout(() => navigate("/adm"), 700);

      
    } catch (error) {
      console.error("Falha ao atualizar dados do usuário")
    }
  }

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
                    <span>Email: </span>    <input disabled value={currentUser.USU_EMAIL} type="email" id="currentEmail" />
                  </div>

                  <div className={Style.unicoUser__row}>
                    <span>Nome: </span>    <input disabled value={currentUser.PES_NOME} type="text" id="currentName" />
                  </div>
                
                  <div className={Style.unicoUser__row}>
                    <span>Novo nome: </span>    <input ref={nomeRef} type="text" name="" id="nome" onChange={handleNewUserData} />
                  </div>
                  
                  <div className={Style.unicoUser__row}>
                    <span>Novo email: </span>    <input ref={emailRef} type="email" name="" id="email" onChange={handleNewUserData} />
                  </div>

                  <div className={Style.unicoUser__row}>
                    <span>Nova senha: </span>    <input ref={senha01Ref} type="password" name="" id="senha" onChange={handleNewUserData} />
                  </div>

                  <div className={Style.unicoUser__row}>
                    <span>Confirme a ssenha: </span>    <input ref={senha02Ref} type="password" name="" id="confirmacaoSenha" onChange={handleNewUserData} />
                  </div>
            </div>

            <div className={Style.unicoUser__btnContainer}>
              <button onClick={submitNewData}>Atualizar</button>
              <button onClick={ () => setFase('listaUsuarios')}>Cancelar</button>
            </div>

          </>

        }

        
      </div>
    </div>
  );
}

export default AdmUsuarios;
