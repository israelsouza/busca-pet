import React, { useState } from "react";
import Style from "../pages/styles/EditPerfil.module.css";
import fundo_passaro from "../assets/imgs/fundo_passaro.png";
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
    <div className={Style.container}>

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
          <button onClick={() => atualizarCampo("email")}>Editar</button>
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
          </select>
          <button onClick={() => atualizarCampo("estado")}>Editar</button>
        </div>
      </div>
      <div className={Style.containerfoto}></div> 
    </div>
  );
}

export default EdicaoPerfil;
