  import React, { useState, useEffect, useRef } from "react";
  import Style from "../pages/styles/EditPerfil.module.css";
  import HeaderEdicao from "../components/HeaderEdicao";
  import validateToken from '../assets/utils/validateToken.js'
  import { useNavigate } from "react-router-dom";
  import enviarDados from "../assets/utils/enviarDados.js";


  function EdicaoPerfil() {

    const navigate = useNavigate();

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

    

    const [erros, setErros] = useState({});
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [isEditing, setIsEditing] = useState({})
    const [foto, setFoto] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    const nomeInputRef = useRef(null);
    const telefoneInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const ruaInputRef = useRef(null);
    const bairroInputRef = useRef(null);
    const cidadeInputRef = useRef(null);
    const estadoInputRef = useRef(null);

  useEffect(() => {
    if (isEditing.PES_NOME) {
      nomeInputRef.current?.focus();
    }
  }, [isEditing.PES_NOME]);

  // Efeito para focar o input de telefone
  useEffect(() => {
    if (isEditing.PES_PHONE) {
      telefoneInputRef.current?.focus();
    }
  }, [isEditing.PES_PHONE]);

  // Efeito para focar o input de email
  useEffect(() => {
    if (isEditing.USU_EMAIL) {
      emailInputRef.current?.focus();
    }
  }, [isEditing.USU_EMAIL]);

  // Efeito para focar o input de rua
  useEffect(() => {
    if (isEditing.END_RUA) {
      ruaInputRef.current?.focus();
    }
  }, [isEditing.END_RUA]);

  // Efeito para focar o input de bairro
  useEffect(() => {
    if (isEditing.END_BAIRRO) {
      bairroInputRef.current?.focus();
    }
  }, [isEditing.END_BAIRRO]);

  // Efeito para focar o input de cidade
  useEffect(() => {
    if (isEditing.CID_DESCRICAO) {
      cidadeInputRef.current?.focus();
    }
  }, [isEditing.CID_DESCRICAO]);

  // Efeito para focar o input de estado
  useEffect(() => {
    if (isEditing.EST_SIGLA) {
      estadoInputRef.current?.focus();
    }
  }, [isEditing.EST_SIGLA]);








    useEffect(() => { // Recupera o token do localStorage
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          console.log("Token não encontrado.");
          return;
        }
    
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userEmail = payload.email;
        
        if (!userEmail) {
          throw new Error("Email não encontrado no token.");
        }
    
        setEmail(userEmail);
        console.log("F-EDITPERF: Email recuperado:", userEmail);
        
      } catch (error) {
        console.error("Erro ao recuperar email:", error);
      }
    }, []);
    
    useEffect(() => {
      if (!email) return;
      setLoading(true);

      const token = localStorage.getItem("authToken");

      const headerRequest = {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                },
                }
            
      fetch(`http://localhost:3000/usuarios/email/${email}`, headerRequest)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Dados recebidos:", data);
          const userData = data.userData[0];

          setFormData(userData);
          setOriginalData(userData);
          setLoading(false);
        })
        .catch( (err) => {
          console.error("Erro ao buscar dados do usuário:", err);
          setLoading(false);
        })
    }, [email]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const atualizarCampo = (campo) => {
      const token = localStorage.getItem("authToken");
      fetch(`http://localhost:3000/usuarios/email/${email}/${campo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
         Authorization: `Bearer ${token}` 
        }, // Adiciona o token no cabeçalho
        body: JSON.stringify({ valor: formData[campo] }),
      })
        .then(res => res.text())
        .then(alert)
        .catch(err => console.error("Erro:", err));
    };

    const toggleEdit = (campo) => {
      setIsEditing((prev) => ({ ...prev, [campo]: !prev[campo] })); // Alterna o modo de edição
    };

    const handleSalvar = (campo) => {
      let isValid = true;
      const newErros = {...erros}

      switch (campo) {
        case "PES_NOME":
          if (!formData.PES_NOME.trim()) {
            newErros.PES_NOME = 'O nome é obrigatório.';
            isValid = false;
          } else if (formData.PES_NOME.trim().length < 3) {
            newErros.PES_NOME = 'O nome deve ter pelo menos 3 caracteres.';
            isValid = false;
          } if ( !/^[A-Za-zÀ-ú\s]+$/.test(formData.PES_NOME.trim()) ) { 
            newErros.PES_NOME = 'O nome deve conter apenas letras.';
            isValid = false;
          } else {
            delete newErros.PES_NOME; // Remove o erro se for válido
          }
          break;
        case "PES_PHONE":
          if (formData.PES_PHONE.trim() && !/^\d+$/.test(formData.PES_PHONE)) {
            newErros.PES_PHONE = 'O telefone deve conter apenas números.';
            isValid = false;
          } else if (formData.PES_PHONE.trim().length !== 11 && formData.PES_PHONE.trim().length > 0) {
            newErros.PES_PHONE = 'O telefone deve ter 11 dígitos (com DDD).';
            isValid = false;
          } else if ( !formData.PES_PHONE.trim() ) {
            newErros.PES_PHONE = 'O telefone é obrigatório.';
            isValid = false;
          } else {
            delete newErros.PES_PHONE;
          }
          break;
        case "USU_EMAIL":          
          if (!formData.USU_EMAIL.trim()) {
            newErros.USU_EMAIL = 'O e-mail é obrigatório.';
            isValid = false;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.USU_EMAIL)) {            
            newErros.USU_EMAIL = 'Formato de e-mail inválido.';
            isValid = false;
          } else {
            delete newErros.USU_EMAIL;
          }
          break;
        case "END_RUA":
          if (!formData.END_RUA.trim()) {
            newErros.END_RUA = 'A rua é obrigatória.';
            isValid = false;
          } else if (formData.END_RUA.trim().length < 3) {
            newErros.END_RUA = 'A rua deve ter pelo menos 3 caracteres.';
            isValid = false;
          } if ( !/^[A-Za-zÀ-ú\s]+$/.test(formData.END_RUA.trim()) ) { 
            newErros.END_RUA = 'A rua deve conter apenas letras.';
            isValid = false;
          } else {
            delete newErros.END_RUA; // Remove o erro se for válido
          }
          break;
        case "END_BAIRRO":
          if (!formData.END_BAIRRO.trim()) {
            newErros.END_BAIRRO = 'O bairro é obrigatório.';
            isValid = false;
          } else if (formData.END_BAIRRO.trim().length < 3) {
            newErros.END_BAIRRO = 'O bairro deve ter pelo menos 3 caracteres.';
            isValid = false;
          } else {
            delete newErros.END_BAIRRO;
          }
          break;
        case 'CID_DESCRICAO':
          if (!formData.CID_DESCRICAO.trim()) {
            newErros.CID_DESCRICAO = 'A cidade é obrigatória.';
            isValid = false;
          } else if (formData.CID_DESCRICAO.trim().length < 3) {
            newErros.CID_DESCRICAO = 'A cidade deve ter pelo menos 3 caracteres.';
            isValid = false;
          } else {
            delete newErros.CID_DESCRICAO;
          }
          break;
        case 'EST_SIGLA':
          if (!formData.EST_SIGLA.trim()) {
            newErros.EST_SIGLA = 'O estado é obrigatório.';
            isValid = false;
          } else if (formData.EST_SIGLA.trim().length !== 2) {
            newErros.EST_SIGLA = 'A sigla do estado deve ter 2 caracteres.';
            isValid = false;
          } else if (!/^[A-Z]{2}$/.test(formData.EST_SIGLA.trim())) {
            newErros.EST_SIGLA = 'A sigla do estado deve conter apenas letras maiúsculas.';
            isValid = false;
          } else {
            delete newErros.EST_SIGLA;
          }
          break;
        default:
        break;
      }

      setErros(newErros)

      if (isValid) {
        if (formData[campo] !== originalData[campo]) {
          atualizarCampo(campo); // Chama a função de atualização se o valor mudou
          setOriginalData((prev) => ({ ...prev, [campo]: formData[campo] })); // Atualiza o valor original após a tentativa de salvar (sucesso ou falha, dependendo da sua lógica)
        };
          toggleEdit(campo); // Alterna o modo de edição para "Editar"
          if (campo === "USU_EMAIL") {
            setTimeout(() => navigate("/form/login"), 1000); 
          }
      }
    };

    const handleFotoChange = (e) => {
      setFoto(e.target.files[0]);
    };

    const enviarFoto = async () => {
      const data = new FormData();
      data.append("foto", foto);;

      const result = await enviarDados(data, `usuarios/foto/${email}`)
      console.log("RESULT ", result)
    };

    if (loading) {
      return <div>Carregando perfil...</div>; // Ou um componente de loading mais elaborado
    }

    return (
      <div>
      <HeaderEdicao />
      <div className={Style.container}>
      <div className={Style.colunaForm}>
        <div className={Style.EditContato}>
          <h2 className={Style.h2}>Informações de Contato</h2>

          <div className={Style.campo}>
            <label>Nick de Usuário</label>
            {/* <p>{userInfo.USU_EMAIL || "user 01"}</p> */}
          </div>

          <div className={Style.campo}>
            <label>Nome</label>
            <input 
              ref={nomeInputRef}
              name="PES_NOME" 
              value={formData?.PES_NOME || ""} 
              onChange={handleChange}
              disabled={!isEditing.PES_NOME}
            />
            <button
              onClick={() => {
                if (isEditing.PES_NOME) {
                  handleSalvar("PES_NOME"); // Salva as alterações
                }else {
                  toggleEdit("PES_NOME"); // Alterna o modo de edição
                }
              }}
            >
               {isEditing.PES_NOME ? "Salvar" : "Editar"}
            </button>
          </div>
          {erros.PES_NOME && <p className={Style.erro}>{erros.PES_NOME} </p>  }

          <div className={Style.campo}>
            <label>Telefone</label>
            <input 
              ref={telefoneInputRef}
              name="PES_PHONE" 
              value={formData?.PES_PHONE || ""} 
              onChange={handleChange}
              disabled={!isEditing.PES_PHONE}
            />
            <button 
            onClick={() => {
              if (isEditing.PES_PHONE) {
                handleSalvar("PES_PHONE"); // Salva as alterações
              }else {
                toggleEdit("PES_PHONE"); // Alterna o modo de edição
              }
            }}>
              {isEditing.PES_PHONE ? "Salvar" : "Editar"}
              </button>
          </div>
          {erros.PES_PHONE && <p className={Style.erro}>{erros.PES_PHONE} </p>  }

          <div className={Style.campo}>
            <label>Email</label>
            <input 
              ref={emailInputRef}
              name="USU_EMAIL" 
              value={formData?.USU_EMAIL   || ""} 
              onChange={handleChange} 
              disabled={!isEditing.USU_EMAIL}
              />
            <button onClick={() => {
              if (isEditing.USU_EMAIL) {
                handleSalvar("USU_EMAIL"); // Salva as alterações
              }else {
                toggleEdit("USU_EMAIL"); // Alterna o modo de edição
              }
            }} className={Style.button}>
              {isEditing.USU_EMAIL ? "Salvar" : "Editar"}
            </button>
          </div>
          {erros.USU_EMAIL && <p className={Style.erro}>{erros.USU_EMAIL} </p>  }
          
      
          <div className={Style.campo2}>
            <label className={Style.editFoto}>
            <img src={Style.Upload} />Editar Foto de Perfil <input type="file" accept="image/*" className={Style.picture_input}  onChange={handleFotoChange}/>
            </label>
            <button onClick={enviarFoto}>Enviar Foto</button>
          </div>

        </div>

        <div className={Style.EditEndereco}>
          <h2 className={Style.h2}>Informações de Endereço</h2>

          <div className={Style.campo}>
            <label>Rua</label>
            <input
            ref={ruaInputRef}
             name="END_RUA" 
             value={formData.END_RUA} 
             onChange={handleChange} 
             disabled={!isEditing.END_RUA}
             />
            <button onClick={() => {
              if (isEditing.END_RUA) {
                handleSalvar("END_RUA"); // Salva as alterações
              }else {
                toggleEdit("END_RUA"); // Alterna o modo de edição
              }
            }}>
              {isEditing.END_RUA ? "Salvar" : "Editar"}
            </button>
          </div>
          {erros.END_RUA && <p className={Style.erro}>{erros.END_RUA} </p>  }

          <div className={Style.campo}>
            <label>Bairro</label>
            <input 
              ref={bairroInputRef}
              name="END_BAIRRO" 
              value={formData?.END_BAIRRO || ""} 
              onChange={handleChange} 
              disabled={!isEditing.END_BAIRRO}
            />
            <button 
              onClick={() => {
                if (isEditing.END_BAIRRO) {
                  handleSalvar("END_BAIRRO"); // Salva as alterações
                }else {
                  toggleEdit("END_BAIRRO"); // Alterna o modo de edição
                }
            }}>      
              {isEditing.END_BAIRRO ? "Salvar" : "Editar"}
            </button>
          </div>
          {erros.END_BAIRRO && <p className={Style.erro}>{erros.END_BAIRRO} </p>  }

          <div className={Style.campo}>
            <label>Cidade</label>
            <input
              ref={cidadeInputRef}
              name="CID_DESCRICAO" 
              value={formData?.CID_DESCRICAO || ""} 
              onChange={handleChange}
              disabled={!isEditing.CID_DESCRICAO}
              />
            <button 
              onClick={() => {
                if (isEditing.CID_DESCRICAO) {
                  handleSalvar("CID_DESCRICAO"); // Salva as alterações
                }else {
                  toggleEdit("CID_DESCRICAO"); // Alterna o modo de edição
                }
              }}>
                {isEditing.CID_DESCRICAO ? "Salvar" : "Editar"}
              </button>
          </div>
          {erros.CID_DESCRICAO && <p className={Style.erro}>{erros.CID_DESCRICAO} </p>  }

          <div className={Style.campo}>
            <label>Estado</label>
            <select 
              ref={estadoInputRef}
              name="EST_SIGLA" 
              value={formData?.EST_SIGLA || ""} 
              onChange={handleChange}
              disabled={!isEditing.EST_SIGLA}  
            >
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
              <option value="AC">AC</option>  
              <option value="AL">AL</option>
              <option value="AM">AM</option>
              <option value="AP">AP</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="PR">PR</option>
              <option value="RN">RN</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="RS">RS</option>
              <option value="SC">SC</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
            <button 
              onClick={() => {
                if (isEditing.EST_SIGLA) {
                  handleSalvar("EST_SIGLA"); // Salva as alterações
                }else {
                  toggleEdit("EST_SIGLA"); // Alterna o modo de edição
                }
              }}>
                {isEditing.EST_SIGLA ? "Salvar" : "Editar"}
              </button>
          </div>
          {erros.EST_SIGLA && <p className={Style.erro}>{erros.EST_SIGLA} </p>  }
        </div>
      </div>
        <div className={Style.containerfoto}></div>
      </div>
      </div>
    );
  }

  export default EdicaoPerfil;
