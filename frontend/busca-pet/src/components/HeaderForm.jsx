import logo from "../assets/imgs/Logo.png";

function HeaderForm() {
  return (
    <div className="header-form">
      <img src={logo} alt="Imagem de um cachorro com uma lupa" />
      <h1>BuscaPet</h1>
    </div>
  );
}

export default HeaderForm;
