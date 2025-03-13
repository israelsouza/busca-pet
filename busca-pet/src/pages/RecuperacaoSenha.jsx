import React from "react";
import HeaderForm from "../components/HeaderForm";
import InputTxt from "../components/InputTxt";
import ButtonForm from "../components/ButtonForm";

const RecuperacaoSenha = () => {
  return (
    <div className="rec-senha">
      <div className="rec-senha__form">
        <div className="rec-senha__header">
          <HeaderForm />
        </div>

        <div className="rec-senha__body">
          <div className="rec-senha__box-title">
            <h2 className="rec-senha__title">
              Esqueceu a senha? Vamos Recupera-la!
            </h2>
          </div>

          <div className="rec-senha__box-form">
            <InputTxt name="Email" place="Insira o seu email aqui" />
            <InputTxt
              name="Código de validação"
              place="Digite o código de validação recebido por e-mail"
            />
            <InputTxt name="Nova Senha" place="Insira a sua nova senha" />
            <InputTxt
              name="Confirme a nova senha"
              place="Insira novamente a sua nova senha"
            />
          </div>

          <div className="rec-senha__box-btn">
            <ButtonForm placeholder="Redefinir Senha" />
          </div>
        </div>
      </div>

      <div className="rec-senha__image"></div>
    </div>
  );
};

export default RecuperacaoSenha;
