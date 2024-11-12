import React, { useContext, useEffect, useState } from 'react'; 
import { fetchDatos } from '../../datos/fetchDatos';
import Paginacion from '../funcionalidades/Paginacion';
import Contexto from '../../contexto/Contexto';
import eliminar from '../../iconos/eliminar.svg';
import { motion } from 'framer-motion';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import { AnimatePresence, easeOut } from 'react-magic-motion';

const Persona = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [personasFiltradas, setPersonasFiltradas] = useState([]);
    const [alertaEliminacion, setAlertaEliminacion] = useState(false);
    const [dniPersonaEliminar, setDniPersonaEliminar] = useState();

    const [nuevaPersona, setNuevaPersona] = useState({ documento: '', nombre: '', rol: '', mail: '' });
    const [mensajeExito, setMensajeExito] = useState(false); // Estado para el mensaje de éxito
    

    const personasPorPagina = 10;
    const indiceInicio = (paginaActual - 1) * personasPorPagina;
    const indiceFin = indiceInicio + personasPorPagina;
    const personasPaginados = personasFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(personasFiltradas.length / personasPorPagina);

    const obtenerPersonas = async () => {
        if (!idEdificio) return; 
        setLoading(true);
        try {
            const data = await fetchDatos(`http://localhost:8080/persona/habitantes_por_edificio/${idEdificio}`);
            setPersonas(data);
            setPersonasFiltradas(data); 
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const obtenerEdificios = async () => {
        setLoading(true);
        try {
            const data = await fetchDatos('http://localhost:8080/edificio/edificios');
            setEdificios(data);
            if (data.length > 0) setIdEdificio(data[0].codigo); 
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerEdificios();
    }, []);

    useEffect(() => {
        obtenerPersonas();
    }, [idEdificio]);

    const filtrarPersonas = (event) => {
        const idPersona = event.target.value.toUpperCase();
        setIdBusqueda(idPersona);
        if (idPersona === '') {
            setPersonasFiltradas(personas);
        } else {
            const filtrados = personas.filter(persona =>
                persona.documento.toString().startsWith(idPersona)
            );
            setPersonasFiltradas(filtrados);
        }
        setPaginaActual(1);
    };

    const filtrarPorEdificio = (e) => {
        const selectedId = e.target.value;
        setIdEdificio(selectedId);
        setPaginaActual(1);
    };

    const eliminarPersona = async (idPersona) => {
        try {
            const response = await fetch(`http://localhost:8080/persona/eliminar_persona/${idPersona}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setPersonas((prevPersonas) => prevPersonas.filter(persona => persona.documento !== idPersona));
                setPersonasFiltradas((prevPersonas) => prevPersonas.filter(persona => persona.documento !== idPersona));
            } else {
                throw new Error("No se pudo eliminar la persona. Intenta nuevamente.");
            }
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    const manejarCambio = (e) => {
        setNuevaPersona({
            ...nuevaPersona,
            [e.target.name]: e.target.value
        });


    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        const { documento, nombre, rol, mail } = nuevaPersona;
    
        if (!documento || !nombre || !mail || !rol) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        try {
            // Crear cuenta
            const responseCrearCuenta = await fetch('http://localhost:8080/cuenta/crear_cuenta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni:documento,mail:mail,contrasenia:documento }),
            });

            if (!responseCrearCuenta.ok) {
                throw new Error('Error al crear una cuenta');
            }
    
            // Asignar rol a la cuenta
            const responseAgregarRol = await fetch('http://localhost:8080/cuenta/agregar_rol_cuenta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mail:mail,rol:rol }),
            });

            if (!responseAgregarRol.ok) {
                throw new Error('Error al agregar un rol');
            }
    
            // Mostrar mensaje de éxito sin agregar a la lista
            setMensajeExito(true);
            setNuevaPersona({ documento: '', nombre: '', rol: '', mail: '' });
    
            setTimeout(() => setMensajeExito(false), 3000); // Ocultar mensaje después de 3 segundos
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    return (
        <>
            <section className='personas'>
                <main className='personas_main'>
                    {loading ? (
                        <AnimacionCarga columnas={['Documento', 'Nombre', 'Usuario', 'Rol']} filas={personasPorPagina} mostrarSelect={true}/>
                    ) : (
                        <table className='tabla_container'>
                            <div className='tabla_container_items'>
                                <header className='persona_tabla_header'>
                                    <input
                                        id='dniPersona'
                                        className='buscador_tabla'
                                        type='text'
                                        placeholder='Buscar por DNI'
                                        value={idBusqueda}
                                        onChange={filtrarPersonas}
                                    />
                                    <select
                                        className='personas_select'
                                        value={idEdificio || ''} 
                                        onChange={filtrarPorEdificio}
                                    >
                                        {edificios.map(edificio => (
                                            <option key={edificio.codigo} value={edificio.codigo}>
                                                {edificio.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </header>
                                <tbody className='tabla_body'>
                                    <thead className='tabla_encabezado'>
                                        <tr>
                                            <th>Documento</th>
                                            <th>Nombre</th>
                                            <th>Usuario</th>
                                            <th>Rol</th>
                                        </tr>
                                    </thead>
                                    {personasPaginados.length > 0 ? (
                                        personasPaginados.map((persona, index) => (
                                            <motion.tr 
                                            className='tabla_objeto'
                                            initial={{ opacity: 0, y: -50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1, delay: index * 0.07, type: "spring" }}
                                            exit={{ opacity: 0, y: -50 }}
                                            key={`${persona.documento}-${index}`}
                                            >
                                                <td>{persona.documento}</td>
                                                <td>{persona.nombre}</td>
                                                <td>{persona.mail}</td>
                                                <td>{persona.rol}</td>
                                                <img 
                                                    src={eliminar} 
                                                    alt='Botón para eliminar persona' 
                                                    onClick={() => (setAlertaEliminacion(true), setDniPersonaEliminar(persona.documento))} 
                                                />
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No se encontró ninguna persona.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </div>
                            <Paginacion
                        paginaActual={paginaActual}
                        setPaginaActual={setPaginaActual}
                        totalPaginas={totalPaginas}
                    />
                        </table>
                    )}

                    <motion.aside
                        className='persona_aside'
                        initial={{ x: -500 }}
                        animate={{ x: 0 }}
                        exit={{ x: -500 }}
                        transition={{ duration: 0.5, ease: easeOut }}
                    >
                        <h2>Agregar Persona</h2>
                        <motion.form
                            className='persona_form'
                            onSubmit={manejarSubmit}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <label>
                                Documento:
                                <motion.input
                                    type="text"
                                    name="documento"
                                    placeholder='Ingresar el DNI'
                                    value={nuevaPersona.documento}
                                    onChange={manejarCambio}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    whileBlur={{ scale: 1 }}
                                />
                            </label>
                            <label>
                                Nombre:
                                <motion.input
                                    type="text"
                                    name="nombre"
                                    placeholder='Ingresar el nombre'
                                    value={nuevaPersona.nombre}
                                    onChange={manejarCambio}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    whileBlur={{ scale: 1 }}
                                />
                            </label>
                            <label>
                                Mail:
                                <motion.input
                                    type="email"
                                    name="mail"
                                    placeholder='Ingresar el correo'
                                    value={nuevaPersona.mail}
                                    onChange={manejarCambio}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    whileBlur={{ scale: 1 }}
                                />
                            </label>
                            <label>
                                Rol:
                                <motion.select
                                    name="rol"
                                    value={nuevaPersona.rol}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Seleccionar rol</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="empleado">Empleado</option>
                                    <option value="duenio">Dueño</option>
                                    <option value="inquilino">Inquilino</option>
                                </motion.select>
                            </label>
                            <motion.button 
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Guardar
                            </motion.button>
                        </motion.form>
                    </motion.aside>
                </main>

                {mostrarError && (
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        zIndex: '1000'
                    }}>
                        Error: {error}
                    </div>
                )}

                <AnimatePresence>
                    {alertaEliminacion && (
                        <motion.div 
                            className='alertaEliminar'
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.3, ease: easeOut }}
                        >
                            <p>¿Está seguro de que desea eliminar al usuario con el documento <strong>{dniPersonaEliminar}</strong>?</p>
                            <div className='alertaEliminarBotones'>
                                <button onClick={() => { eliminarPersona(dniPersonaEliminar); setAlertaEliminacion(false); }} className='boton_general'>Aceptar</button>
                                <button onClick={() => setAlertaEliminacion(false)} className='boton_general'>Cancelar</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {mensajeExito && (
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        zIndex: '1000'
                    }}>
                        Persona creada con éxito
                    </div>
                )}

            
            </section>
        </>
    );
};

export default Persona;
