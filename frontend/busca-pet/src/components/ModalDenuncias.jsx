import React, { useState } from "react";
import style from "./styles/ModalDenuncia.module.css";

const tipos = ['Golpe', 'Agressão Verbal', 'Conteúdo Inapropriado', 'Importunação sexual', 'Calunia', 'Intolerância Religiosa', 'Intolerância Racial', 'Outros'];

function ModalDenuncia({ petId, onClose, onSubmit }) {
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = () => {
    if (!tipo) {
      alert('Por favor, selecione o tipo de denúncia.');
      return;
    }
    if (!descricao.trim()) {
      alert('Por favor, descreva o motivo da denúncia.');
      return;
    }
    
    // O onSubmit é a função que vem do componente pai (PostsAll)
    onSubmit({ tipo, descricao, petId });
    onClose(); // Fecha o modal após enviar
  };

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <h2>Denunciar</h2>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecione o tipo</option>
          {tipos.map((t, i) => <option key={i} value={t}>{t}</option>)}
        </select>
        <textarea
          placeholder="Descreva o motivo..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className={style.botoes}>
          <button onClick={handleSubmit}>Enviar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalDenuncia;