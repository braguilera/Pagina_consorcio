import React, { useContext, useEffect, useState } from 'react'
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import { motion } from 'framer-motion';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import Paginacion from '../funcionalidades/Paginacion';

const Unidad = () => {

    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);

    const [unidades, setUnidades] = useState([]);
    const [unidadesFiltradas, setUnidadesFiltradas] = useState([]);

    const unidadesPorPagina = 10;
    const indiceInicio = (paginaActual - 1) * unidadesPorPagina;
    const indiceFin = indiceInicio + unidadesPorPagina;
    const unidadesPaginados = unidadesFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(unidadesFiltradas.length / unidadesPorPagina);


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
        }
        finally {
            setLoading(false);
        }
    };

    const obtenerUnidades = async () => {
        if (!idEdificio) return; 
        setLoading(true);
        try {
            const data = await fetchDatos(`http://localhost:8080/unidad/unidades_por_edificio/${idEdificio}`);
            setUnidades(data);
            setUnidadesFiltradas(data); 
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

    useEffect(()=>{
        obtenerUnidades();
    }, [idEdificio])


    const filtrarUnidad = (event) => {
        const idUnidad = event.target.value.toUpperCase();
        setIdBusqueda(idUnidad);
        if (idUnidad === '') {
            setUnidadesFiltradas(unidades);
        } else {
            const filtrados = unidades.filter(unidad =>
                unidad.id.toString().startsWith(idUnidad)
            );
            setUnidadesFiltradas(filtrados);
        }
        setPaginaActual(1);
    };

    const filtrarPorEdificio = (e) => {
        const selectedId = e.target.value;
        setIdEdificio(selectedId);
        setPaginaActual(1);
    };

    return (
        <>
            <section className='unidades'>
                <main className='unidades_main'>

                        {loading ? (
                            <AnimacionCarga columnas={['Documento', 'Nombre']} filas={unidadesPorPagina}/>
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
                                            onChange={filtrarUnidad}
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
                                                <th>Id</th>
                                                <th>Unidad</th>
                                                <th>Piso</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        {unidadesPaginados.length > 0 ? (
                                            unidadesPaginados.map((unidad, index) => (
                                                <motion.tr 
                                                className='tabla_objeto'
                                                initial={{ opacity: 0, y: -50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 1, delay: index * 0.07, type: "spring" }}
                                                exit={{ opacity: 0, y: -50 }}
                                                key={`${unidad.id}${index}`}
                                                >
                                                    <td>{unidad.id}</td>
                                                    <td>{unidad.numero}</td>
                                                    <td>{unidad.piso}</td>
                                                    <td>{(unidad.habitado) ? "Habitado" : "Deshabitado"}</td>

                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No se encontró ninguna unidad.</td>
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
    )
}

export default Unidad
