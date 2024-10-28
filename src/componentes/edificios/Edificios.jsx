import React, { useContext, useEffect, useState } from 'react';
import { fetchDatos } from '../../datos/fetchDatos';
import { MagicMotion } from 'react-magic-motion';
import Paginacion from '../funcionalidades/Paginacion';
import Contexto from '../../contexto/Contexto';

const Edificios = () => {
    const {error, setError, loading, setLoading, mostrarError, setMostrarError, idBusqueda, setIdBusqueda, paginaActual, setPaginaActual} = useContext(Contexto);

    const [edificios, setEdificios] = useState([]);
    const [nuevoEdificio, setNuevoEdificio] = useState({ nombre: '', direccion: '' });
    const [edificiosFiltrados, setEdificiosFiltrados] = useState([]);
    const edificiosPorPagina = 10;
    
    const indiceInicio = (paginaActual - 1) * edificiosPorPagina;
    const indiceFin = indiceInicio + edificiosPorPagina;

    const edificiosPaginados = edificiosFiltrados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(edificiosFiltrados.length / edificiosPorPagina);

    const obtenerEdificios = async () => {
        setLoading(true);
        try {
            const data = await fetchDatos('http://localhost:8080/edificio/edificios');
            setEdificios(data);
            setEdificiosFiltrados(data);
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const filtrarEdificios = (event) => {
        const idEdificio = event.target.value;
        setIdBusqueda(idEdificio);

        if (idEdificio === '') {
            setEdificiosFiltrados(edificios);
        } else {
            const filtrados = edificios.filter(edificio =>
                edificio.codigo.toString().startsWith(idEdificio)
            );
            setEdificiosFiltrados(filtrados);
        }
        setPaginaActual(1);
    };

    useEffect(() => {
        obtenerEdificios();
    }, []);

    const manejarCambio = (e) => {
        setNuevoEdificio({
            ...nuevoEdificio,
            [e.target.name]: e.target.value
        });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        if (!nuevoEdificio.nombre || !nuevoEdificio.direccion) {
            setError("Ambos campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/edificio/agregar_edificio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEdificio),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el edificio');
            }

            const data = await response.json();
            setEdificios(prevEdificios => [...prevEdificios, data]);
            setEdificiosFiltrados(prevEdificios => [...prevEdificios, data]);
            setNuevoEdificio({ nombre: '', direccion: '' });
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };



    return (
        <section className='edificios'>
            <header className='edificios_titulos'>
                <h2> Gestión de Edificios</h2>
                <p>Visualiza, agrega y administra los edificios registrados en el sistema.</p>
            </header>
            <main className='edificios_main'>
                <MagicMotion>
                    {loading ? (
                        <div className='tabla_cargando'>Cargando...</div>
                    ) : (
                        <table className='tabla_container'>
                            <div className='tabla_container_items'>
                                <input
                                    id='idEdificio'
                                    type='number'
                                    placeholder='Buscar por ID'
                                    value={idBusqueda}
                                    onChange={filtrarEdificios}
                                />
                                <tbody className='tabla_body'>
                                    <thead className='tabla_encabezado'>
                                        <tr>
                                            <th>Id</th>
                                            <th>Nombre</th>
                                            <th>Dirección</th>
                                        </tr>
                                    </thead>
                                    {edificiosPaginados.length > 0 ? (
                                        edificiosPaginados.map(edificio => (
                                            <tr className='tabla_objeto' key={edificio.codigo}>
                                                <td>{edificio.codigo}</td>
                                                <td>{edificio.nombre}</td>
                                                <td>{edificio.direccion}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">No se encontró ningún edificio.</td>
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
                    <aside className='agregar_edificio_container'>
                        <h3>Agregar Nuevo Edificio</h3>
                        <form onSubmit={manejarSubmit} className='agregar_edificio_form'>
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder='Ingresar un nombre'
                                    value={nuevoEdificio.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Dirección:
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder='Ingresar una dirección'
                                    value={nuevoEdificio.direccion}
                                    onChange={manejarCambio}
                                    required
                                />
                            </label>
                            <br />
                            <button type="submit">Agregar Edificio</button>
                        </form>
                    </aside>
                </main>

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
    );
};

export default Edificios;
