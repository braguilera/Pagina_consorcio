import React, { useContext, useEffect, useState } from 'react';
import Contexto from '../contexto/Contexto';
import { useNavigate } from 'react-router-dom';
import Paginacion from './funcionalidades/Paginacion';
import { fetchDatos } from '../datos/fetchDatos';
import { motion } from 'react-magic-motion';
import AnimacionCarga from './funcionalidades/AnimacionCarga';
import add from '../iconos/add.svg';
import loader from '../iconos/loader.svg'

const Inicio = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual, usuarioDni, nombreUsuario, rol } = useContext(Contexto);

    const navegacion = useNavigate();
    const [reclamos, setReclamos] = useState([]);
    const [reclamosFiltradas, setReclamosFiltradas] = useState([]);
    const [alertaCargando, setAlertaCargando] = useState(false)


    const reclamosPorPagina = 4;
    const indiceInicio = (paginaActual - 1) * reclamosPorPagina;
    const indiceFin = indiceInicio + reclamosPorPagina;
    const reclamosPaginados = reclamosFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(reclamosFiltradas.length / reclamosPorPagina);

    const [edificios, setEdificios] = useState([]);
    const [reclamosPorEdificio, setReclamosPorEdificio] = useState({});


    const obtenerPersona = async () => {
        setAlertaCargando(true);
        try {
            const data = await fetchDatos(`http://localhost:8080/reclamo/reclamos_por_persona/${usuarioDni}`);
            setReclamos(data);
            setReclamosFiltradas(data);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    useEffect(() => {
        obtenerPersona();
    }, []);


    // Obtener lista de edificios
    const obtenerEdificios = async () => {

        try {
            const data = await fetchDatos('http://localhost:8080/edificio/edificios');
            setEdificios(data);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    // Obtener reclamos por edificio
    const cargarReclamosPorEdificio = async (idEdificio) => {
        setAlertaCargando(true);
        try {
            const reclamosData = await fetchDatos(
                `http://localhost:8080/reclamo/reclamos_por_edificio/${idEdificio}`
            );

            // Filtrar reclamos no terminados
            const reclamosPendientes = reclamosData.filter(
                (reclamo) => reclamo.estado.toLowerCase() !== 'terminado'
            );

            setReclamosPorEdificio((prev) => ({
                ...prev,
                [idEdificio]: reclamosPendientes.length,
            }));
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
        finally {
            setAlertaCargando(false);
        }
    };

    useEffect(() => {
        obtenerEdificios();
    }, []);

    useEffect(() => {
        if (edificios.length > 0) {
            edificios.forEach((edificio) => cargarReclamosPorEdificio(edificio.codigo));
        }
    }, [edificios]);

    const contenidoEmpleado = () => (
        <>
            {alertaCargando ? (
                <div className="loader-container">
                    <img 
                        src={loader} 
                        alt="Cargando..." 
                        className="loader-image" 
                    />
                </div>
            ) : (
                <div className="edificios_lista">
                    {edificios.map((edificio) => (
                        <motion.div
                            key={edificio.codigo}
                            className={`edificio_card ${reclamosPorEdificio[edificio.codigo] > 0 ? 'tiene-reclamos' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2>{edificio.nombre}</h2>
                            <p>Dirección: {edificio.direccion}</p>
                            <p
                                id={
                                    reclamosPorEdificio[edificio.codigo] > 0
                                        ? "parrafo_tiene_reclamos"
                                        : undefined
                                }
                            >
                                {reclamosPorEdificio[edificio.codigo] > 0
                                    ? `Reclamos pendientes: ${reclamosPorEdificio[edificio.codigo]}`
                                    : 'No hay reclamos pendientes en este edificio.'}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
    
    const contenidoUsuario = () => (
        <>
            <h2>Estado de Mis Reclamos</h2>
            {loading ? (
                <AnimacionCarga columnas={['Id', 'Nombre', 'Piso', 'Unidad', 'Área', 'Tipo', 'Descripción', 'Fecha', 'Estado']} filas={reclamosPorPagina} />
            ) : (
                <table className='tabla_container'>
                    <thead className='tabla_encabezado'>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Piso</th>
                            <th>Unidad</th>
                            <th>Área</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reclamosPaginados.length > 0 ? (
                            reclamosPaginados.map((reclamo, index) => (
                                <motion.tr
                                    key={`${reclamo.numero}-${index}`}
                                    className='tabla_objeto'
                                    initial={{ opacity: 0, y: -50 }}
                                    transition={{ duration: 1, delay: index * 0.07, type: 'spring' }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <td>{reclamo.numero}</td>
                                    <td>{reclamo.usuario.nombre}</td>
                                    <td>{reclamo.ubicacion === "vivienda" ? reclamo.unidad.piso : '-'}</td>
                                    <td>{reclamo.ubicacion === "vivienda" ? reclamo.unidad.numero : '-'}</td>
                                    <td>{reclamo.ubicacion}</td>
                                    <td>{reclamo.tipoDeReclamo}</td>
                                    <td>{reclamo.descripcion}</td>
                                    <td>{reclamo.fecha}</td>
                                    <td>{reclamo.estado}</td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No se encontró ningún reclamo.</td>
                            </tr>
                        )}
                    </tbody>
                    <Paginacion
                                totalPaginas={totalPaginas}
                                paginaActual={paginaActual}
                                setPaginaActual={setPaginaActual}
                            />
                </table>
            )}
            <motion.button
                className='boton_general'
                onClick={() => navegacion("/crearReclamo")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <img src={add} alt="Añadir reclamo" />
                Nuevo reclamo
            </motion.button>
        </>
    );

    return (
        <section className='inicio'>
            <h1>Hola, {nombreUsuario}!</h1>
            <p>
                {rol === 'Empleado'
                    ? 'Consulta el estado de los reclamos por edificio y gestiona sus operaciones.'
                    : 'Consulta el estado de tus reclamos o realiza uno nuevo.'}
            </p>
    
            {rol === 'Empleado' ? contenidoEmpleado() : contenidoUsuario()}
    
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
    );
    
};

export default Inicio;
