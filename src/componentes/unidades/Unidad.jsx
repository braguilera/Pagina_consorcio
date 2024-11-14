import React, { useContext, useEffect, useState } from 'react';
import Contexto from '../../contexto/Contexto';
import { fetchDatos } from '../../datos/fetchDatos';
import { motion } from 'framer-motion';
import AnimacionCarga from '../funcionalidades/AnimacionCarga';
import Paginacion from '../funcionalidades/Paginacion';

const Unidad = () => {

    const { error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual } = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [idEdificio, setIdEdificio] = useState(null);

    const [unidades, setUnidades] = useState([]);
    const [unidadesFiltradas, setUnidadesFiltradas] = useState([]);

    const [nuevaUnidad, setNuevaUnidad] = useState({ piso: "", numero: "", habitado: false, codigoEdificio: "" });

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
                                                className='tabla_objeto'
                                                initial={{ opacity: 0, y: -50 }}
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
                </main>
            </section>
        </>
    );
};

export default Unidad;
