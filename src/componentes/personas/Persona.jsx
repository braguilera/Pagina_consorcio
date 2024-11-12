import React, { useContext, useEffect, useState } from 'react'; 
import { fetchDatos } from '../../datos/fetchDatos';
import Paginacion from '../funcionalidades/Paginacion';
import Contexto from '../../contexto/Contexto';
import eliminar from '../../iconos/eliminar.svg';
import { motion } from 'framer-motion';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import { AnimatePresence, easeIn, easeOut } from 'react-magic-motion';


const Persona = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [personasFiltradas, setPersonasFiltradas] = useState([]);
    const [alertaEliminacion, setAlertaEliminacion] = useState(false);
    const [dniPersonaEliminar, setDniPersonaEliminar] = useState();

    const [nuevaPersona, setNuevaPersona] = useState({ documento: '', nombre: '', idUnidad: '', rol: '' });

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
        const { documento, nombre, idUnidad, rol } = nuevaPersona;
    
        if (!documento || !nombre || !rol) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
    
        try {
            // Agregar la persona en general
            const response = await fetch('http://localhost:8080/persona/agregar_persona', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documento, nombre }),
            });
    
            if (!response.ok) throw new Error('Error al agregar la persona');
    
            const data = await response.json();
            setPersonas((prevPersonas) => [...prevPersonas, data]);
            setPersonasFiltradas((prevPersonas) => [...prevPersonas, data]);
    
            // Si es dueño o inquilino, asigna la persona a la unidad
            if (rol === 'duenio' || rol === 'inquilino') {
                await fetch(`http://localhost:8080/agregar_${rol}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codigo: idUnidad, documento }),
                });
    
                // Marca la unidad como habitada si se asignó un dueño o inquilino
                await fetch(`http://localhost:8080/habitar_unidad/${idUnidad}`, {
                    method: 'PUT',
                });
            }
    
            // Limpia el formulario
            setNuevaPersona({ documento: '', nombre: '', idUnidad: '', rol: '' });
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
                                    <header
                                    className='persona_tabla_header'
                                    >
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
                                                    <td>Nombre de usuario</td>
                                                    <td>Rol del usuario</td>
                                                    <img 
                                                        src={eliminar} 
                                                        alt='Botón para eliminar persona' 
                                                        onClick={() => (setAlertaEliminacion(true), setDniPersonaEliminar(persona.documento))} 
                                                    />
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No se encontró ninguna persona.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </div>
                                <Paginacion
                                    totalPaginas={totalPaginas}
                                    paginaActual={paginaActual}
                                    setPaginaActual={setPaginaActual}
                                />
                            </table>
                        )}
                        <motion.aside 
                        className='agregar_edificio_container'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>Agregar Nueva Persona</h3>
                        <motion.form 
                            onSubmit={manejarSubmit} 
                            className='agregar_edificio_form'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <label>
                                Documento:
                                <motion.input
                                    type="text"
                                    name="documento"
                                    placeholder='Ingresar el documento'
                                    value={nuevaPersona.documento}
                                    onChange={manejarCambio}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    whileBlur={{ scale: 1 }}
                                />
                            </label>
                            <br />
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
                            <br />
                            <label>
                            Rol:
                                <select
                                    name="rol"
                                    value={nuevaPersona.rol}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Seleccionar Rol</option>
                                    <option value="dueño">Dueño</option>
                                    <option value="inquilino">Inquilino</option>
                                    <option value="sinAsignar">Sin Asignar</option>
                                </select>
                            </label>
                            <br />
                            <label>
                                ID Unidad:
                                <motion.input
                                    type="text"
                                    name="idUnidad"
                                    placeholder='Ingresar el ID de la unidad'
                                    value={nuevaPersona.idUnidad}
                                    onChange={manejarCambio}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    whileBlur={{ scale: 1 }}
                                />
                            </label>
                            <br />
                            <motion.button 
                                className='boton_general'
                                type="submit"
                                whileHover={{ scale: 1.07 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Agregar Persona
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
            </section>
        </>
    );
};

export default Persona;