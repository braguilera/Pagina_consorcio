import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Contexto from '../contexto/Contexto';
import usuarios from '../datos/usuarios'

const Login = () => {
    const{logearse,setUsuario,usuario,password,setPassword}=useContext(Contexto);
    const navegacion=useNavigate();
    const [invalidar, setInvalidar]=useState(false)

    const login=()=>{
        const prueba=usuarios.find(dato=> dato.username==usuario && dato.password==password);
        if (prueba){
            logearse("logeado");
            navegacion('/',{replace:true})
        }
        else{
            setInvalidar(true);

            setTimeout(() => {
                setInvalidar(false);
            }, 2000);
        }

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
                <input id='contrasenia' placeholder='Contraseña' onChange={(e)=>setPassword(e.currentTarget.value)}/>
                <p className={(invalidar) ? "dato_invalido":null}
                            >Datos invalidos</p>
            </div>

            <button onClick={login}>Iniciar sesión</button>
        </article>
    </section>
    </>
    )
}

export default Login
