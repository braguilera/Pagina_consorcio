import React, { useContext, useEffect, useState } from 'react';
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import Paginacion from '../funcionalidades/Paginacion';
import DuenioIcono from '../../iconos/DuenioIcono';
import InquilinoIcono from '../../iconos/InquilinoIcono';
import HabitanteIcono from '../../iconos/HabitanteIcono';
import eliminar from '../../iconos/eliminar.svg'
import loader from '../../iconos/loader.svg'

const Unidad = () => {

    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual, setExito, exito, mostrarExito, setMostrarExito } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);

    const [unidades, setUnidades] = useState([]);
    const [unidadesFiltradas, setUnidadesFiltradas] = useState([]);

    const [nuevaUnidad, setNuevaUnidad] = useState({ piso: "", numero: "", habitado: false, codigoEdificio: "" });
    const [alertaTransferir, setAlertaTransferir] = useState(false)

    const [alertaHabitar, setAlertaHabitar] = useState(false)
    const [alertaEliminacion, setAlertaEliminacion] = useState(false);
    const [alertaEliminarDuenio, setAlertaEliminarDuenio] = useState(false);
    const [alertaEliminarInquilino, setAlertaEliminarInquilino] = useState(false);
    const [alertaHabitarBoton, setAlertaHabitarBoton] = useState(false);
    const [alertaDeshabitarBoton, setAlertaDeshabitarBoton] = useState(false);
    
    const [habitarDatos, setHabitarDatos] = useState( {codigo:"", documento:""} )
    const [datosDuenios, setDatosDuenios] = useState(null);
    const [datosInquilinos, setDatosInquilinos] = useState(null);
    const [alertaCargando, setAlertaCargando] = useState(false)
    const [datoUnidadEliminar, setDatoUnidadEliminar] = useState();


    const [habitarRol, setHabitarRol] = useState()
    const [duenios, setDuenios] = useState([])
    const [inquilinos, setInquilinos] = useState([])

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
        } finally {
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

    useEffect(() => {
        obtenerUnidades();
    }, [idEdificio]);

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

    const manejarCambio = (e) => {
        setNuevaUnidad({
            ...nuevaUnidad,
            [e.target.name]: e.target.value
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        if (!nuevaUnidad.piso || !nuevaUnidad.numero || !nuevaUnidad.codigoEdificio) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/unidad/agregar_unidades_edificio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaUnidad),
            });

            if (!response.ok) {
                throw new Error('Error al agregar la unidad');
            }

            setNuevaUnidad({ piso: "", numero: "", habitado: false, codigoEdificio: "" });
            obtenerUnidades(); 
            setExito("Piso agregado con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);

        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    const manejarCambioDatos = (e) => {
        setHabitarDatos({
            ...habitarDatos,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if (habitarDatos.codigo) {
            datosDuenioInquilino(habitarDatos.codigo);
        }
    }, [habitarDatos.codigo]);
    
    const manejarClicUnidad = (unidad) => {

        setHabitarDatos((prev) => ({ ...prev, codigo: unidad.id }));
        setAlertaHabitar(true);
        setHabitarRol("");
        
    };
    
    const datosDuenioInquilino = async (codigo) => {
        
        try {
            setAlertaCargando(true);
            const dataDuenios = await fetchDatos(`http://localhost:8080/persona/duenios_por_unidad/${codigo}`);
            setDuenios(dataDuenios);
    
            const dataInquilinos = await fetchDatos(`http://localhost:8080/persona/inquilinos_por_unidad/${codigo}`);
            setInquilinos(dataInquilinos)

        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
        finally {
            setAlertaCargando(false); 
        }
    };

    const AgregarAUnidad = async (e) => {
        e.preventDefault();
    
        if (!habitarDatos.codigo || !habitarDatos.documento || !habitarRol) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
    
        try {
            setAlertaCargando(true);
    
            if (habitarRol === "duenio") {
                const response = await fetch('http://localhost:8080/unidad/agregar_duenio', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });
                if (!response.ok) throw new Error('Error al agregar el dueño a la unidad');
                if (response.ok) {
                    setExito("Dueño agregado con éxito")
                    setMostrarExito(true);
                    setTimeout(() => setMostrarExito(false), 3000);
                }
            } else if (habitarRol === "inquilino") {
                const response = await fetch('http://localhost:8080/unidad/agregar_inquilino', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });
                if (!response.ok) throw new Error('Error al agregar el inquilino a la unidad');
                if (response.ok) {
                    setExito("Inquilino agregado con éxito")
                    setMostrarExito(true);
                    setTimeout(() => setMostrarExito(false), 3000);
                }
            }
            await datosDuenioInquilino(habitarDatos.codigo);
    
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false);
        }
    };

    const habitarUnidad = async () =>{      
        if (inquilinos.length===0) {
            setError("Error la unidad esta vacía.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
        
        try {
            setAlertaCargando(true);
            const response = await fetch(`http://localhost:8080/unidad/habitar_unidad/${habitarDatos.codigo}`, { method: 'PUT' });
            if (!response.ok) throw new Error('Error al habitar la unidad');
            obtenerUnidades();
            setExito("Unidad habitada exitosamente")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
        }catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false); 
        }
    };

    const eliminarUnidad = async (idUnidad) => {
        try {
            const response = await fetch(`http://localhost:8080/unidad/eliminar_unidad/${idUnidad}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setUnidades((prevUnidades) => prevUnidades.filter(unidad => unidad.id !== idUnidad));
                setUnidadesFiltradas((prevUnidades) => prevUnidades.filter(unidad => unidad.id !== idUnidad));
                setExito("Unidad eliminada con éxito")
                setMostrarExito(true);
                setTimeout(() => setMostrarExito(false), 3000);
            } else {
                throw new Error("No se pudo eliminar la unidad. Intenta nuevamente.");
            }
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    }
    

    const liberarUnidad = async () => {
        if (!habitarDatos.codigo) {
            setError("Falta el código de la unidad.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
    
        try {
            setAlertaCargando(true);
            const response = await fetch(`http://localhost:8080/unidad/liberar_unidad/${habitarDatos.codigo}`, {
                method: 'PUT',
            });
    
            if (!response.ok) {
                throw new Error("Error al liberar la unidad");
            }
            await datosDuenioInquilino(habitarDatos.codigo);
            await obtenerUnidades();
            setExito("Unidad liberada con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false);
        }
    };
    


    const eliminarDuenio = async () => {
        if (!datosDuenios) return;

        try {
            setAlertaCargando(true);
            const response = await fetch('http://localhost:8080/unidad/eliminar_duenio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosDuenios),
            });

            if (!response.ok) throw new Error('Error al eliminar dueño de la unidad');

            await datosDuenioInquilino(habitarDatos.codigo);
            setDatosDuenios(null);
            setExito("Dueño eliminado con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false);
        }
    };
    

    
    const eliminarInquilino = async () => {
        if (!datosInquilinos) return;

        try {
            setAlertaCargando(true);
            const response = await fetch('http://localhost:8080/unidad/eliminar_un_inquilino', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosInquilinos),
            });

            if (!response.ok) throw new Error('Error al eliminar el inquilino de la unidad');

            await datosDuenioInquilino(habitarDatos.codigo);
            await obtenerUnidades();
            setExito("Inquilino eliminado con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);

            setDatosInquilinos(null);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false);
        }
    };


    const transferirUnidad = async (e) =>{

        e.preventDefault();

        if (!habitarDatos.codigo || !habitarDatos.documento) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
        try {
            setAlertaCargando(true);
    
            const response = await fetch('http://localhost:8080/unidad/transferir', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habitarDatos),
            });
            if (!response.ok) throw new Error('Error al transferir dueño de la unidad');
            
            setAlertaTransferir(false);
            await liberarUnidad();
            setExito("Transferencia realizada exitosamente")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false); 
        }
    }

    const deshabitarUnidad = async () =>{
        if (!habitarDatos.codigo) {
            setError("Falta el código de la unidad.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
    
        try {
            setAlertaCargando(true);
            const response = await fetch(`http://localhost:8080/unidad/deshabitar_unidad/${habitarDatos.codigo}`, {
                method: 'PUT',
            });
    
            if (!response.ok) {
                throw new Error("Error al liberar la unidad");
            }
            await datosDuenioInquilino(habitarDatos.codigo);
            await obtenerUnidades();
            setError(null);
            setExito("Unidad deshabitada con éxito")
            setMostrarExito(true);
            setTimeout(() => setMostrarExito(false), 3000);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false);
        }
    }

    return (
        <>
            <section className='unidades'>
                <main className='unidades_main'>

                    {loading ? (
                        <AnimacionCarga columnas={['Id', 'Unidad', 'Piso', 'Estado']} filas={unidadesPorPagina} mostrarSelect={true} />
                    ) : (
                        <table className='tabla_container'>
                            <div className='tabla_container_items'>
                                <header className='persona_tabla_header'>
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
                                            <th>Piso</th>
                                            <th>Unidad</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    {unidadesPaginados.length > 0 ? (
                                        unidadesPaginados.map((unidad, index) => (
                                            <motion.tr
                                                onClick={() => manejarClicUnidad(unidad)}
                                                className='tabla_objeto'
                                                initial={{ opacity: 0, y: -50}}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 1, delay: index * 0.07, type: "spring" }}
                                                exit={{ opacity: 0, y: -50 }}
                                                key={`${unidad.id}${index}`}
                                            >
                                                <td>{unidad.id}</td>
                                                <td>{unidad.piso}</td>
                                                <td>{unidad.numero}</td>
                                                <td className={unidad.habitado ? 'unidad_ocupada' : 'unidad_libre'}>
                                                    {unidad.habitado ? "Ocupado" : "Libre"}
                                                </td>
                                                <img
                                                    src={eliminar}
                                                    alt="Botón para eliminar persona"
                                                    onClick={(e) => (e.stopPropagation(), setAlertaEliminacion(true), setDatoUnidadEliminar(unidad.id) )}
                                                />
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

                    <motion.aside
                        className='agregar_container'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>Agregar Nueva Unidad</h3>
                        <motion.form 
                            onSubmit={manejarSubmit} 
                            className='agregar_form'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <label>
                                Piso:
                                <motion.input
                                    type="text"
                                    name="piso"
                                    placeholder='Ingresar un piso'
                                    value={nuevaUnidad.piso}
                                    onChange={manejarCambio}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    whileBlur={{ scale: 1 }}
                                />
                            </label>
                            <br />
                            <label>
                                Unidad:
                                <motion.input
                                    type="text"
                                    name="numero"
                                    placeholder='Ingresar un número'
                                    value={nuevaUnidad.numero}
                                    onChange={manejarCambio}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    whileBlur={{ scale: 1 }}
                                />
                            </label>
                            <br />
                            <label>
                                Edificio:
                                <motion.select
                                    className='personas_select'
                                    name="codigoEdificio"
                                    value={nuevaUnidad.codigoEdificio}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Seleccionar edificio</option>
                                    {edificios.map(edificio => (
                                        <option key={edificio.codigo} value={edificio.codigo}>
                                            {edificio.nombre}
                                        </option>
                                    ))}
                                </motion.select>
                            </label>
                            <motion.button 
                                className='boton_general' 
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                            >
                                Agregar Unidad
                            </motion.button>
                        </motion.form>
                    </motion.aside>

                    {alertaHabitar && (
                        <div className="unidad_habitar_fondo">
                            <div className="unidad_habitar">

                            <section className='unidad_habitar_contenedor'>

                                    <fieldset className='unidad_habitar_duenios'>
                                        <legend>Dueños actuales</legend>
                                        <article className='unidad_habitar_inquilinos_lista'>
                                        {duenios.map((duenio) => (
                                            <section key={duenio.documento}>
                                                <div className='unidad_habitar_inquilinos_lista_item'>
                                                        <p>{duenio.nombre}</p>
                                                        <small>{duenio.documento}</small>
                                                </div>  
                                                <img
                                                    src={eliminar}
                                                    alt="botón para eliminar un dueño"
                                                    onClick={() => (setDatosDuenios({ documento: duenio.documento, unidadCodigo: habitarDatos.codigo }) , setAlertaEliminarDuenio(true))}
                                                />
                                            </section>
                                        ))}
                                        </article>
                                        <button className='boton_cancelar' onClick={() => setAlertaTransferir(true)}>Transferir propiedad</button>
                                    </fieldset>

                                    <main className='unidad_habitar_roles_contenedor'>
                                        <h3>Elija el rol asociado a la unidad {habitarDatos.codigo}</h3>
                                    
                                        <div className="unidad_habitar_roles">

                                            <article>
                                                <button onClick={() => setHabitarRol("duenio")}
                                                className={ (habitarRol==="duenio") ? "unidad_habitar_boton_activo" : "unidad_habitar_boton_desactivo"}
                                                >
                                                    <DuenioIcono color= {(habitarRol==="duenio") ? "#4B83C1" : "#A2A9B3"}/>
                                                    
                                                </button>
                                                Dueño
                                            </article>

                                            <article>
                                                <button onClick={() => setHabitarRol("inquilino")}
                                                className={ (habitarRol==="inquilino") ? "unidad_habitar_boton_activo" : "unidad_habitar_boton_desactivo" }>
                                                    <InquilinoIcono color= {(habitarRol==="inquilino") ? "#4B83C1" : "#A2A9B3"}/>
                                                    
                                                </button>
                                                Inquilino
                                            </article>
                                        </div>


                                        <input
                                        type="text"
                                        name="documento"
                                        placeholder="Ingrese DNI"
                                        value={habitarDatos.documento}
                                        onChange={manejarCambioDatos}
                                        required
                                        />

                                        <fieldset className='unidad_habitar_deshabitar'>
                                            <legend>
                                                Opcional
                                            </legend>
                                            <button onClick={()=> setAlertaHabitarBoton(true)}>Habitar</button>
                                            <button onClick={()=> setAlertaDeshabitarBoton(true)}>Desabitar</button>
                                        </fieldset>
                                    </main>


                                    <fieldset className='unidad_habitar_inquilinos'>
                                        <legend>Inquilinos actuales</legend>
                                        <article className='unidad_habitar_inquilinos_lista'>
                                            {inquilinos.map((inquilino) => (
                                                <section key={inquilino.documento}>
                                                    <div className='unidad_habitar_inquilinos_lista_item'>
                                                        <p>{inquilino.nombre}</p>
                                                        <small>{inquilino.documento}</small>
                                                    </div>
                                                    <img
                                                        src={eliminar}
                                                        alt="botón para eliminar un inquilino"
                                                        onClick={() => (setDatosInquilinos({ documento: inquilino.documento, unidadCodigo: habitarDatos.codigo }, setAlertaEliminarInquilino(true)))}
                                                    />
                                                </section>
                                            ))}
                                        </article>
                                        <button className='boton_cancelar' onClick={liberarUnidad}>Eliminar todos</button>
                                    </fieldset>

                                    {alertaTransferir && 
                                    <div className="unidad_habitar_fondo">
                                        <section className='unidad_transferir'>
                                            <h2>¿Seguro que quiere transferir la unidad?</h2>
                                            <p>Ingrese al nuevo dueño.</p>
                                            <input
                                                type="text"
                                                name="documento"
                                                placeholder="Ingrese DNI"
                                                value={habitarDatos.documento}
                                                onChange={manejarCambioDatos}
                                                required
                                                />

                                            <footer className='unidad_habitar_footer'>
                                                <button className='boton_general' onClick={transferirUnidad}>Confirmar</button>
                                                <button className='boton_cancelar' onClick={ () => setAlertaTransferir(false)}>Cancelar</button>
                                            </footer>
                                        </section>
                                    </div>
                                    }

                                </section>
                                
                                <footer className='unidad_habitar_footer'>
                                    <button className='boton_general' onClick={AgregarAUnidad}>Confirmar</button>
                                    <button className='boton_cancelar' onClick={ (() => {setAlertaHabitar(false); setHabitarRol("")}) }>Cancelar</button>
                                </footer>

                            </div>
                        </div>
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
                                    <p>¿Está seguro de que desea eliminar la unidad <strong>{datoUnidadEliminar}</strong>?</p>
                                    <div className='alertaEliminarBotones'>
                                        <button onClick={() => { eliminarUnidad(datoUnidadEliminar); setAlertaEliminacion(false); }} className='boton_general'>Aceptar</button>
                                        <button onClick={() => setAlertaEliminacion(false)} className='boton_general'>Cancelar</button>
                                    </div>
                                </motion.article>
                            </div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {alertaHabitarBoton && (
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
                                    <p>¿Está seguro de que desea habitar la unidad <strong>{habitarDatos.codigo}</strong>?</p>
                                    <div className='alertaEliminarBotones'>
                                        <button onClick={() => { habitarUnidad(); setAlertaHabitarBoton(false); }} className='boton_general'>Aceptar</button>
                                        <button onClick={() => setAlertaHabitarBoton(false)} className='boton_general'>Cancelar</button>
                                    </div>
                                </motion.article>
                            </div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {alertaDeshabitarBoton && (
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
                                    <p>¿Está seguro de que desea deshabitar la unidad <strong>{habitarDatos.codigo}</strong>?</p>
                                    <div className='alertaEliminarBotones'>
                                        <button onClick={() => { deshabitarUnidad(); setAlertaDeshabitarBoton(false); }} className='boton_general'>Aceptar</button>
                                        <button onClick={() => setAlertaDeshabitarBoton(false)} className='boton_general'>Cancelar</button>
                                    </div>
                                </motion.article>
                            </div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {alertaEliminarDuenio && (
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
                                    <p>¿Está seguro de que desea eliminar al dueño con el documento <strong>{datosDuenios.documento}</strong>?</p>
                                    <div className='alertaEliminarBotones'>
                                        <button onClick={() => ( eliminarDuenio(), setAlertaEliminarDuenio(false) )} className='boton_general'>Aceptar</button>
                                        <button onClick={() => setAlertaEliminarDuenio(false)} className='boton_general'>Cancelar</button>
                                    </div>
                                </motion.article>
                            </div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {alertaEliminarInquilino && (
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
                                    <p>¿Está seguro de que desea eliminar al inquilino con el documento <strong>{datosInquilinos.documento}</strong>?</p>
                                    <div className='alertaEliminarBotones'>
                                        <button onClick={() => ( eliminarInquilino(), setAlertaEliminarInquilino(false) )} className='boton_general'>Aceptar</button>
                                        <button onClick={() => setAlertaEliminarInquilino(false)} className='boton_general'>Cancelar</button>
                                    </div>
                                </motion.article>
                            </div>
                        )}
                    </AnimatePresence>

                    {
                        alertaCargando && (
                            <div className="alerta_fondo">
                                <div className="unidad_habitar_cargando">
                                    
                                    <img src={loader}/>
                                    
                                </div>
                            </div>
                        )
                    }

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

                </main>
            </section>
        </>
    );
};

export default Unidad;
