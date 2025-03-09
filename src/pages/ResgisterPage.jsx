import { useRef } from "react";
import "./RegisterPage.css";
import api from "../services/api";
import {Link} from 'react-router-dom'

function RegisterPage() {
  const inputName = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);

  const registerUser = async () => {

    try {

      const name = inputName.current.value;
      const email = inputEmail.current.value;
      const password = inputPassword.current.value;

      if(name.length < 3){
        alert("O nome deve ser maior que 3 letras ");
        return;
      }
      if(!email.includes("@") || !email.includes(".")){
        alert("Email inválido");
        return;
      }
      if(password.length < 8){
        alert("A senha deve ser maior que 8 caracteres ");
        return;
      }


      await api.post("/register", { name, email, password });

      alert("User registered successfully!");

    } catch (err) {
      console.error("Error registering user:", err); // Para depuração

      if (err.response) {
        console.log("Response data:", err.response.data); // Verifica a resposta do backend
        console.log("Status code:", err.response.status); // Verifica o status HTTP
        console.error(err.response.data.error || "Erro desconhecido ao registrar.");
      } else {
        console.error("Erro ao conectar com o servidor.");
      }
    }

    

  }

  return (
    <div className="register-container">
      <div className="branding">
        <img alt="Invest Logo" className="logo" />
        <h1>Criar Conta</h1>
        <hr />
      </div>
      <div className="register-box">
        <h2>Register</h2>
        <form>
          <input type="text" placeholder="Full Name" ref={inputName} required />
          <input type="email" placeholder="Email" ref={inputEmail} required />
          <input
            type="password"
            placeholder="Password"
            ref={inputPassword}
            required
          />
          <button type="button" onClick={registerUser}>
            REGISTER
          </button>
        </form>
        <div>
          <Link to={"/login"}>
            Faça Login
          </Link>
        </div>
      
      </div>
    </div>
  );
}

export default RegisterPage;
