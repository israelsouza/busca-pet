import HeaderForm from "../components/HeaderForm";
import InputTxt from "../components/InputTxt";
import Option from "../components/Option";

function Cadastro() {
  const UF = [
    "Selecione",
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
    <div>
      <div className="form-cad">
        <HeaderForm />

        <div className="form-cad__body">
          <h2>
            Cadastre-se e ajude a construir finais felizes para pets perdidos!
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

            <div>
              <label> Estado </label>

              <div>
                <select name="" id="">
                  {UF.map((currValue, index) => (
                    <Option value={currValue} disable="disable" key={index} />
                  ))}
                </select>
              </div>
            </div>
          </form>

          <button>Cadastrar</button>
          <p>
            Já tem cadastro? <a href="">Faça o login</a>
          </p>
        </div>
      </div>

      <div className="form-cad__image">
        
      </div>
    </div>
  );
}

export default Cadastro;
