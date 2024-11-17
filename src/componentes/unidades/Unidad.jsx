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

const Unidad = () => {

    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);

    const [unidades, setUnidades] = useState([]);
    const [unidadesFiltradas, setUnidadesFiltradas] = useState([]);

    const [nuevaUnidad, setNuevaUnidad] = useState({ piso: "", numero: "", habitado: false, codigoEdificio: "" });
    const [duenioInquilino, setDuenioInquilino] = useState( {duenio:"", inquilino:""} )

    const [alertaHabitar, setAlertaHabitar] = useState(false)
    const [alertaDeshabitar, setAlertaDeshabitar] = useState(false)

    const [habitarDatos, setHabitarDatos] = useState( {codigo:"", documento:""} )
    const [eliminarDatos, setEliminarDatos] = useState( {documento:"", unidadCodigo:""} )


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
    
        if (unidad.habitado) {
            setAlertaDeshabitar(true);
        } else {
            setAlertaHabitar(true);
        }
    };
    
    const datosDuenioInquilino = async (codigo) => {
        try {
            const dataDuenios = await fetchDatos(`http://localhost:8080/persona/duenios_por_unidad/${codigo}`);
            setDuenios(dataDuenios);
    
            const dataInquilinos = await fetchDatos(`http://localhost:8080/persona/inquilinos_por_unidad/${codigo}`);
            setInquilinos(dataInquilinos);
    
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    
        setDuenioInquilino({ duenio: "Carlos", inquilino: "Elian" });
    };
    
    


    const habitarUnidad = async (e) =>{
        e.preventDefault();

        if (!habitarDatos.codigo || !habitarDatos.documento || !habitarRol ) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        try {

            if(habitarRol=="duenio"){
                const response = await fetch('http://localhost:8080/unidad/agregar_duenio', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });

                if (!response.ok) {
                    throw new Error('Error al agregar la persona a la unidad');
                }
            }

            
            else if(habitarRol=="inquilino"){
                const response = await fetch('http://localhost:8080/unidad/agregar_inquilino', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });

                await fetch(`http://localhost:8080/unidad/habitar_unidad/${habitarDatos.codigo}`, {
                    method: 'PUT'
                });

                if (!response.ok) {
                    throw new Error('Error al agregar la persona a la unidad');
                }
            }

            else if(habitarRol=="habitante"){
                const response = await fetch('http://localhost:8080/unidad/alquilar_unidad', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(habitarDatos),
                });

                await fetch(`http://localhost:8080/unidad/habitar_unidad/${habitarDatos.codigo}`, {
                    method: 'PUT'
                });


                if (!response.ok) {
                    throw new Error('Error al agregar la persona a la unidad');
                }
            }
            
            setHabitarDatos({ codigo: "", documento: "" });
            setHabitarRol("");
            setAlertaHabitar(false);
            obtenerUnidades(); 

        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    }

    const eliminarDuenioUnidad = async (e)=>{
        e.preventDefault();
        setAlertaHabitar(false);

        alert("Duenio eliminado")
        
    }

    const deshabitarUnidad = async (e) =>{
        e.preventDefault();

        if (!habitarDatos.codigo) {
            setError("Todos los campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/unidad/liberar_unidad/${habitarDatos.codigo}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error('Error al agregar la persona a la unidad');
            }

            setHabitarDatos({ codigo: "", documento: "" });
            setAlertaDeshabitar(false);
            obtenerUnidades();
            
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    }

    const eliminarDuenio = async () =>{

    }

    const eliminarInquilino = async (documentoPersona) =>{
        
        setEliminarDatos( {documento:documentoPersona, unidadCodigo:habitarDatos.codigo} )
        console.log(eliminarDatos)

        try{
            const response = await fetch('http://localhost:8080/unidad/eliminar_un_inquilino', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eliminarDatos),
            });

            if (!response.ok) {
                throw new Error('Error al agregar la persona a la unidad');
            }

            setEliminarDatos( {documento:"", unidadCodigo:""} )
            datosDuenioInquilino()

        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
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
                                <footer className='unidad_habitar_footer'>
                                    <button className='boton_general' onClick={habitarUnidad}>Confirmar</button>
                                    <button className='boton_cancelar' onClick={ (() => {setAlertaHabitar(false); setHabitarRol("")}) }>Cancelar</button>
                                </footer>

                            </div>
                        </div>

                    )}

                    {alertaDeshabitar && (
                        <div className="unidad_habitar_fondo">

                            <div className="unidad_habitar">
                                <h3>Unidad {habitarDatos.codigo}</h3>

                                <div>
                                        <fieldset>
                                            <legend>Dueños</legend>
                                            {duenios.map( duenio =>
                                                <div>
                                                    {duenio.documento} {duenio.nombre}
                                                    <img
                                                        src={eliminar}
                                                        alt='boton para eliminar un dueño'
                                                        onClick={() => eliminarDuenio(duenio.documento)}
                                                    />
                                                </div>
                                                )
                                            }
                                        </fieldset>
                                    <button onClick={eliminarDuenioUnidad}>Aceptar</button>
                                </div>
                                <div>
                                        <fieldset>
                                            <legend>Inquilinos:</legend>
                                            {inquilinos.map( inquilino =>
                                                <div>
                                                    {inquilino.documento} {inquilino.nombre}
                                                    <img
                                                        src={eliminar}
                                                        alt='boton para eliminar un inquilino'
                                                        onClick={() => eliminarInquilino(inquilino.documento)}
                                                    />
                                                </div>
                                                )
                                            }
                                        </fieldset>
                                    <button onClick={deshabitarUnidad}>Eliminar todos</button>
                                </div>

                                
                                <button onClick={() => setAlertaDeshabitar(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}


                </main>
            </section>
        </>
    );
};

export default Unidad;
