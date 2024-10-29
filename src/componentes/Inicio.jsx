import React, { useContext, useEffect, useState } from 'react'
import Contexto from '../contexto/Contexto'
import personas from '../datos/personas'
import { useNavigate } from 'react-router-dom';
import Paginacion from './funcionalidades/Paginacion';
import { MagicMotion } from 'react-magic-motion';
import { fetchDatos } from '../datos/fetchDatos';

const Inicio = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const {usuarioDni,deslogearse}=useContext(Contexto);
    const navegacion=useNavigate();
    const persona = personas.find(valor=> valor.dni==usuarioDni);

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
        } finally {
            setLoading(false);

        }
    };

    useEffect(()=>{
        obtenerPersona()
    },[]); 


    const logout = () => {
        deslogearse();
        navegacion('/login', { replace: true });
    };


    if (!persona){
        logout();
    }



    return (
    <section className='inicio'>
        <h1>¡Bienvenido, !</h1>
        <p>Consulta el estado de tus reclamos o realiza uno nuevo. Adjunta imágenes para una mejor resolución.</p>
        <h2>Estado de Mis Reclamos</h2>
        <MagicMotion>
                        {loading ? (
                            <div className='tabla_cargando'>Cargando...</div>
                        ) : (
                            <table className='tabla_container'>
                                <div className='tabla_container_items'>
                                    <tbody className='tabla_body'>
                                        <thead className='tabla_encabezado'>
                                            <tr>
                                                <th>Documento</th>
                                                <th>Nombre</th>
                                            </tr>
                                        </thead>
                                            {reclamosPaginados.length > 0 ? (
                                                reclamosPaginados.map((reclamo, index) => (
                                                    <tr className='tabla_objeto' key={index}>
                                                        <td>{reclamo.usuario.documento}</td>
                                                        <td>{reclamo.usuario.nombre}</td>
                                                    </tr>
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
                    </MagicMotion>

                    <button onClick={()=> navegacion("/crearReclamo")}> Nuevo reclamo </button>
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
