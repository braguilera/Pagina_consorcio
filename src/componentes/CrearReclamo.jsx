import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Contexto from '../contexto/Contexto';
import { fetchDatos } from '../datos/fetchDatos';

const CrearReclamo = () => {
    const {
        error,
        setError,
        setMostrarError,
        usuarioDni,
    } = useContext(Contexto);

    const [viviendasSelect, setViviendasSelect] = useState([]);

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
            const data = await fetchDatos(
                `http://localhost:8080/unidad/buscar_unidad_inquilino/${usuarioDni}`
            );
            setViviendasSelect(data);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    useEffect(() => {
        obtenerViviendas();
    }, []);

    // Maneja el cambio en la selección de zona
    const handleZonaChange = (event) => {
        const selectedValue = event.target.value;

        if (selectedValue === 'Comunidad') {
            setNuevoReclamo((prev) => ({
                ...prev,
                ubicacion: 'area comun',
                edificioCodigo: '',
                unidadCodigo: '',
            }));
        } else {
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

    // Maneja el cambio en el select de tipo de reclamo
    const handleTipoReclamoChange = (event) => {
        setNuevoReclamo((prev) => ({
            ...prev,
            tipoReclamo: event.target.value,
        }));
    };

    // Maneja el cambio en el textarea de descripción
    const handleDescripcionChange = (event) => {
        setNuevoReclamo((prev) => ({
            ...prev,
            descripcion: event.target.value,
        }));
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
                                        onChange={handleZonaChange} // Manejar cambio aquí
                                    >
                                        <option value="Comunidad">
                                            Comunidad
                                        </option>
                                        {viviendasSelect.map((vivienda) => (
                                            <option
                                                key={vivienda.id}
                                                value={vivienda.id}
                                            >
                                                {`${vivienda.edificio.nombre}, piso:${vivienda.piso}, unidad:${vivienda.numero}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <h3>Tema</h3>
                                <select onChange={handleTipoReclamoChange}>
                                    <option value="Plomería">Plomería</option>
                                    <option value="Electricidad">Electricidad</option>
                                    <option value="Otro">Otro...</option>
                                </select>
                            </article>

                            <article className='crearReclamo_descripcion'>
                                <h3>Descripción (Máximo 200 caracteres)</h3>
                                <textarea
                                    maxLength={200}
                                    onChange={handleDescripcionChange} // Manejar cambio aquí
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
                            onClick={() => console.log(nuevoReclamo)} // Para pruebas
                        >
                            Enviar reclamo
                        </motion.button>
                    </footer>
                </article>
            </main>
        </section>
    );
};

export default CrearReclamo;
