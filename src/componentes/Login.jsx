import React from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navegacion=useNavigate();

    const login=()=>{
        navegacion('/',{replace:true})
    }

    return (
    <div>
            <h1>Login</h1>
            <button onClick={login}>Cerrar sesión</button>
    </div>
    )
}

export default Login
