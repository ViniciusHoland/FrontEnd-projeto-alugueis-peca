import "./LoginPage.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
    const [errorMessage, setErrorMessage] = useState("");

    

    const login = async () =>{

        setErrorMessage('usuario ou senha invalidos')
    }

    return (
        <div className="container">
            <div className="branding">
                <img alt="Invest Logo" className="logo" />
                <h1>INVEST POPULATION SOFTWARE</h1>
                <hr />
            </div>
            <div className="login-box">
                <div className="icon">
                    <img src="" alt="" />
                </div>

                <form>
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Senha" required />
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
