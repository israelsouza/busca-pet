  import React, { useState, useEffect } from "react";
  import Style from "../pages/styles/EditPerfil.module.css";
  import HeaderEdicao from "../components/HeaderEdicao";

  function EdicaoPerfil() {
    const [formData, setFormData] = useState({});
    const [foto, setFoto] = useState(null);
    const [email, setEmail] = useState("");

    useEffect(() => {
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
        console.log("Email recuperado:", userEmail);
        console.log(userEmail, 'Estou AQUI!')
        
      } catch (error) {
        console.error("Erro ao recuperar email:", error);
      }
    }, []);
    
    useEffect(() => {
      if (!email) return;
      
      console.log("Buscando dados de:", `http://localhost:3000/usuarios/email/${email}`);
      fetch("http://localhost:3000/usuarios/email/" + email)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Dados recebidos:", data);
          setFormData(data);
        })
        .catch((err) => console.error("Erro ao carregar dados:", err));
    }, [email]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const atualizarCampo = (campo) => {
      fetch(`http://localhost:3000/usuarios/email/${email}/${campo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: formData[campo] }),
      })
        .then(res => res.text())
        .then(alert)
        .catch(err => console.error("Erro:", err));
    };

    const handleFotoChange = (e) => {
      setFoto(e.target.files[0]);
    };

    const enviarFoto = () => {
      const data = new FormData();
      data.append("foto", foto);

      fetch(`http://localhost:3001/usuarios/email/${email}/foto`, {
        method: "POST", 
        body: data,
      })
        .then(res => res.text())
        .then(alert)
        .catch(err => console.error("Erro:", err));
    };

    

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
            <input name="PES_NOME" value={formData.PES_NOME || ""} onChange={handleChange}/>
            <button onClick={() => atualizarCampo("PES_NOME")}>Editar</button>
          </div>

          <div className={Style.campo}>
            <label>Telefone</label>
            <input name="PES_PHONE" value={formData.PES_PHONE} onChange={handleChange} />
            <button onClick={() => atualizarCampo("PES_PHONE")}>Editar</button>
          </div>

          <div className={Style.campo}>
            <label>Email</label>
            <input name="USU_EMAIL" value={formData.USU_EMAIL} onChange={handleChange} />
            <button onClick={() => atualizarCampo("USU_EMAIL")} className={Style.button}>Editar</button>
          </div>
          
      
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
            <input name="END_RUA" value={formData.END_RUA} onChange={handleChange} />
            <button onClick={() => atualizarCampo("END_RUA")}>Editar</button>
          </div>

          <div className={Style.campo}>
            <label>Bairro</label>
            <input name="END_BAIRRO" value={formData.END_BAIRRO} onChange={handleChange} />
            <button onClick={() => atualizarCampo("END_BAIRRO")}>Editar</button>
          </div>

          <div className={Style.campo}>
            <label>Cidade</label>
            <input name="CID_DESCRICAO" value={formData.CID_DESCRICAO} onChange={handleChange} />
            <button onClick={() => atualizarCampo("CID_DESCRICAO")}>Editar</button>
          </div>

          <div className={Style.campo}>
            <label>Estado</label>
            <select name="EST_SIGLA" value={formData.EST_SIGLA} onChange={handleChange}>
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
            <button onClick={() => atualizarCampo("EST_SIGLA")}>Editar</button>
          </div>
        </div>
      </div>
        <div className={Style.containerfoto}></div>
      </div>
      </div>
    );
  }

  export default EdicaoPerfil;
