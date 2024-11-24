import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Contexto from '../contexto/Contexto';
import usuarios from '../datos/usuarios'
import { use } from 'framer-motion/client';

const Login = () => {
    const navegacion=useNavigate();
    const [validarUsuario, setValidarUsuario] = useState({ mail: '', contrasenia: '' });
    const [invalidar, setInvalidar] = useState(false)
    const [usuarioAutenticado, setUsuarioAutenticado] = useState();

    const {
        logearse,
        setUsuarioDni,
        setError,
        setMostrarError,
        setLoading,
        setRol,
        error,
        mostrarError,
        deslogearse
    } = useContext(Contexto);

    useEffect(()=>{
        login();
    },[usuarioAutenticado]);

    const manejarSubmit = async (e) => {
        e.preventDefault();

        if (!validarUsuario.mail || !validarUsuario.contrasenia) {
            setError("Ambos campos son obligatorios.");
            setMostrarError(true);
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

            console.log(data)

            if (!data.estado) {
                setError(data.persona === null ? "Usuario no encontrado." : "Contraseña incorrecta.");
                setMostrarError(true);
                return;
            }
                setRol(data.roles[0].rol);
                setUsuarioAutenticado(data);
        } catch (error) {
            setError("Datos invalidos.");
            setMostrarError(true);
            setLoading(false);
        }
    };
    

    const login=()=>{
        if (usuarioAutenticado){
            console.log(usuarioAutenticado)
            logearse("logeado");
            navegacion('/',{replace:true})
            setUsuarioDni(usuarioAutenticado.persona.documento)
        }
        else{
            setInvalidar(true);
        }
    }
    
    return (
        <section className='login'>
            <article className='login_container'>
                <div>
                    <h1>Bienvenido de nuevo a XXXXX</h1>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>
                <form onSubmit={manejarSubmit} className='login_form'>
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

                    <div className="dato_invalido">
                        {mostrarError && (
                            <div style={{
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                                zIndex: '1000'
                            }}>
                                {error}
                            </div>
                        )}
                    </div>


                    <button type='submit' onClick={login}>Iniciar sesión</button>
                </form>


            </article>
        </section>
    );
}

export default Login
