import React, { useContext, useEffect, useState } from 'react';
import { fetchDatos } from '../../datos/fetchDatos';
import Paginacion from '../funcionalidades/Paginacion';
import Contexto from '../../contexto/Contexto';
import eliminar from '../../iconos/eliminar.svg';
import { motion } from 'framer-motion';
import { tr } from 'framer-motion/client';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';

const Persona = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [personasFiltradas, setPersonasFiltradas] = useState([]);

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
        try {
            const data = await fetchDatos('http://localhost:8080/edificio/edificios');
            setEdificios(data);
            if (data.length > 0) setIdEdificio(data[0].codigo); 
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
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
            const response = await fetchDatos(`http://localhost:8080/persona/eliminar_persona/${idPersona}`, {
                method: 'DELETE'
            }).then(res => res.json()).then(res => console.log(res))

            if (response.ok) {
                setPersonas((prevPersonas) => prevPersonas.filter(persona => persona.documento !== idPersona));
                setPersonasFiltradas((prevPersonas) => prevPersonas.filter(persona => persona.documento !== idPersona));
                alert("Persona eliminada exitosamente.");
            } else {
                throw new Error("No se pudo eliminar la persona. Intenta nuevamente.");
            }
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    return (
        <>
            <section className='personas'>
                <main className='edificios_main'>

                        {loading ? (
                            <AnimacionCarga columnas={['Documento', 'Nombre']} />
                        ) : (
                            <table className='tabla_container'>
                                <div className='tabla_container_items'>
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

                                    <input
                                        id='dniPersona'
                                        type='text'
                                        placeholder='Buscar por DNI'
                                        value={idBusqueda}
                                        onChange={filtrarPersonas}
                                    />
                                    <tbody className='tabla_body'>
                                        <thead className='tabla_encabezado'>
                                            <tr>
                                                <th>Documento</th>
                                                <th>Nombre</th>
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
                                                    <img 
                                                        src={eliminar} 
                                                        alt='Botón para eliminar persona' 
                                                        onClick={() => eliminarPersona(persona.documento)} 
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
            </section>
        </>
    );
};

export default Persona;
