import React, { useContext, useEffect, useState } from 'react'
import Contexto from '../contexto/Contexto'
import { useNavigate } from 'react-router-dom';
import Paginacion from './funcionalidades/Paginacion';
import { fetchDatos } from '../datos/fetchDatos';
import { motion } from 'react-magic-motion';
import AnimacionCarga from './funcionalidades/AnimacionCarga';

const Inicio = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const {usuarioDni,deslogearse}=useContext(Contexto);
    const navegacion=useNavigate();

    const [reclamos, setReclamos] = useState([]);
    const [reclamosFiltradas, setReclamosFiltradas] = useState([]);

    const reclamosPorPagina = 4;
    const indiceInicio = (paginaActual - 1) * reclamosPorPagina;
    const indiceFin = indiceInicio + reclamosPorPagina;
    const reclamosPaginados = reclamosFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(reclamosFiltradas.length / reclamosPorPagina);


    const obtenerPersona = async () => {
        setLoading(true);
        try {
            const data = await fetchDatos(`http://localhost:8080/reclamo/reclamos_por_persona/DNI2`);/*Cambiar el DNI fijo por el dni del usuario que inicio sesion*/
            setReclamos(data);
            setReclamosFiltradas(data); 
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally{
            setLoading(false)
        }
    };

    useEffect(()=>{
        obtenerPersona()
    },[]); 


    const logout = () => {
        deslogearse();
        navegacion('/login', { replace: true });
    };

    return (
    <section className='inicio'>
        <h1>¡Bienvenido, !</h1>
        <p>Consulta el estado de tus reclamos o realiza uno nuevo. Adjunta imágenes para una mejor resolución.</p>
        <h2>Estado de Mis Reclamos</h2>
                        {loading ? (
                            <AnimacionCarga columnas={['Id', 'Nombre', 'Piso', 'Unidad', 'Área', 'Tipo', 'Descripción', 'Fecha', 'Estado']} filas={reclamosPorPagina} />
                        ) : (
                            <table className='tabla_container'>
                                <div className='tabla_container_items'>
                                    <tbody className='tabla_body'>
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
                                            {reclamosPaginados.length > 0 ? (
                                                reclamosPaginados.map((reclamo, index) => (
                                                    <motion.tr 
                                                    initial={{opacity:0, y:-50}}
                                                    transition={{
                                                        duration:1,
                                                        delay:index*0.07,
                                                        type:"spring"
                                                        }}
                                                    exit={{ opacity: 0, y: -50 }}
                                                    animate={{opacity:1, y:0}}
                                                    className='tabla_objeto' 
                                                    key={`${reclamo.numero}-${index}`}>
                                                        <td>{reclamo.numero}</td>
                                                        <td>{reclamo.usuario.nombre}</td>
                                                        <td>{reclamo.unidad.piso}</td>
                                                        <td>{reclamo.unidad.numero}</td>
                                                        <td>{reclamo.ubicacion}</td>
                                                        <td>{reclamo.tipoDeReclamo}</td>
                                                        <td>{reclamo.descripcion}</td>
                                                        <td>Fecha</td>
                                                        <td>{reclamo.estado}</td>
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

                    <motion.button 
                    onClick={()=> navegacion("/crearReclamo")}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale:0.9}}
                    > Nuevo reclamo </motion.button>
                    
                    <h2>Resumen de Actividad</h2>
                    <article className='inicio_procesos'>

                        <div>
                            <p>Nuevos</p>
                        </div>

                        <div>
                            <p>Anulados</p>
                        </div>

                        <div>
                            <p>En proceso</p>
                        </div>

                        <div>
                            <p>Terminados</p>
                        </div>

                    </article>

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
    )
}

export default Inicio
