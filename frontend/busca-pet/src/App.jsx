import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

import Cadastro from "./pages/public/Cadastro";
import Login from "./pages/public/Login";
import RecuperacaoSenha from "./pages/public/RecuperacaoSenha";
import TelaPost from "./pages/post-pet/TelaPost";
import PetPerdido from "./pages/post-pet/PetPerdido";
import PageResearch from "./pages/PageResearch";
import Home from "./pages/public/Home";
import PostsAll from "./pages/post-pet/postsAll";
import PetEncontrado from "./pages/post-pet/PetEncontrado";
import VisualizePerfil from "./pages/PerfilVisualizar";
import EditarPerfil from "./pages/EditPerfil";
import PostsUser from "./pages/post-pet/PostsUser";
import Notification from "./pages/Notification";
import AdmDenuncias from "./pages/adm/AdmDenuncias.jsx";
import AdmPublicacoes from "./pages/adm/AdmPublicacoes";
import TelaAdm from "./pages/adm/Administrador.jsx";
import AdmUsuarios from "./pages/adm/AdmUsuarios.jsx";

import API_KEY from "./config/maps-api.js";

const libraries = ["places", "geometry"];

function App() {
  if (!API_KEY) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h1>Erro de Configuração</h1>
        <p>A chave da API do Google Maps não está configurada.</p>
        <p>
          Por favor, adicione `REACT_APP_Maps_API_KEY` ao seu arquivo .env e
          reinicie o servidor de desenvolvimento.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <LoadScript
          googleMapsApiKey={API_KEY}
          libraries={libraries}
          loadingElement={
            <div style={{ textAlign: "center", padding: "50px" }}>
              Carregando Google Maps...
            </div>
          }
          onError={(error) => {
            console.error("Erro ao carregar Google Maps Script:", error);
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form/cadastro-usuario" element={<Cadastro />} />
            <Route path="/form/login" element={<Login />} />
            <Route
              path="/form/recuperacao-senha"
              element={<RecuperacaoSenha />}
            />
            <Route
              path="/posts/criar-post/pet-perdido"
              element={<PetPerdido />}
            />
            <Route
              path="/posts/criar-post/pet-encontrado"
              element={<PetEncontrado />}
            />
            <Route path="/posts/criar-post" element={<TelaPost />} />
            <Route path="/posts/pesquisa" element={<PageResearch />} />
            <Route path="/posts/all" element={<PostsAll />} />
            <Route path="/Perfil" element={<VisualizePerfil />} />
            <Route path="/EditarPerfil" element={<EditarPerfil />} />
            <Route path="/Posts/user" element={<PostsUser />} />
            <Route path="/user/notificacao" element={<Notification />} />
            <Route path="/adm" element={<TelaAdm />} />
            <Route path="/adm/usuarios" element={<AdmUsuarios />} />
            <Route path="/adm/denuncias" element={<AdmDenuncias />} />
            <Route path="/adm/publicacoes" element={<AdmPublicacoes />} />
          </Routes>
        </LoadScript>
      </BrowserRouter>
    </div>
  );
}

export default App;
