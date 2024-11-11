import React, { useState } from 'react';

const ComponenteBusqueda = ({ onBuscar }) => {
    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    const handleInputChange = (e) => {
        const valor = e.target.value;
        setCriterioBusqueda(valor);
        onBuscar(valor);  
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar..."
                value={criterioBusqueda}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default ComponenteBusqueda;
