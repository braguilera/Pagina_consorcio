import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Contexto from '../contexto/Contexto';
import usuarios from '../datos/usuarios'
import { use } from 'framer-motion/client';

const Login = () => {
    const navegacion=useNavigate();
    const [invalidar, setInvalidar]=useState(false);
    const [validarUsuario, setValidarUsuario] = useState({ mail: '', contrasenia: '' });
    const [usuarioAutenticado, setUsuarioAutenticado] = useState();

    const {
        logearse,
        setUsuarioDni,
        setError,
        setMostrarError,
        setLoading,
        setRol
    } = useContext(Contexto);

    useEffect(()=>{

        login();

    },[usuarioAutenticado]);

    const manejarSubmit = async (e) => {
        e.preventDefault();

        if (!validarUsuario.mail || !validarUsuario.contrasenia) {
            setError("Ambos campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        try {
            setLoading(true);

            const url = `http://localhost:8080/cuenta/iniciar_sesion?mail=${encodeURIComponent(validarUsuario.mail)}&contrasenia=${encodeURIComponent(validarUsuario.contrasenia)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            setLoading(false);

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor.");
            }

            const data = await response.json();

            if (!data.estado) {
                setError(data.persona === null ? "Usuario no encontrado." : "Contraseña incorrecta.");
                setMostrarError(true);
                setTimeout(() => setMostrarError(false), 3000);
                return;
            }

                setRol(data.roles[0].rol);
                setUsuarioAutenticado(data);
    

        } catch (error) {
            setError("Error en la conexión con el servidor.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            setLoading(false);
        }
    };
    

    const login=()=>{
        if (usuarioAutenticado){
            logearse("logeado");
            navegacion('/',{replace:true})
            setUsuarioDni(usuarioAutenticado.persona.documento)
        }
        else{
            setInvalidar(true);

            setTimeout(() => {
                setInvalidar(false);
            }, 2000);
        }
    }
    
    return (
        <section className='login'>
            <article className='login_container'>
                <div>
                    <h1>Bienvenido de nuevo a XXXXX</h1>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>
                <form onSubmit={manejarSubmit}>
                    <label htmlFor='mail'>Usuario</label>
                    <input 
                        id="mail" 
                        onChange={(e) => setValidarUsuario({ ...validarUsuario, mail: e.currentTarget.value })} 
                        placeholder='Mail' 
                        value={validarUsuario.mail}
                        autoFocus autoComplete='off'
                    />

                    <label htmlFor='contrasenia'>Contraseña</label>
                    <input 
                        id='contrasenia' 
                        type='password'
                        placeholder='Contraseña' 
                        value={validarUsuario.contrasenia}
                        onChange={(e) => setValidarUsuario({ ...validarUsuario, contrasenia: e.currentTarget.value })}
                    />

                    <p className={invalidar ? "dato_invalido" : null}>
                        {invalidar && "Datos inválidos"}
                    </p>

                    <button type='submit'>Iniciar sesión</button>
                </form>
            </article>
        </section>
    );
}

export default Login
