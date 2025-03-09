import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import api from "../../services/api"

function LoginPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const inputEmail = useRef(null)
    const inputPassword = useRef(null)
    const navigate = useNavigate()
    

    const login = async () =>{

        try{

            const email = inputEmail.current.value;
            const password = inputPassword.current.value;

            if(!email.includes("@") || !email.includes(".")){
                alert("Email inválido");
                return;
            }
            if(password.length < 8){
                alert("A senha deve ser maior que 8 caracteres ");
                return;
              }
        

            const response = await api.post('/login', {email, password})

            console.log(response)

            localStorage.setItem('token', response.data.token)
            setErrorMessage('')

            alert('Login successful')
            navigate('/home')

        } catch (err) {
            setErrorMessage(err.response.data)
            console.error("Error: ", err.response.data);
        }


    }

    return (
        <div className="container">
            <div className="branding">
                <img alt="Invest Logo" className="logo" />
                <h1>Alugue Loc SOFTWARE</h1>
                <hr />
            </div>
            <div className="login-box">
                <div className="icon">
                    <img src="" alt="" />
                </div>

                <form>
                    <input type="email" placeholder="Email" ref={inputEmail} required />
                    <input type="password" placeholder="Senha" ref={inputPassword} required />
                    <button type="button" onClick={login}>Login</button>
                    <a href="#">Esqueceu a senha?</a>
                </form>

                {errorMessage && (
                    <div>
                        <p className="error" >Usuario ou senha invalidos</p>
                    </div>
                )}
                <div className="register-Link">
                    <Link to={"/register"}>Registre-se</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
