import React, { useContext, useEffect, useState } from 'react'
import AnimacionCarga from './funcionalidades/AnimacionCarga'
import Contexto from '../contexto/Contexto';
import { fetchDatos } from '../datos/fetchDatos';
import Paginacion from './funcionalidades/Paginacion';
import { motion } from 'framer-motion';
import eliminar from '../iconos/eliminar.svg'


const ManejarReclamos = () => {

    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual, usuarioDni } = useContext(Contexto);

    const [reclamos, setReclamos] = useState([]);
    const [reclamosFiltradas, setReclamosFiltradas] = useState([]);
    const reclamosPorPagina = 10;
    const indiceInicio = (paginaActual - 1) * reclamosPorPagina;
    const indiceFin = indiceInicio + reclamosPorPagina;
    const reclamosPaginados = reclamosFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(reclamosFiltradas.length / reclamosPorPagina);
    
    const [filtrar, setFiltrar] = useState('todos');
    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    const [verMasInfo, setVerMasInfo] = useState(false)
    const [infoReclamo, setInfoReclamo] = useState( {id:"", nombre:"", unidad:"", piso:"", area:"", tipo:"", fecha:"", estado:"", descripcion:"", imagenes:""} )

    const [edificioUsuario, setEdificioUsuario] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const cargarReclamos = async () => {
            setLoading(true);
            try {
                const reclamosData = await fetchDatos(`http://localhost:8080/reclamo/reclamos_por_edificio/1`);
                setReclamos(reclamosData);
                console.log(reclamosData)
                setReclamosFiltradas(reclamosData);
            } catch (error) {
                setError(error.message);
                setMostrarError(true);
                setTimeout(() => setMostrarError(false), 3000);
            } finally {
                setLoading(false);
            }
        };
        cargarReclamos();
    }, [edificioUsuario]);

    useEffect(() =>{
        const obtenerTodosEdificio = async () => {
            try{
                const data = await fetchDatos(`http://localhost:8080/persona/buscar_persona/${usuarioDni}`)
                console.log(data)       
            } catch (error) {
                setError(error.message);
                setMostrarError(true);
                setTimeout(() => setMostrarError(false), 3000);
            }
        }
        obtenerTodosEdificio();
    },[])

    const eliminarReclamo = () =>{

    }

    return (
        <section className='manejar_reclamos'>
            <h2>Todos los reclamos</h2>

            <main className='manejar_reclamos_main'>
                {loading ? (
                    <AnimacionCarga columnas={['Id', 'Nombre', 'Piso', 'Unidad', 'Área', 'Tipo', 'Descripcion', 'Fecha', 'Estado']} filas={reclamosPorPagina}/>
                ) : (
                    <table className='tabla_container'>
                    

                        <div className='tabla_container_items'>
                        
                            <input
                                type="text"
                                className='buscador_tabla'
                                placeholder="Buscar reclamos..."
                                value={criterioBusqueda}
                                onChange={(e) => setCriterioBusqueda(e.target.value)}
                            />
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
                                            <td>{reclamo.estado}</td>
                                            <img 
                                                src={eliminar} 
                                                alt='Botón para eliminar persona' 
                                                onClick={eliminarReclamo} 
                                            />
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No se encontró ningún reclamo.</td>
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

export default ManejarReclamos
