import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import RecuperacaoSenha from "./pages/RecuperacaoSenha";
import TelaPost from "./pages/TelaPost";
import PetPerdido from "./pages/PetPerdido";
import PageResearch from "./pages/PageResearch";
import Home from "./pages/Home";
import PostsAll from "./pages/postsAll";
import VisualizePerfil from "./pages/PerfilVisualizar";
import EditarPerfil from "./pages/EditPerfil";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form/cadastro-usuario" element={<Cadastro />} />
          <Route path="/form/login" element={<Login />} />
          <Route
            path="/form/recuperacao-senha"
            element={<RecuperacaoSenha />}
          />
          <Route path="/posts/criar-post/pet-perdido" element={<PetPerdido />} />
          <Route path="/posts/criar-post" element={<TelaPost />} />
          <Route path="/posts/pesquisa" element={<PageResearch />} />
          <Route path="/posts/all" element={<PostsAll />} />
          <Route path="/Perfil" element={<VisualizePerfil />}/>
          <Route path="/EditarPerfil" element={<EditarPerfil />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
