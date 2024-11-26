import React, { useContext, useEffect, useState } from 'react';
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import loader from '../../iconos/loader.svg';

const Perfil = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, usuarioDni } = useContext(Contexto);

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
            // Variables para almacenar los datos a actualizar
            let datosActualizados = {};
    
            // Si el nombre fue modificado, realizamos un PUT para actualizarlo
            if (nuevosDatos.nombre && nuevosDatos.nombre !== misDatos.persona.nombre) {
                datosActualizados.nombre = nuevosDatos.nombre;
            }
    
            // Si el mail fue modificado, realizamos un PUT para actualizarlo
            if (nuevosDatos.mail && nuevosDatos.mail !== misDatos.mail) {
                datosActualizados.mail = nuevosDatos.mail;
            }
    
            // Si la contraseña fue modificada, realizamos un PUT para actualizarla
            if (nuevosDatos.contrasenia) {
                datosActualizados.contrasenia = nuevosDatos.contrasenia;
            }
    
            // Si se han actualizado los datos, realizamos el PUT
            if (Object.keys(datosActualizados).length > 0) {
                // Actualizamos los datos de la persona (nombre)
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
    
                // Actualizamos los datos de la cuenta (mail)
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
    
                // Actualizamos la contraseña solo si fue modificada
                if (datosActualizados.contrasenia) {
                    await fetch('http://localhost:8080/cuenta/actualizar_cuenta', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            codigoCuenta: misDatos.id,
                            dni: misDatos.persona.documento,
                            mail: datosActualizados.mail || misDatos.mail, // Si el mail no se actualizó, se mantiene el viejo
                            contrasenia: datosActualizados.contrasenia
                        })
                    });
                }
            }
    
            // Después de guardar los cambios, actualizamos los datos en el estado
            setMisDatos({
                ...misDatos,
                persona: { ...misDatos.persona, nombre: nuevosDatos.nombre || misDatos.persona.nombre },
                mail: nuevosDatos.mail || misDatos.mail
            });
            setEditarDatos(false); // Cerramos el formulario de edición
    
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
                </article>

                {editardatos && (
                    <article>
                        <h2> Editar mis datos </h2>

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
                    </article>
                )}
            </main>
        </section>
    );
};

export default Perfil;
