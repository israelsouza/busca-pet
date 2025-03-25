import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import RecuperacaoSenha from "./pages/RecuperacaoSenha";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/form/cadastro-usuario" element={<Cadastro />} />
          <Route path="/form/login" element={<Login />} />
          <Route path="/form/recuperacao-senha" element={<RecuperacaoSenha />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
