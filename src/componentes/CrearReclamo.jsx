import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Contexto from '../contexto/Contexto';
import { fetchDatos } from '../datos/fetchDatos';
import loader from '../iconos/loader.svg'

const CrearReclamo = () => {
    const {
        error,
        setError,
        mostrarError,
        setMostrarError,
        usuarioDni,
    } = useContext(Contexto);

    const [viviendasSelect, setViviendasSelect] = useState([]);
    const [alertaExito, setAlertaExito] = useState(false);
    const [numeroReclamo, setNumeroReclamo] = useState();
    const [alertaCargando, setAlertaCargando] = useState(false)


    const [nuevoReclamo, setNuevoReclamo] = useState({
        usuarioCodigo: usuarioDni,
        edificioCodigo: '',
        ubicacion: '',
        unidadCodigo: '',
        descripcion: '',
        tipoReclamo: '',
        estado: 'Nuevo',
    });

    const obtenerViviendas = async () => {
        try {
            setAlertaCargando(true); 
            const dataDuenios = await fetchDatos(
                `http://localhost:8080/unidad/buscar_unidad_duenios/${usuarioDni}`
            );
            const dataInquilinos = await fetchDatos(
                `http://localhost:8080/unidad/buscar_unidad_inquilino/${usuarioDni}`
            );
        
            // Filtra las viviendas que no contengan un inquilino
            const filtroDataDuenios = dataDuenios.filter(vivienda => vivienda.inquilinos.length == 0);

            console.log(dataInquilinos)

            // Combina y filtra duplicados
            const combinadoData = [...filtroDataDuenios, ...dataInquilinos];           

            setViviendasSelect(combinadoData);
            console.log(viviendasSelect)
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }finally{
            setAlertaCargando(false)
        }
    };
    
    useEffect(() => {
        obtenerViviendas();
    }, []);



    const handleZonaChange = (event) => {
        const selectedValue = event.target.value;
    
        // Si el valor empieza con "comunidad-", es una opción de comunidad
        if (selectedValue.startsWith("comunidad-")) {
            const nombreEdificio = selectedValue.replace("comunidad-", ""); // Obtén el nombre del edificio
            const edificio = viviendasSelect.find(v => v.edificio.nombre === nombreEdificio)?.edificio;
    
            if (edificio) {
                setNuevoReclamo((prev) => ({
                    ...prev,
                    ubicacion: 'area comun',
                    edificioCodigo: edificio.codigo, // Asigna el código del edificio
                    unidadCodigo: '', // No hay unidad específica
                }));
            }
        } else {
            // Caso estándar: Selección de vivienda
            const vivienda = viviendasSelect.find((v) => v.id === Number(selectedValue));
            if (vivienda) {
                setNuevoReclamo((prev) => ({
                    ...prev,
                    ubicacion: 'vivienda',
                    edificioCodigo: vivienda.edificio.codigo,
                    unidadCodigo: vivienda.id,
                }));
            }
        }
    };
    

    const handleTipoReclamoChange = (event) => {
        setNuevoReclamo((prev) => ({
            ...prev,
            tipoReclamo: event.target.value,
        }));
    };

    const handleDescripcionChange = (event) => {
        setNuevoReclamo((prev) => ({
            ...prev,
            descripcion: event.target.value,
        }));
    };

    const enviarReclamo = async (e) => {

        // Si no hay viviendas, mostrar un error y salir
        if (viviendasSelect.length === 0) {
            setError("No hay viviendas disponibles para realizar un reclamo.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        // Validar la descripción
        if (!e.descripcion) {
            setError("La descripción es obligatoria.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }            
    
        try {

            
            let reclamoOrdenado;
        
            // Si faltan datos clave, asignar valores predeterminados
            if (!e.edificioCodigo || !e.ubicacion && !e.tipoReclamo) {
                const primeraVivienda = viviendasSelect[0];
                console.log("e", primeraVivienda)
                reclamoOrdenado = {
                    usuarioCodigo: e.usuarioCodigo,
                    edificioCodigo:  primeraVivienda.edificio.codigo,
                    ubicacion: 'vivienda',
                    unidadCodigo: primeraVivienda.id,
                    descripcion: e.descripcion,
                    tipoReclamo: 'Plomería',
                    estado: e.estado,
                }
            };
        
            // Asignar tipo de reclamo predeterminado si no está seleccionado
            if (e.edificioCodigo || e.ubicacion && !e.tipoReclamo) {
                reclamoOrdenado = {
                    usuarioCodigo: e.usuarioCodigo,
                    edificioCodigo: e.edificioCodigo,
                    ubicacion: e.ubicacion,
                    unidadCodigo: e.unidadCodigo,
                    descripcion: e.descripcion,
                    tipoReclamo: 'Plomería',
                    estado: e.estado,
                };
            };
            
            if(e.edificioCodigo && e.ubicacion && e.tipoReclamo){
                reclamoOrdenado = {
                    usuarioCodigo: e.usuarioCodigo,
                    edificioCodigo: e.edificioCodigo,
                    ubicacion: e.ubicacion,
                    unidadCodigo: e.unidadCodigo,
                    descripcion: e.descripcion,
                    tipoReclamo: e.tipoReclamo,
                    estado: e.estado,
                };

            };

            console.log(reclamoOrdenado)

            const response = await fetch('http://localhost:8080/reclamo/agregar_reclamo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reclamoOrdenado),
            });
    
            if (!response.ok) throw new Error('Error al agregar un nuevo reclamo');

            const data = await response.json();
            
            setNumeroReclamo(data.numero)
    
            // Resetear el formulario
            setNuevoReclamo({
                usuarioCodigo: usuarioDni,
                edificioCodigo: '',
                ubicacion: '',
                unidadCodigo: '',
                descripcion: '',
                tipoReclamo: '',
                estado: 'Nuevo',
            });

            setAlertaExito(true)
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };
    
    

    return (
        <section className='crearReclamo'>
            <header className='crearReclamo_header'>
                <h1>Nuevo Reclamo</h1>
                <p>Describe el problema y adjunta imágenes si es necesario</p>
            </header>



            <main className='crearReclamo_main'>
                <aside className='crearReclamo_imagen'></aside>
                <article className='crearReclamo_container'>
                    <h2> Detallanos tu solicitud </h2>

                    <div className='crearReclamo_grid'>
                        <header className='crearReclamo_container_header'>
                            <article className='crearReclamo_inputs'>
                                <h3>¿En qué zona es el reclamo?</h3>
                                <div className='crearReclamo_inputs_radio'>
                                <select
                                    className='personas_select'
                                    onChange={handleZonaChange} 
                                >
                                    {viviendasSelect.map((vivienda) => (
                                        <option
                                            key={`vivienda-${vivienda.id}`}
                                            value={vivienda.id}
                                        >
                                            {`${vivienda.edificio.nombre}, piso:${vivienda.piso}, unidad:${vivienda.numero}`}
                                        </option>
                                    ))}

                                    {[...new Set(viviendasSelect.map(vivienda => vivienda.edificio.nombre))]
                                        .map((nombreEdificio, index) => (
                                            <option 
                                                key={`comunidad-${index}`} 
                                                value={`comunidad-${nombreEdificio}`}
                                            >
                                                {`Comunidad, ${nombreEdificio}`}
                                            </option>
                                        ))}
                                </select>

                                </div>

                                <h3>Tema</h3>
                                <select onChange={handleTipoReclamoChange} className='personas_select'>
                                    <option value="Plomería">Plomería</option>
                                    <option value="Electricidad">Electricidad</option>
                                    <option value="Otro">Otro...</option>
                                </select>
                            </article>

                            <article className='crearReclamo_descripcion'>
                                <h3>Descripción (Máximo 200 caracteres)</h3>
                                <textarea
                                    maxLength={200}
                                    onChange={handleDescripcionChange} 
                                />
                            </article>
                        </header>

                        <aside className='crearReclamo_adjuntarImagenes'>
                            <h3>Adjuntar imagenes (Máximo 3 imágenes)</h3>
                        </aside>
                    </div>

                    <footer className='crearReclamo_container_button'>
                        <motion.button
                            className='boton_general'
                            type='submit'
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => enviarReclamo(nuevoReclamo)} 
                        >
                            Enviar reclamo
                        </motion.button>
                    </footer>



                </article>

                {
                        alertaCargando && (
                                <div className="crearReclamo_main_alerta">
                                    
                                    <img src={loader}/>
                                    
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


                { alertaExito && (
                    <main className='alerta_fondo'>
                        <div className='alertaEliminar'>
                            <h1>¡Reclamo enviado con éxito!</h1>
                            <p>El número de orden de su reclamo es <strong className='numero_reclamo'>{numeroReclamo}</strong></p>
                            <button onClick={()=> setAlertaExito(false)} className='boton_general'>Aceptar</button>
                        </div>
                    </main>
                )}

            </main>
        </section>
    );
};

export default CrearReclamo;
