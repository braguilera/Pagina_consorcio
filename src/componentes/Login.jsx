import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Contexto from '../contexto/Contexto';
import openEye from '../iconos/openEye.svg';
import closeEye from '../iconos/closeEye.svg';
import logo from '../iconos/logo_empresa.svg'

const Login = () => {
    const navegacion = useNavigate();
    const [validarUsuario, setValidarUsuario] = useState({ mail: '', contrasenia: '' });
    const [invalidar, setInvalidar] = useState(false);
    const [usuarioAutenticado, setUsuarioAutenticado] = useState();
    const [mostrarContrasenia, setMostrarContrasenia] = useState(false); // Estado para manejar la visibilidad de la contraseña

    const {
        logearse,
        setUsuarioDni,
        setError,
        setMostrarError,
        setLoading,
        setRol,
        error,
        mostrarError,
        setNombreUsuario
    } = useContext(Contexto);

    useEffect(() => {
        login();
    }, [usuarioAutenticado]);

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
            setTimeout(() => setMostrarError(false), 5000);
        }
    };

    const login = () => {
        if (usuarioAutenticado) {
            logearse("logeado");
            navegacion('/', { replace: true });
            setUsuarioDni(usuarioAutenticado.persona.documento);
            setNombreUsuario(usuarioAutenticado.persona.nombre);
            console.log(usuarioAutenticado);
        } else {
            setInvalidar(true);
        }
    };

    return (
        <section className='login'>
            <article className='login_container'>
                <header>
                    <img
                        src={logo}
                    />
                    <h1>Gestiona tus reclamos con All-Blue</h1>
                    <p>Ingresa tus credenciales para continuar</p>
                </header>
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
                    <div className='login_contaseña_eye'>
                        <input
                            id='contrasenia'
                            type={mostrarContrasenia ? 'text' : 'password'}
                            placeholder='Contraseña'
                            value={validarUsuario.contrasenia}
                            onChange={(e) => setValidarUsuario({ ...validarUsuario, contrasenia: e.currentTarget.value })}
                        />
                        <img
                            src={mostrarContrasenia ? closeEye : openEye} 
                            alt="Mostrar/Ocultar Contraseña"
                            className='mostrar_contraseña'

                            onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                        />
                    </div>

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

export default Login;
