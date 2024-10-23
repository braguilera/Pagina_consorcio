import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Contexto from '../contexto/Contexto';

const Login = () => {
    const{logearse}=useContext(Contexto);
    const navegacion=useNavigate();

    const login=()=>{
        logearse("logeado");
        navegacion('/',{replace:true})
    }

    return (
    <div>
            <h1>Login</h1>
            <button onClick={login}>Iniciar sesión</button>
    </div>
    )
}

export default Login
