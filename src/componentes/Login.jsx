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
    
    return (
    <>
    <section className='login'>
        <article className='login_container'>
            <div>
                <h1>Bienvenido de nuevo a XXXXX</h1>
                <p>Ingresa tus credenciales para continuar</p>
            </div>
            <div className='login_inputs'>
                <label htmlFor='usuario'>Usuario</label>
                <input id="usuario" onChange={(e)=>setUsuario(e.currentTarget.value)} placeholder='Nombre de usuario' autoFocus autoComplete='off'/>
            </div>

            <div className='login_inputs'>
            <label htmlFor='contrasenia'>Contraseña</label>
            <input id='contrasenia' placeholder='Contraseña'/>
            </div>

            <button onClick={login}>Iniciar sesión</button>
        </article>
    </section>
    </>
    )
}

export default Login
