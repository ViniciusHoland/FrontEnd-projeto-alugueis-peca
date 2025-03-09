import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegisterPage from './pages/ResgisterPage'
import LoginPage from './pages/login/LoginPage'
import HomePage from './pages/home/HomePage'

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        
      </Routes>
    </Router>
  )


}

export default App
