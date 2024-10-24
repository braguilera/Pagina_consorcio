import React, { useEffect, useState } from 'react';
import { fetchDatos } from '../../datos/fetchDatos';

const Edificios = () => {
    const [edificios, setEdificios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Estado de carga
    const [nuevoEdificio, setNuevoEdificio] = useState({ nombre: '', direccion: '' });
    const [mostrarError, setMostrarError] = useState(false);

    // Función para obtener la lista de edificios usando fetchDatos
    const obtenerEdificios = async () => {
        setLoading(true); // Activar el estado de carga
        try {
            const data = await fetchDatos('http://localhost:8080/edificio/todos_edificios');
            setEdificios(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); // Desactivar el estado de carga
        }
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
            setNuevoEdificio({ nombre: '', direccion: '' });
        } catch (error) {
            setError(error.message);
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000);
        }
    };

    return (
        <div>
            <h2>Lista de Edificios</h2>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className='tabla_container'>
                    <tbody className='tabla_body'>
                        
                            {edificios.map(edificio => (
                                <tr className='tabla_objeto' key={edificio.codigo}> 
                                    <td>{edificio.codigo} </td>
                                    <td>{edificio.nombre}  </td>
                                    <td>{edificio.direccion} </td>
                                </tr>
                            ))}
                        
                    </tbody>
                </table>
            )}

            <h3>Agregar Nuevo Edificio</h3>
            <form onSubmit={manejarSubmit}>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="nombre"
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
                        value={nuevoEdificio.direccion}
                        onChange={manejarCambio}
                        required
                    />
                </label>
                <br />
                <button type="submit">Agregar Edificio</button>
            </form>

            {/* Mostrar el pop-up del error */}
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
        </div>
    );
};

export default Edificios;
