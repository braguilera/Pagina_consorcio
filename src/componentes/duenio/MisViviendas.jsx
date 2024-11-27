import { use } from 'framer-motion/client';
import React, { useContext, useEffect, useState } from 'react'
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import Paginacion from '../funcionalidades/Paginacion';
import { motion } from 'framer-motion';

const MisViviendas = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual, usuarioDni } = useContext(Contexto);

    const [viviendas, setViviendas] = useState();
    const [viviendasFiltradas, setViviendasFiltradas] = useState([]);

    const viviendasPorPagina = 10;
    const indiceInicio = (paginaActual - 1) * viviendasPorPagina;
    const indiceFin = indiceInicio + viviendasPorPagina;
    const viviendasPaginados = viviendasFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(viviendasFiltradas.length / viviendasPorPagina);

    useEffect(() => {
        obtenerViviendas();
    }, []);

    const obtenerViviendas = async () => {
        
        setLoading(true);
        try {
            const data = await fetchDatos(`http://localhost:8080/unidad/buscar_unidad_duenios/${usuarioDni}`);
            setViviendas(data)
            setViviendasFiltradas(data);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const filtrarViviendas = (event) => {
        const idUnidad = event.target.value.toUpperCase();
        setIdBusqueda(idUnidad);

        if (idUnidad === '') {
            setViviendasFiltradas(viviendas);
        } else {
            const filtrados = viviendas.filter(vivienda =>
                vivienda.numero && vivienda.numero.toString().toUpperCase().startsWith(idUnidad)
            );
            
            setViviendasFiltradas(filtrados);
        }
        setPaginaActual(1);
    };

    return (
        <section className='misViviendas'>

            <header>
                <h2>Mis Viviendas</h2>
                <p><em>Gestiona las propiedades que están a tu nombre.</em></p>
            </header>
            <p>Visualiza las viviendas de las cuales eres propietario. Conoce su estado actual y si están habitadas o disponibles.</p>

                <main className='misViviendas_main'>

                    {loading ? (
                        <AnimacionCarga columnas={['Id', 'Piso', 'Edificio', 'Dirección', 'Estado']} filas={viviendasPorPagina} mostrarSelect={false} />
                    ) : (
                        <table className='tabla_container'>
                            <div className='tabla_container_items'>
                                <header className='persona_tabla_header'>
                                    <input
                                        id='dniPersona'
                                        className='buscador_tabla'
                                        type='text'
                                        placeholder='Buscar por unidad'
                                        value={idBusqueda}
                                        onChange={filtrarViviendas}
                                    />
                                </header>
                                <tbody className='tabla_body'>
                                    <thead className='tabla_encabezado'>
                                        <tr>
                                            <th>Id</th>
                                            <th>Piso</th>
                                            <th>Edificio</th>
                                            <th>Dirección</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    {viviendasPaginados.length > 0 ? (
                                        viviendasPaginados.map((vivienda, index) => (
                                            <motion.tr
                                                
                                                className='tabla_objeto'
                                                initial={{ opacity: 0, y: -50}}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 1, delay: index * 0.07, type: "spring" }}
                                                exit={{ opacity: 0, y: -50 }}
                                                key={`${vivienda.id}${index}`}
                                            >
                                                <td>{vivienda.numero}</td>
                                                <td>{vivienda.piso}</td>
                                                <td>{vivienda.edificio.nombre}</td>
                                                <td>{vivienda.edificio.direccion}</td>
                                                <td className={vivienda.habitado ? 'unidad_ocupada' : 'unidad_libre'}>
                                                    {vivienda.habitado ? "Ocupado" : "Libre"}
                                                </td>
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
    </section>
    )
}

export default MisViviendas
