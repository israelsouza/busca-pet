import HeaderForm from "../components/HeaderForm";
import InputTxt from "../components/InputTxt";
import Option from "../components/Option";

function Cadastro() {
  const UF = [
    "Selecione o seu estado",
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  return (
    <div className="cad">
      <div className="cad-header">
        <div className="form-cad">
          <div className="form-cad__header">
            <HeaderForm />

            <div className="cad__body">
              <h2 className="cad__title">
                Cadastre-se e ajude a construir finais felizes para pets
                perdidos!
              </h2>

              <form>
                <InputTxt name="Nome" place="Digite o seu nome" />
                <InputTxt name="E-mail" place="Digite o seu e-mail" />
                <InputTxt name="Senha" place="Digite a sua senha" />
                <InputTxt name="Telefone" place="Digite o seu telefone" />
                <InputTxt name="Rua" place="Digite o nome da sua rua" />
                <InputTxt name="Bairro" place="Digite o nome do seu bairro" />
                <InputTxt name="CEP" place="Digite o seu CEP" />
                <InputTxt name="Cidade" place="Digite a sua cidade" />

                <div className="imput">
                  <label className="imput__name"> Estado </label>

                  <div>
                    <select
                      name="estadosUF"
                      id="estadosUF"
                      className="imput__element imput__element--select"
                    >
                      {UF.map((currValue, index) => (
                        <Option
                          value={currValue}
                          disable="disable"
                          key={index}
                        />
                      ))}
                    </select>
                  </div>
                </div>
              </form>
              <div className="cad__box-submit">
                <input type="submit" value="Cadastrar" className="cad__btn" />

                <p className="cad__link">
                  Já tem cadastro? <a href="" className="cad__link--login">Faça o login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cad__image"></div>
    </div>
  );
}

export default Cadastro;
