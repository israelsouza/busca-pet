import Logo from "./imgs/logo.png";
import "./Style.css";

function login() {
  return (
    <>
      <header>
        <img src={Logo} alt="cachorro olhando por tras de uma lupa" />
        <h1>BuscaPet</h1>
      </header>

      <div className="conjuntoEsquerdo">
        <h2>
          Bem-vindo de volta!<br></br>Vamos encontrar mais pets juntos?
        </h2>

        <form action="">

          <div className="campos">
            <label htmlFor="email">Email</label>
            <input type="text" placeholder="Digite a sua senha"></input>
          </div>

          <div className="campos">
            <label htmlFor="senha">Senha</label>
            <input type="text" placeholder="Digite a sua senha"></input>
          </div>

          <button>Login</button>
        </form>

        <div className="redirect">
          <p>
            Ainda não tem cadastro? <a href="">Cadastre-se!</a>
          </p>
          <p>
            Esqueceu a senha? <a href="">Recupere-a!</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default login;
