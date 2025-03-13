import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegisterPage from './pages/ResgisterPage'
import LoginPage from './pages/login/LoginPage'
import HomePage from './pages/home/HomePage'
import AlugueisClientePage from "./pages/clientes/AlugueisClientePage"

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path="/alugueis/cliente/:idCliente" element={<AlugueisClientePage/>}></Route>
        
      </Routes>
    </Router>
  )


}

export default App
