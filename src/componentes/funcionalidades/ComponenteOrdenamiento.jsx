import React, { useState } from 'react';

const ComponenteOrdenamiento = ({ columnas, onOrdenar }) => {
    const [ordenActual, setOrdenActual] = useState({ columna: '', direccion: '' });

    const handleOrdenClick = (columna) => {
        let nuevaDireccion = 'asc';
        
        // Si el clic es en la misma columna, alternamos el orden
        if (ordenActual.columna === columna) {
            nuevaDireccion = ordenActual.direccion === 'asc' ? 'desc' : ordenActual.direccion === 'desc' ? '' : 'asc';
        }
        
        setOrdenActual({ columna, direccion: nuevaDireccion });
        onOrdenar(columna, nuevaDireccion);  // Emitimos el estado de la ordenación al componente padre
    };

    return (
        <thead>
            <tr>
                {columnas.map((columna) => (
                    <th key={columna} onClick={() => handleOrdenClick(columna)}>
                        {columna} {ordenActual.columna === columna ? (ordenActual.direccion === 'asc' ? '↑' : '↓') : ''}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default ComponenteOrdenamiento;
