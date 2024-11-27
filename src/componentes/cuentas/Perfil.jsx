import React, { useContext, useEffect, useState } from 'react';
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import loader from '../../iconos/loader.svg';
import { AnimatePresence, motion } from 'framer-motion';

const Perfil = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, usuarioDni, setExito, exito, mostrarExito, setMostrarExito } = useContext(Contexto);

    const [cuentas, setCuentas] = useState([]);
    const [misDatos, setMisDatos] = useState();
    const [editardatos, setEditarDatos] = useState(false);
    const [nuevosDatos, setNuevosDatos] = useState({
        nombre: '',
        mail: '',
        contrasenia: ''
    });

    const obtenerCuentas = async () => {
        setLoading(true);
        try {
            const data = await fetchDatos(`http://localhost:8080/cuenta/buscar_todas_cuentas`);
            setCuentas(data);
            
            // Filtrar las cuentas por el documento del usuario
            const filtrarCuentas = data.filter(cuenta => cuenta.persona.documento === usuarioDni);
            setMisDatos(filtrarCuentas[0]);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerCuentas();
    }, [usuarioDni]); // Asegura que se actualicen las cuentas correctamente

    if (!misDatos) {
        return (
            <div style={{position: 'fixed', bottom: '30%', right: '20%', width:'40%', height:'40%', backgroundColor: 'transparent', padding: '10px', borderRadius: '5px'}}>
                <img src={loader} style={{width: '100%', height: '100%'}} />
            </div>
        ); // Cargando si misDatos no está disponible
    }

    const manejarCambio = (e) => {
        setNuevosDatos({
            ...nuevosDatos,
            [e.target.name]: e.target.value
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            let datosActualizados = {};
    
            if (nuevosDatos.nombre && nuevosDatos.nombre !== misDatos.persona.nombre) {
                datosActualizados.nombre = nuevosDatos.nombre;
            }
    
            if (nuevosDatos.mail && nuevosDatos.mail !== misDatos.mail) {
                datosActualizados.mail = nuevosDatos.mail;
            }
    
            if (nuevosDatos.contrasenia) {
                datosActualizados.contrasenia = nuevosDatos.contrasenia;
            }
    
            
            if (Object.keys(datosActualizados).length > 0) {
                if (datosActualizados.nombre) {
                    await fetch('http://localhost:8080/persona/actualizar_persona', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            documento: misDatos.persona.documento,
                            nombre: datosActualizados.nombre
                        })
                    });
                }
    
                
                if (datosActualizados.mail) {
                    await fetch('http://localhost:8080/cuenta/actualizar_cuenta_sin_contrasenia', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            codigoCuenta: misDatos.id,
                            dni: misDatos.persona.documento,
                            mail: datosActualizados.mail
                        })
                    });
                }
    
                if (datosActualizados.contrasenia) {
                    await fetch('http://localhost:8080/cuenta/actualizar_cuenta', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            codigoCuenta: misDatos.id,
                            dni: misDatos.persona.documento,
                            mail: datosActualizados.mail || misDatos.mail, 
                            contrasenia: datosActualizados.contrasenia
                        })
                    });
                }
            }
    
            setMisDatos({
                ...misDatos,
                persona: { ...misDatos.persona, nombre: nuevosDatos.nombre || misDatos.persona.nombre },
                mail: nuevosDatos.mail || misDatos.mail
            });
            setEditarDatos(false);
            setExito("Datos actualizados con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
    
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <section className='perfil'>
            <h1>Mí perfil</h1>

            <main className='perfil_main'>
                <article>
                    <h2> Datos personales </h2>

                    <p>Nombre completo:</p>
                    <p>{misDatos.persona.nombre}</p>

                    <p>Mail:</p>
                    <p>{misDatos.mail}</p>

                    <p>Contraseña:</p>
                    <p>{'*****'}</p>

                    <p>Rol principal:</p>
                    <p>{misDatos.roles[0].rol}</p>

                    <button onClick={() => setEditarDatos(true)}>Editar perfil</button>
                    <AnimatePresence>

                        {editardatos && (
                            <motion.article
                            className="editar"
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3 }}
                            >
                            <h2>Editar mis datos</h2>
                            <form onSubmit={manejarSubmit}>
                                <label>
                                Nombre completo:
                                <input
                                    type="text"
                                    name="nombre"
                                    value={nuevosDatos.nombre || misDatos.persona.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                                </label>

                                <label>
                                Mail:
                                <input
                                    type="email"
                                    name="mail"
                                    value={nuevosDatos.mail || misDatos.mail}
                                    onChange={manejarCambio}
                                    required
                                />
                                </label>

                                <label>
                                Contraseña:
                                <input
                                    type="password"
                                    name="contrasenia"
                                    value={nuevosDatos.contrasenia}
                                    onChange={manejarCambio}
                                />
                                </label>

                                <button type="submit">Guardar cambios</button>
                                
                            </form>
                                <button
                                className="cancelar"
                                onClick={() => setEditarDatos(false)}
                                >
                                Cancelar
                                </button>
                        </motion.article>

                    )}
                    </AnimatePresence>
                </article>

            </main>

            {mostrarError && (
                <motion.div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        zIndex: '1000'
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                >
                    Error: {error}
                </motion.div>
            )}

            {mostrarExito && (
                    <motion.div style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        zIndex: '1000'
                        }}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {exito}
                    </motion.div>
                )}

        </section>
    );
};

export default Perfil;
