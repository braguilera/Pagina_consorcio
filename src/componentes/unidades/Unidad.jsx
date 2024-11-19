import React, { useContext, useEffect, useState } from 'react';
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import { motion } from 'framer-motion';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import Paginacion from '../funcionalidades/Paginacion';
import DuenioIcono from '../../iconos/DuenioIcono';
import InquilinoIcono from '../../iconos/InquilinoIcono';
import HabitanteIcono from '../../iconos/HabitanteIcono';
import eliminar from '../../iconos/eliminar.svg'
import loader from '../../iconos/loader.svg'

const Unidad = () => {

    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);

    const [unidades, setUnidades] = useState([]);
    const [unidadesFiltradas, setUnidadesFiltradas] = useState([]);

    const [nuevaUnidad, setNuevaUnidad] = useState({ piso: "", numero: "", habitado: false, codigoEdificio: "" });
    const [duenioInquilino, setDuenioInquilino] = useState( {duenio:"", inquilino:""} )

    const [alertaHabitar, setAlertaHabitar] = useState(false)

    const [habitarDatos, setHabitarDatos] = useState( {codigo:"", documento:""} )
    const [eliminarDatos, setEliminarDatos] = useState( {documento:"", unidadCodigo:""} )
    const [datosDuenios, setDatosDuenios] = useState(null);
    const [datosInquilinos, setDatosInquilinos] = useState(null);
    const [alertaCargando, setAlertaCargando] = useState(false)


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
            const dataDuenios = await fetchDatos(`http://localhost:8080/persona/duenios_por_unidad/${codigo}`);
            setDuenios(dataDuenios);
    
            const dataInquilinos = await fetchDatos(`http://localhost:8080/persona/inquilinos_por_unidad/${codigo}`);
            setInquilinos(dataInquilinos)
            
            (dataInquilinos===0) && alert("vacio")

        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    const habitarUnidad = async (e) => {
        e.preventDefault();
    
        if (!habitarDatos.codigo || !habitarDatos.documento || !habitarRol) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
    
        try {
            setAlertaCargando(true); // Mostrar estado de carga
    
            if (habitarRol === "duenio") {
                const response = await fetch('http://localhost:8080/unidad/agregar_duenio', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });
    
                if (!response.ok) throw new Error('Error al agregar el dueño a la unidad');
            } else if (habitarRol === "inquilino") {
                const response = await fetch('http://localhost:8080/unidad/agregar_inquilino', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });
    
                if (!response.ok) throw new Error('Error al agregar el inquilino a la unidad');
                
                await fetch(`http://localhost:8080/unidad/habitar_unidad/${habitarDatos.codigo}`, { method: 'PUT' });
                obtenerUnidades();
            } else if (habitarRol === "habitante") {
                const response = await fetch('http://localhost:8080/unidad/alquilar_unidad', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });
    
                if (!response.ok) throw new Error('Error al agregar el habitante a la unidad');
    
                await fetch(`http://localhost:8080/unidad/habitar_unidad/${habitarDatos.codigo}`, { method: 'PUT' });
                obtenerUnidades();
            }
    
            // Actualizar los datos de dueños e inquilinos tras la operación
            await datosDuenioInquilino(habitarDatos.codigo);
    
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false); // Ocultar estado de carga
        }
    };
    

    const deshabitarUnidad = async () => {
        if (!habitarDatos.codigo) {
            setError("Falta el código de la unidad.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }
    
        try {
            setAlertaCargando(true); // Mostrar cargando
            // Llamar a la API para deshabitar la unidad
            const response = await fetch(`http://localhost:8080/unidad/liberar_unidad/${habitarDatos.codigo}`, {
                method: 'PUT',
            });
    
            if (!response.ok) {
                throw new Error("Error al liberar la unidad");
            }
    
            // Actualizar el estado de dueños e inquilinos
            setInquilinos([]); // Vaciar la lista de inquilinos
    
            // Recargar las unidades para reflejar el cambio
            await obtenerUnidades();
            setError(null); // Limpiar posibles errores
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setAlertaCargando(false); // Ocultar cargando siempre
        }
    };
    

    useEffect(() => {
        const eliminarDuenio = async () => {
            if (!datosDuenios) return;
    
            try {
                setAlertaCargando(true); // Mostrar cargando al iniciar
                const response = await fetch('http://localhost:8080/unidad/eliminar_duenio', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosDuenios),
                });
    
                if (!response.ok) throw new Error('Error al eliminar dueño de la unidad');
    
                // Actualizamos los datos directamente
                await datosDuenioInquilino(habitarDatos.codigo);
                setDatosDuenios(null); // Reseteamos el estado
            } catch (error) {
                setError(error.message);
                setMostrarError(true);
                setTimeout(() => setMostrarError(false), 3000);
            } finally {
                setAlertaCargando(false); // Ocultar cargando siempre al final
            }
        };
    
        eliminarDuenio();
    }, [datosDuenios]);
    
    useEffect(() => {
        const eliminarInquilino = async () => {
            if (!datosInquilinos) return;
    
            try {
                setAlertaCargando(true); // Mostrar cargando al iniciar
                const response = await fetch('http://localhost:8080/unidad/eliminar_un_inquilino', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosInquilinos),
                });
    
                if (!response.ok) throw new Error('Error al eliminar el inquilino de la unidad');
    
                // Actualizamos los datos directamente
                await datosDuenioInquilino(habitarDatos.codigo);
                await obtenerUnidades();

                setDatosInquilinos(null); // Reseteamos el estado
            } catch (error) {
                setError(error.message);
                setMostrarError(true);
                setTimeout(() => setMostrarError(false), 3000);
            } finally {
                setAlertaCargando(false); // Ocultar cargando siempre al final
            }
        };
    
        eliminarInquilino();
    }, [datosInquilinos]);

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
                                            <th>Unidad</th>
                                            <th>Piso</th>
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
                                                <td>{unidad.numero}</td>
                                                <td>{unidad.piso}</td>
                                                <td className={unidad.habitado ? 'unidad_ocupada' : 'unidad_libre'}>
                                                    {unidad.habitado ? "Ocupado" : "Libre"}
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
                                Número:
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
                                                    onClick={() => setDatosDuenios({ documento: duenio.documento, unidadCodigo: habitarDatos.codigo })}
                                                />
                                            </section>
                                        ))}
                                        </article>
                                        <button className='boton_cancelar' onClick={deshabitarUnidad}>Eliminar todos</button>
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

                                            <article>
                                                <button onClick={() => setHabitarRol("habitante")}
                                                className={ (habitarRol==="habitante") ? "unidad_habitar_boton_activo" : "unidad_habitar_boton_desactivo" }>
                                                    <HabitanteIcono color= {(habitarRol==="habitante") ? "#4B83C1" : "#A2A9B3"}/>
                                                    
                                                </button>
                                                Habitante
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
                                                        onClick={() => setDatosInquilinos({ documento: inquilino.documento, unidadCodigo: habitarDatos.codigo })}
                                                    />
                                                </section>
                                            ))}
                                        </article>
                                        <button className='boton_cancelar' onClick={deshabitarUnidad}>Eliminar todos</button>
                                    </fieldset>
                                </section>
                                


                                <footer className='unidad_habitar_footer'>
                                    <button className='boton_general' onClick={habitarUnidad}>Confirmar</button>
                                    <button className='boton_cancelar' onClick={ (() => {setAlertaHabitar(false); setHabitarRol("")}) }>Cancelar</button>
                                </footer>

                            </div>
                        </div>

                    )}

                    {
                        alertaCargando && (
                            <div className="unidad_habitar_fondo">
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

                </main>
            </section>
        </>
    );
};

export default Unidad;
