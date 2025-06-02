import React, { useState } from "react";
import enviarDados from "../assets/utils/enviarDados.js";
import style from "./styles/ModalDenuncia.module.css";

const tipos = [
  "Golpe",
  "Agressão Verbal",
  "Conteúdo Inapropriado",
  "Importunação sexual",
  "Calunia",
  "Intolerância Religiosa",
  "Intolerância Racial",
  "Outros",
];

function ModalDenuncia({ onClose, onSubmit, post }) {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async () => {
    try {
      validateData(tipo, descricao)
      const resultData = await submitData(tipo, descricao)
      onClose();     
    } catch (error) {
      console.error(error)
      alert('Ocorreu um erro')
    }
  };

  function validateData(tipo, descricao) {
    if (!tipo) {
      alert("Por favor, selecione o tipo de denúncia.");
      return false;
    }
    if (!descricao.trim()) {
      alert("Por favor, descreva o motivo da denúncia.");
      return false;
    }
    return true;
  }

  async function submitData(tipo, descricao) {
    const data = {tipo: tipo, descricao: descricao, idPost: post.POS_ID}
    try {
      const result = await enviarDados(data, `api/adm/denuncia`)
      const result = await enviarDados(data, `api/posts/denuncia`)
      console.log(result);
      alert("Denúncia enviada com sucesso!");
    } catch (error) {
      console.error(error)
      alert("Denúncia: ERRO AO enviar ");
    }    
  }

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <h2>Denunciar</h2>
        <select className={style.selecao} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecione o tipo</option>
          {tipos.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Descreva o motivo..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className={style.botoes}>
          <button onClick={ () => {
            console.log("onClick DenunciaCompon")
            handleSubmit()
          }}>Enviar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalDenuncia;
