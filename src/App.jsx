import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegisterPage from './pages/ResgisterPage'
import LoginPage from './pages/login/LoginPage'
import HomePage from './pages/home/HomePage'
import AlugueisClientePage from "./pages/clientes/AlugueisClientePage"
import CadastroCliente from "./pages/clientes/CadastroCliente"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path="/clientes/cadastro" element={<CadastroCliente/>}></Route>
        <Route path="/alugueis/cliente/:idCliente" element={<AlugueisClientePage/>}></Route>
        
      </Routes>
    </Router>
  )


}

export default App
