import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadScript } from '@react-google-maps/api';

import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import RecuperacaoSenha from "./pages/RecuperacaoSenha";
import TelaPost from "./pages/TelaPost";
import PetPerdido from "./pages/PetPerdido";
import PageResearch from "./pages/PageResearch";
import Home from "./pages/Home";
import PostsAll from "./pages/postsAll";
import PetEncontrado from "./pages/PetEncontrado";
import VisualizePerfil from "./pages/PerfilVisualizar";
import EditarPerfil from "./pages/EditPerfil";
import PostsUser from "./pages/PostsUser";
import Notification from "./pages/Notification";

import API_KEY from './config/maps-api.js';

const libraries = ['places', 'geometry']

function App() {

  if(!API_KEY) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h1>Erro de Configuração</h1>
        <p>A chave da API do Google Maps não está configurada.</p>
        <p>Por favor, adicione `REACT_APP_Maps_API_KEY` ao seu arquivo .env e reinicie o servidor de desenvolvimento.</p>
      </div>
    )
  }



  return (
    <div className="App">
      <BrowserRouter>

        <LoadScript 
          googleMapsApiKey={API_KEY}
          libraries={libraries}
          loadingElement={<div style={{ textAlign: 'center', padding: '50px' }}>Carregando Google Maps...</div>}
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
        </Routes>

        </LoadScript>
      </BrowserRouter>
    </div>
  );
}

export default App;
