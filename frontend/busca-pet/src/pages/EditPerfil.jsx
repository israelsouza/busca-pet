import React, { useState } from "react";
import Style from "../pages/styles/EditPerfil.module.css";
import fundo_passaro from "../assets/imgs/fundo_passaro.png";
import avatar_usuario from "../assets/imgs/avatar_usuario.png";
import Upload from "../assets/imgs/Upload.png";
import HeaderEdicao from "../components/HeaderEdicao"
function EdicaoPerfil() {
  const [formData, setFormData] = useState({
    nome_usuario: "User01",
    nome: "Usuário Teste",
    telefone: "(11) 11111-1111",
    email: "teste@email.com",
    rua: "Rua do Usuário, 01",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

  return (
    <div>
    <HeaderEdicao />
    <div className={Style.container}>
    <div className={Style.colunaForm}>
      <div className={Style.EditContato}>
        <h2 className={Style.h2}>Informações de Contato</h2>

        <div className={Style.campo}>
          <label>Nome de Usuário</label>
          <input
            id="nome_usuario"
            value={formData.nome_usuario}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo("nome_usuario")}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Nome</label>
          <input
            id="nome"
            value={formData.nome}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo("nome")}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Telefone</label>
          <input
            id="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo("telefone")}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Email</label>
          <input
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo("email")} className={Style.button}>Editar</button>
        </div>
        
     
        <div className={Style.campo2}>
          <label className={Style.editFoto}>
          <img src={Style.Upload} />Editar Foto de Perfil <input type="file" accept="image/*" className={Style.picture_input}/>
          </label>
         </div>

      </div>

      <div className={Style.EditEndereco}>
        <h2 className={Style.h2}>Informações de Endereço</h2>

        <div className={Style.campo}>
          <label>Rua</label>
          <input
            id="rua"
            value={formData.rua}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo("rua")}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Bairro</label>
          <input
            id="bairro"
            value={formData.bairro}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo("bairro")}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Cidade</label>
          <input
            id="cidade"
            value={formData.cidade}
            onChange={handleChange}
          />
          <button onClick={() => atualizarCampo("cidade")}>Editar</button>
        </div>

        <div className={Style.campo}>
          <label>Estado</label>
          <select
            id="estado"
            value={formData.estado}
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
          <button onClick={() => atualizarCampo("estado")}>Editar</button>
        </div>
      </div>
    </div>
      <div className={Style.containerfoto}></div>   
    </div>
    </div>
  );
}

export default EdicaoPerfil;
