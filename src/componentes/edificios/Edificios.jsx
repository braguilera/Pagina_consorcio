import React, { useEffect, useState } from 'react';

const Edificios = () => {
    const [edificios, setEdificios] = useState([]); // Estado para los edificios
    const [error, setError] = useState(null); // Estado para manejar errores
    const [nuevoEdificio, setNuevoEdificio] = useState({ nombre: '', direccion: '' }); // Estado para el formulario
    const [mostrarError, setMostrarError] = useState(false); // Estado para mostrar el pop-up del error

    // Función para obtener la lista de edificios
    const obtenerEdificios = () => {
        fetch('http://localhost:8080/edificio/todos_edificios')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                };
                return response.json();
            })
            .then(data => setEdificios(data))
            .catch(error => setError(error.message));
    };

    useEffect(() => {
        obtenerEdificios();
    }, []);

    // Manejar el cambio de los campos del formulario
    const manejarCambio = (e) => {
        setNuevoEdificio({
            ...nuevoEdificio,
            [e.target.name]: e.target.value
        });
    };

    // Función para manejar el envío del formulario
    const manejarSubmit = async (e) => {
        e.preventDefault();

        // Verificar que los campos no estén vacíos (validación básica)
        if (!nuevoEdificio.nombre || !nuevoEdificio.direccion) {
            setError("Ambos campos son obligatorios.");
            setMostrarError(true);
            setTimeout(() => setMostrarError(false), 3000); // Ocultar el pop-up después de 3 segundos
            return;
        }

        // Hacer un POST a la API para agregar un nuevo edificio
        fetch('http://localhost:8080/edificio/agregar_edificio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEdificio),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al agregar el edificio');
                }
                return response.json();
            })
            .then(data => {
                // Actualizar la lista de edificios con el nuevo edificio
                setEdificios(prevEdificios => [...prevEdificios, data]);
                setNuevoEdificio({ nombre: '', direccion: '' }); // Limpiar el formulario
            })
            .catch(error => {
                setError(error.message);
                setMostrarError(true); // Mostrar el pop-up del error
                setTimeout(() => setMostrarError(false), 3000); // Ocultar el pop-up después de 3 segundos
            });
    };

    return (
        <div>
            <h2>Lista de Edificios</h2>
            {/* Mostrar la lista de edificios */}
            <ul>
                {edificios.map(edificio => (
                    <li key={edificio.codigo}>{edificio.nombre} - {edificio.direccion}</li>
                ))}
            </ul>

            <h3>Agregar Nuevo Edificio</h3>
            {/* Formulario para agregar un nuevo edificio */}
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
