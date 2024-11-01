import React, { useState, useContext, useEffect } from 'react';
import ReclamosList from '../componentes/reclamosLogica/ListarReclamos';
import BotonFiltro from '../componentes/reclamosLogica/BotonFiltro';
import Contexto from '../contexto/Contexto';
import { MagicMotion } from 'react-magic-motion';
import { fetchDatos } from '../datos/fetchDatos';
import Paginacion from './funcionalidades/Paginacion';
import { motion } from 'framer-motion';
import AnimacionCarga from './funcionalidades/AnimacionCarga';

const VerReclamos = () => {
    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [reclamos, setReclamos] = useState([]);
    const [reclamosFiltradas, setReclamosFiltradas] = useState([]);
    const reclamosPorPagina = 10;
    const indiceInicio = (paginaActual - 1) * reclamosPorPagina;
    const indiceFin = indiceInicio + reclamosPorPagina;
    const reclamosPaginados = reclamosFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(reclamosFiltradas.length / reclamosPorPagina);
    
    const [filtrar, setFiltrar] = useState('todos');
    const [criterioBusqueda, setCriterioBusqueda] = useState('');
    const usuarioDNI = "DNI2";  // Sustituir con el DNI del usuario logueado

    const [edificioUsuario, setEdificioUsuario] = useState();

    // Cargar todos los reclamos una vez al inicio
    useEffect(() => {
        const cargarReclamos = async () => {
            setLoading(true);
            try {
                const reclamosData = await fetchDatos(`http://localhost:8080/reclamo/reclamos_por_edificio/1`);
                setReclamos(reclamosData);
                setReclamosFiltradas(reclamosData);
                console.log(reclamosData)
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

    // Filtrar reclamos cuando cambia el estado `filtrar`
    useEffect(() => {
        const aplicarFiltro = () => {
            if (filtrar === 'todos') {
                setReclamosFiltradas(reclamos);
            } else if (filtrar === 'mis-reclamos') {
                setReclamosFiltradas(reclamos.filter(reclamo => reclamo.usuario.documento === usuarioDNI));
            } else if (filtrar === 'comunidad') {
                setReclamosFiltradas(reclamos.filter(reclamo => reclamo.usuario.documento !== usuarioDNI));
            }
        };
        aplicarFiltro();
    }, [filtrar, reclamos]);


    //Con esto vamos a obtener el edificio de la persona y asi buscarlo
    useEffect(() =>{
        const obtenerEdificio = async () => {
            try{
                const data = await fetchDatos(`http://localhost:8080/persona/buscar_persona/${usuarioDNI}`)
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
        setPaginaActual(1); // Reinicia a la primera página al cambiar de filtro
    };

    return (
        <div className='ver_reclamos'>
            <h2>Reclamos Actuales</h2>


            {/* Botones de filtro */}
            <div className="filtros">
                <button className={(filtrar === 'todos') ? 'filtro_boton_activo' : ''} onClick={() => handleFiltroClick('todos')}>Todos</button>
                <button className={(filtrar === 'mis-reclamos') ? 'filtro_boton_activo' : ''} onClick={() => handleFiltroClick('mis-reclamos')}>Mis reclamos</button>
                <button className={(filtrar === 'comunidad') ? 'filtro_boton_activo' : ''} onClick={() => handleFiltroClick('comunidad')}>Reclamos de la comunidad</button>
            </div>

                {loading ? (
                    <AnimacionCarga columnas={['Id', 'Nombre', 'Piso', 'Unidad', 'Área', 'Tipo', 'Descripcion', 'Fecha', 'Estado']} filas={reclamosPorPagina}/>
                ) : (
                    <table className='tabla_container'>
                    

                        <div className='tabla_container_items'>
                        
                            {/* Campo de búsqueda */}
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
        </div>
    );
};

export default VerReclamos;
