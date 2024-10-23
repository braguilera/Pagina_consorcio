import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Contexto from '../contexto/Contexto';

const Login = () => {
    const{logearse,setUsuario}=useContext(Contexto);
    const navegacion=useNavigate();


    const login=()=>{
        logearse("logeado");
        navegacion('/',{replace:true})
    }
    
    const registro=(e)=>{
        setUsuario(e.currentTarget.value)
    }
    return (
    <>
    <section className='login'>
            <h1>Login</h1>
            <label htmlFor='usuario'>Usuario</label>
            <input id="usuario" onChange={registro} placeholder='Nombre de usuario' autoFocus autoComplete='off'/>
            <button onClick={login}>Iniciar sesión</button>
    </section>
    </>
    )
}

export default Login
