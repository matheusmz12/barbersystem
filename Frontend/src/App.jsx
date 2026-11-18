import { Route, Routes, Navigate } from "react-router-dom";
import Servicos from "./pages/Servicos.jsx";
import Barbeiros from "./pages/Barbeiros.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/servicos" replace/>} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/barbeiros" element={<Barbeiros />} />
    </Routes>
  );
}

export default App;
