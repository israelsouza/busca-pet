import React, { useState, useEffect } from "react";
import Style from "../pages/styles/EditPerfil.module.css";
import fundo_passaro from "../assets/imgs/fundo_passaro.png";
import avatar_usuario from "../assets/imgs/avatar_usuario.png";
import Upload from "../assets/imgs/Upload.png";
import HeaderEdicao from "../components/HeaderEdicao"

function EdicaoPerfil() {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/usuarios/1") 
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => console.error("Erro ao carregar dados:", err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const atualizarCampo = (campo) => {
    fetch(`/usuarios/1/${campo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor: formData[campo] }),
    })
      .then((res) => res.text())
      .then((mensagem) => alert(mensagem))
      .catch((err) => console.error("Erro:", err));
  };

  const [foto, setFoto] = useState(null);

  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
  };
  
  const enviarFoto = () => {
    const formData = new FormData();
    formData.append("foto", foto);
  
    fetch("http://localhost:3001/usuarios/1/foto", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((msg) => alert(msg))
      .catch((err) => console.error("Erro:", err));
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
          <input
            id="PESSOA"
            value={formData.PES_NOME}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo(PES_NOME)}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Telefone</label>
          <input
            id="PESSOA"
            value={formData.PES_PHONE}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo(PES_PHONE)}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Email</label>
          <input
            id="USUARIO"
            value={formData.USU_EMAIL}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo(USU_EMAIL)} className={Style.button}>Editar</button>
        </div>
        
     
        <div className={Style.campo2}>
          <label className={Style.editFoto}>
          <img src={Style.Upload} />Editar Foto de Perfil <input type="file" accept="image/*" className={Style.picture_input}  onChange={handleFotoChange}/>
          </label>
         </div>

      </div>

      <div className={Style.EditEndereco}>
        <h2 className={Style.h2}>Informações de Endereço</h2>

        <div className={Style.campo}>
          <label>Rua</label>
          <input
            id="ENDERECO"
            value={formData.END_RUA}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo(END_RUA)}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Bairro</label>
          <input
            id="ENDERECO"
            value={formData.END_BAIRRO}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo(END_BAIRRO)}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Cidade</label>
          <input
            id="CIDADE"
            value={formData.CID_DESCRICAO}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo(CID_DESCRICAO)}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Estado</label>
          <select
            id="ESTADO"
            value={formData.EST_SIGLA}
            onChange={handleChange}
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
          <button onClick={() => atualizarCampo(EST_SIGLA)}>Editar</button>
        </div>
      </div>
    </div>
      <div className={Style.containerfoto}></div>   
    </div>
    </div>
  );
}

export default EdicaoPerfil;
