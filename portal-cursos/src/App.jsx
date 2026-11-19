import { NavLink, Routes, Route } from "react-router";
import Inicio from "./pages/Inicio.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Usuarios from "./pages/Usuarios.jsx";

export default function App() {
  return (
    <div className="container">
      <header>
        <strong>Salzintech • Portal de Cursos do Salzin</strong>
        <nav aria-label="Menu principal">
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/cadastro">Cadastro</NavLink>
          <NavLink to="/usuarios">Usuários</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Routes>
      </main>
    </div>
  );
}
