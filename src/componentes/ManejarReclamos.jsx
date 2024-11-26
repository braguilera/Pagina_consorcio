import React, { useContext, useEffect, useState } from 'react';
import AnimacionCarga from './funcionalidades/AnimacionCarga';
import Contexto from '../contexto/Contexto';
import { fetchDatos } from '../datos/fetchDatos';
import Paginacion from './funcionalidades/Paginacion';
import { motion } from 'framer-motion';
import eliminar from '../iconos/eliminar.svg';
import EstadoSelect from './funcionalidades/EstadoSelect';

const ManejarReclamos = () => {
    const {
        error,
        setError,
        loading,
        setLoading,
        mostrarError,
        setMostrarError,
        paginaActual,
        setPaginaActual,
    } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);

    const [reclamos, setReclamos] = useState([]);
    const [reclamosFiltradas, setReclamosFiltradas] = useState([]);
    const reclamosPorPagina = 10;
    const indiceInicio = (paginaActual - 1) * reclamosPorPagina;
    const indiceFin = indiceInicio + reclamosPorPagina;
    const reclamosPaginados = reclamosFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(reclamosFiltradas.length / reclamosPorPagina);

    const [criterioBusqueda, setCriterioBusqueda] = useState('');
    const [alertaTerminado, setAlertaTerminado] = useState(false);
    const [reclamoTerminadoId, setReclamoTerminadoId] = useState(null);

    const cargarReclamos = async () => {
        setLoading(true);
        try {
            const reclamosData = await fetchDatos(
                `http://localhost:8080/reclamo/reclamos_por_edificio/${idEdificio}`
            );
            setReclamos(reclamosData);
            setReclamosFiltradas(reclamosData);
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
        cargarReclamos();
    },[idEdificio])

    useEffect(() => {
        obtenerEdificios();
    }, []);

    const eliminarReclamo = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/reclamo/borrarReclamo/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar el reclamo');
            setReclamos(reclamos.filter((reclamo) => reclamo.numero !== id));
            setReclamosFiltradas(reclamosFiltradas.filter((reclamo) => reclamo.numero !== id));
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {

        try {
            let estadoNuevo = {numero:id, estado:nuevoEstado }

            console.log(estadoNuevo)
            const response = await fetch('http://localhost:8080/reclamo/cambiar_estado', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estadoNuevo),
            });
            if (!response.ok) throw new Error('Error al cambiar el estado del reclamo');
            const reclamosActualizados = reclamos.map((reclamo) =>
                reclamo.id === id ? { ...reclamo, estado: nuevoEstado } : reclamo
            );
            setReclamos(reclamosActualizados);
            setReclamosFiltradas(reclamosActualizados);
            cargarReclamos();
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    const confirmarTerminarReclamo = (id) => {
        setReclamoTerminadoId(id);
        setAlertaTerminado(true);
    };

    const finalizarReclamo = () => {
        cambiarEstado(reclamoTerminadoId, 'terminado');
        setAlertaTerminado(false);
        setReclamoTerminadoId(null);
    };



    return (
        <section className='manejar_reclamos'>
            <h2>Todos los reclamos</h2>

            <main className='manejar_reclamos_main'>
                {loading ? (
                    <AnimacionCarga
                        columnas={['Id', 'Nombre', 'Piso', 'Unidad', 'Área', 'Tipo', 'Descripcion', 'Fecha', 'Estado']}
                        filas={reclamosPorPagina}
                        mostrarSelect={true}
                    />
                ) : (
                    <table className='tabla_container'>
                        <div className='tabla_container_items'>
                            <header className="persona_tabla_header">
                                <input
                                    type='text'
                                    className='buscador_tabla'
                                    placeholder='Buscar reclamos...'
                                    value={criterioBusqueda}
                                    onChange={(e) => setCriterioBusqueda(e.target.value)}
                                />
                                <select
                                    className="personas_select"
                                    value={idEdificio || ''}
                                    onChange={e => setIdEdificio(e.target.value)}
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
                                        <th>Nombre</th>
                                        <th>Piso</th>
                                        <th>Unidad</th>
                                        <th>Área</th>
                                        <th>Tipo</th>
                                        <th>Descripcion</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                {reclamosPaginados.length > 0 ? (
                                    reclamosPaginados.map((reclamo, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: -50 }}
                                            transition={{
                                                duration: 1,
                                                delay: index * 0.07,
                                                type: 'spring',
                                            }}
                                            exit={{ opacity: 0, y: -50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className='tabla_objeto'
                                            key={reclamo.numero}
                                        >
                                            <td>{reclamo.numero}</td>
                                            <td>{reclamo.usuario.nombre}</td>
                                            { (reclamo.ubicacion=="vivienda" || reclamo.ubicacion=="Vivienda")
                                                ? <td>{reclamo.unidad.piso}</td>
                                                : <td>-</td>
                                            }
                                            { (reclamo.ubicacion=="vivienda" || reclamo.ubicacion=="Vivienda")
                                                ? <td>{reclamo.unidad.numero}</td>
                                                : <td>-</td>
                                            }
                                            <td>{reclamo.ubicacion}</td>
                                            <td>{reclamo.tipoDeReclamo}</td>
                                            <td>{reclamo.descripcion}</td>
                                            <td>{reclamo.fechalocal}</td>
                                            <td>
                                                {reclamo.estado === 'terminado' ? (
                                                    <span>Terminado</span>
                                                ) : (
                                                    <td>
                                                        <EstadoSelect
                                                            reclamo={reclamo}
                                                            confirmarTerminarReclamo={confirmarTerminarReclamo}
                                                            cambiarEstado={cambiarEstado}
                                                        />
                                                    </td>

                                                )}
                                            </td>
                                            <td>
                                                <img
                                                    src={eliminar}
                                                    alt='Eliminar reclamo'
                                                    onClick={() => eliminarReclamo(reclamo.numero)}
                                                />
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan='9'>No se encontró ningún reclamo.</td>
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

            {alertaTerminado && (
                <section className='alerta_fondo'>
                    <main>
                        <h1>¿Está seguro que desea finalizar el reclamo?</h1>
                        <button onClick={finalizarReclamo}>Aceptar</button>
                        <button onClick={() => setAlertaTerminado(false)}>Cancelar</button>
                    </main>
                </section>
            )}
        </section>
    );
};

export default ManejarReclamos;
