import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import RecuperacaoSenha from "./pages/RecuperacaoSenha";
import TelaPost from "./pages/TelaPost";
import PageResearch from "./pages/PageResearch";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/form/cadastro" element={<Cadastro />} />
          <Route path="/form/login" element={<Login />} />
          <Route path="/form/recuperacao-senha" element={<RecuperacaoSenha />} />

          <Route path="/posts/criar-post" element={<TelaPost />} />
          <Route path="/posts/pesquisa" element={<PageResearch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
