import React, { useState, useContext, useEffect } from 'react';
import ReclamosList from '../componentes/reclamosLogica/ListarReclamos';
import BotonFiltro from '../componentes/reclamosLogica/BotonFiltro';
import Contexto from '../contexto/Contexto';
import { color, MagicMotion } from 'react-magic-motion';
import { fetchDatos } from '../datos/fetchDatos';
import Paginacion from './funcionalidades/Paginacion';
import { motion } from 'framer-motion';
import AnimacionCarga from './funcionalidades/AnimacionCarga';

const VerReclamos = () => {
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

    useEffect(() => {
        const cargarReclamos = async () => {
            setLoading(true);
            try {
                const reclamosData = await fetchDatos(`http://localhost:8080/reclamo/reclamos_por_edificio/1`);
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
        cargarReclamos();
    }, [edificioUsuario]);

    useEffect(() => {
        const aplicarFiltro = () => {
            if (filtrar === 'todos') {
                setReclamosFiltradas(reclamos.filter(reclamo => reclamo.usuario.documento === usuarioDni || reclamo.ubicacion.toLowerCase() !== "vivienda"));
            } else if (filtrar === 'mis-reclamos') {
                setReclamosFiltradas(reclamos.filter(reclamo => reclamo.usuario.documento === usuarioDni));
            } else if (filtrar === 'comunidad') {
                setReclamosFiltradas(reclamos.filter(reclamo => reclamo.ubicacion.toLowerCase() !== "vivienda"));
            }
        };
        aplicarFiltro();
    }, [filtrar, reclamos]);

    useEffect(() =>{
        const obtenerEdificio = async () => {
            try{
                const data = await fetchDatos(`http://localhost:8080/persona/buscar_persona/${usuarioDni}`)
                console.log(data)       
            } catch (error) {
                setError(error.message);
                setMostrarError(true);
                setTimeout(() => setMostrarError(false), 3000);
            }
        }
        obtenerEdificio();
    },[])

    const handleFiltroClick = (filtro) => {
        setFiltrar(filtro);
        setPaginaActual(1);
    };

    const verMas = (e) =>{
        setVerMasInfo(true)

        setInfoReclamo({id:e.numero, nombre:e.usuario.nombre, unidad:e.unidad.numero, piso:e.unidad.piso, area:e.ubicacion, tipo:e.tipoDeReclamo, fecha:e.fechalocal, estado:e.estado, descripcion:e.descripcion, imagenes:e.imagenes})
    }

    return (
        <section className='ver_reclamos'>
            <h2>Reclamos Actuales</h2>

            <div className="filtros">
                <button className={(filtrar === 'todos') ? 'filtro_boton_activo' : ''} onClick={() => handleFiltroClick('todos')}>Todos</button>
                <button className={(filtrar === 'mis-reclamos') ? 'filtro_boton_activo' : ''} onClick={() => handleFiltroClick('mis-reclamos')}>Mis reclamos</button>
                <button className={(filtrar === 'comunidad') ? 'filtro_boton_activo' : ''} onClick={() => handleFiltroClick('comunidad')}>Reclamos de la comunidad</button>
            </div>

            <main className='ver_reclamos_main'>
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
                                        onClick={(e) => verMas(reclamo)} 
                                        whileHover={{ scale: 1.01, backgroundColor: "rgb(178, 219, 255)" }}
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
                                            <td>{reclamo.fechalocal}</td>
                                            <td>{reclamo.estado}</td>
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

                <div className='ver_reclamos_aside'>
                    {(verMasInfo) && 
                        
                        <aside className='ver_reclamos_aside_true'>
                            <header>
                                <h3><strong>Número reclamo {infoReclamo.id}</strong></h3>
                            </header>
                            <h4>{infoReclamo.estado}</h4>
                            
                            <div className='fila'>
                                <strong>Tipo de reclamo:</strong>
                                <p>{infoReclamo.tipo}</p>
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
                                <p>{infoReclamo.descripcion}</p>
                            </article>

                            <div className='ver_reclamos_aside_true_imagenes'>
                                {(infoReclamo.imagenes != null) 
                                    ? infoReclamo.imagenes
                                    : <p>No hay imágenes adjuntas</p>
                                }
                            </div>
                        </aside>


                    }
                    <aside className='ver_reclamos_aside_false'>
                        <h3>Nombre de edificio</h3>
                        <div className='ver_reclamos_aside_degrade'></div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </aside>
                </div>


            </main>
        </section>
    );
};

export default VerReclamos;
