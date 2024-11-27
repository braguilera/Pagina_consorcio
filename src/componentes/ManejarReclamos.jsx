import React, { useContext, useEffect, useState } from 'react';
import AnimacionCarga from './funcionalidades/AnimacionCarga';
import Contexto from '../contexto/Contexto';
import { fetchDatos } from '../datos/fetchDatos';
import Paginacion from './funcionalidades/Paginacion';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import eliminar from '../iconos/eliminar.svg';
import EstadoSelect from './funcionalidades/EstadoSelect';
import FiltroReclamos from './funcionalidades/FiltroReclamos';
import filter from '../iconos/filter.svg'

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
        setExito, 
        exito, 
        mostrarExito, 
        setMostrarExito
    } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);

    const [verMasInfo, setVerMasInfo] = useState(false);
    const [infoReclamo, setInfoReclamo] = useState( {id:"", nombre:"", unidad:"", piso:"", area:"", tipo:"", fecha:"", estado:"", descripcion:"", imagenes:""} );
    const [currentIndex, setCurrentIndex] = useState(0);

    const [alertaEliminacion, setAlertaEliminacion] = useState(false);
    const [idReclamo, setIdReclamo] = useState();
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

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
        try {
            const reclamosData = await fetchDatos(
                `http://localhost:8080/reclamo/reclamos_por_edificio/${idEdificio}`
            );

            const reclamoFiltrado = reclamosData.filter(reclam => !(reclam.unidad===null && reclam.ubicacion.toLowerCase() === "vivienda") )
            setReclamos(reclamoFiltrado);
            setReclamosFiltradas(reclamoFiltrado);
        } catch (error) {
            setError(error.message);
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
            setExito("Estado cambiado con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
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

    const verMas = (e) => {
        setVerMasInfo(true);
    
        const unidad = 
            e.ubicacion.toLowerCase() !== "vivienda"
                ? "-" 
                : e.unidad.numero;
        const piso = 
            e.ubicacion.toLowerCase() !== "vivienda"
                ? "-" 
                : e.unidad.piso;

        setInfoReclamo({
            id: e.numero || "-",
            nombre: e.usuario?.nombre || "Desconocido",
            unidad: unidad,
            piso: piso,
            area: e.ubicacion || "No especificada",
            tipo: e.tipoDeReclamo || "No especificado",
            fecha: e.fechalocal || "Sin fecha", 
            estado: e.estado || "Desconocido",
            descripcion: e.descripcion || "Sin descripción",
            imagenes: e.imagenes || [],
        });
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? infoReclamo.imagenes.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === infoReclamo.imagenes.length - 1 ? 0 : prevIndex + 1
        );
    };


    return (
        <section className='manejar_reclamos'>
            <header>
                <h2>Reclamos</h2>
                <p><em>Administra y organiza todos los reclamos de forma eficiente.</em></p>
            </header>
            <p>Cambia el estado de los reclamos, elimínalos si es necesario y utiliza filtros para buscar reclamos específicos de forma rápida.</p>

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
                                <img
                                    src={filter}
                                    onClick={()=> (mostrarFiltros) ? setMostrarFiltros(false) : setMostrarFiltros(true)}
                                    className='boton_filtrar'
                                />

                                <AnimatePresence>
                                    { mostrarFiltros && (
                                            <motion.section 
                                                className='manejar_reclamos_filtros'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3, ease: easeOut }}
                                            >
                                                <FiltroReclamos
                                                reclamos={reclamos}
                                                setReclamosFiltradas={setReclamosFiltradas}
                                                />
                                            </motion.section>
                                    ) }
                                </AnimatePresence>
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
                                            onClick={(e) => verMas(reclamo)}                        
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
                                            <td>{reclamo.descripcion}</td>
                                            <td>{reclamo.tipoDeReclamo}</td>
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
                                                    onClick={() => (setAlertaEliminacion(true), setIdReclamo(reclamo.numero))}
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

                <div className='ver_reclamos_aside'>
                    {(verMasInfo) && 
                        
                        <aside className='ver_reclamos_aside_true'>
                            <header>
                                <h3><strong>Número reclamo {infoReclamo.id}</strong></h3>
                            </header>

                            <h4 className={`estado-${infoReclamo.estado}`}>{infoReclamo.estado}</h4>
                            
                            <div className='fila'>
                                <strong>Tipo de reclamo:</strong>
                                <p>{infoReclamo.descripcion}</p>
                            </div>
                            <div className='fila'>
                                <strong>Nombre:</strong>
                                <p>{infoReclamo.nombre}</p>
                            </div>
                            <div className='fila'>
                                <strong>Unidad:</strong>
                                <p>{infoReclamo.unidad}</p>
                            </div>
                            <div className='fila'>
                                <strong>Piso:</strong>
                                <p>{infoReclamo.piso}</p>
                            </div>
                            <div className='fila'>
                                <strong>Área:</strong>
                                <p>{infoReclamo.area}</p>
                            </div>
                            <div className='fila'>
                                <strong>Fecha:</strong>
                                <p>{infoReclamo.fecha}</p>
                            </div>
                            
                            <article className='ver_reclamos_aside_true_descripcion'>
                                <strong>Descripción:</strong>
                                <p>{infoReclamo.tipo}</p>
                            </article>

                            <div className='ver_reclamos_aside_true_imagenes'>
                                {(infoReclamo.imagenes.length!=0) 
                                    ?         
                                        <div className='carousel'>
                                            <button className='carousel-button left' onClick={handlePrevious}>
                                                &lt;
                                            </button>
                                            
                                            <div className='carousel-content'>
                                                <img
                                                    src={infoReclamo.imagenes[currentIndex].direccion}
                                                />
                                            </div>
                                            
                                            <button className='carousel-button right' onClick={handleNext}>
                                                &gt;
                                            </button>
                                        </div>
                                    : <p className='carousel-content_false'>No hay imágenes adjuntas</p>
                                }
                            </div>
                        </aside>


                    }
                    <aside className='ver_reclamos_aside_false'>
                        <h3>Selecciona un reclamo</h3>
                        <div className='ver_reclamos_aside_degrade'></div>
                        <p>Haz clic en un reclamo de la lista para ver los detalles completos aquí.</p>
                    </aside>

                </div>


            </main>

            {alertaTerminado && (
                <section className='alerta_fondo'>
                    <main className='alertaEliminar'>
                        <p>¿Está seguro que desea terminar el reclamo?</p>
                        <div className='alertaEliminarBotones'>
                            <button onClick={finalizarReclamo} className='boton_general'>Aceptar</button>
                            <button onClick={() => setAlertaTerminado(false)} className='boton_general'>Cancelar</button>
                        </div>
                    </main>
                </section>
            )}

            <AnimatePresence>
                    {alertaEliminacion && (
                        <div 
                            className='alerta_fondo'

                        >
                            <motion.article 
                                className='alertaEliminar'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3, ease: easeOut }}
                            >
                                <p>¿Está seguro de que desea eliminar el reclamo con el codigo <strong>{idReclamo}</strong>?</p>
                                <div className='alertaEliminarBotones'>
                                    <button onClick={() => { eliminarReclamo(idReclamo); setAlertaEliminacion(false); }} className='boton_general'>Aceptar</button>
                                    <button onClick={() => setAlertaEliminacion(false)} className='boton_general'>Cancelar</button>
                                </div>
                            </motion.article>
                        </div>
                    )}
                </AnimatePresence>

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

export default ManejarReclamos;
